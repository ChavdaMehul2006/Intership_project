const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { productImages, getImagesForProduct } = require('./productImages');

const categoryImages = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  'Home & Living': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
  'Beauty': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  'Sports & Outdoors': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
};

const updateDatabase = async () => {
  await connectDB();
  console.log('Connected to MongoDB. Updating product images...');

  const products = await Product.find({});
  let updatedCount = 0;

  for (const product of products) {
    const newImages = getImagesForProduct(product.name);
    product.images = newImages;
    product.markModified('images');
    await product.save();
    updatedCount++;
    console.log(`[${updatedCount}/${products.length}] Updated: "${product.name}" -> ${newImages[0]}`);
  }

  console.log('\nUpdating category images...');
  const categories = await Category.find({});
  for (const cat of categories) {
    if (categoryImages[cat.name]) {
      cat.image = categoryImages[cat.name];
      await cat.save();
      console.log(`Updated Category: "${cat.name}"`);
    }
  }

  console.log('\nUpdating order item images...');
  const orders = await Order.find({});
  let updatedOrders = 0;
  for (const order of orders) {
    let orderChanged = false;
    for (const item of order.items) {
      const match = products.find((p) => p._id.toString() === item.product?.toString() || p.name === item.name);
      if (match && match.images && match.images.length > 0) {
        item.image = match.images[0];
        orderChanged = true;
      }
    }
    if (orderChanged) {
      await order.save();
      updatedOrders++;
    }
  }
  console.log(`Updated ${updatedOrders} orders.`);

  console.log('\nAll products, categories, and orders have been successfully updated with real photos!');
  await mongoose.disconnect();
  process.exit(0);
};

updateDatabase().catch((err) => {
  console.error('Error updating database:', err);
  process.exit(1);
});
