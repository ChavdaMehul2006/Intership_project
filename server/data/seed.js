const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

const categoriesData = [
  { name: 'Electronics', description: 'Gadgets, devices and accessories' },
  { name: 'Fashion', description: 'Clothing, footwear and accessories' },
  { name: 'Home & Living', description: 'Furniture and home decor' },
  { name: 'Beauty', description: 'Skincare, makeup and personal care' },
  { name: 'Sports & Outdoors', description: 'Fitness and outdoor gear' }
];

const productNames = {
  Electronics: ['Wireless Earbuds Pro', 'Smart Fitness Watch', 'Bluetooth Speaker', '4K Action Camera', 'Portable Power Bank', 'Mechanical Keyboard', 'Noise Cancelling Headphones', '27" Monitor'],
  Fashion: ['Classic Denim Jacket', 'Running Sneakers', 'Leather Wallet', 'Cotton Hoodie', 'Aviator Sunglasses', 'Analog Wrist Watch', 'Canvas Backpack', 'Wool Scarf'],
  'Home & Living': ['Ceramic Table Lamp', 'Memory Foam Pillow', 'Aroma Diffuser', 'Wall Art Canvas Set', 'Non-stick Cookware Set', 'Bamboo Cutting Board', 'Cozy Throw Blanket', 'Storage Ottoman'],
  Beauty: ['Vitamin C Serum', 'Matte Lipstick Set', 'Hydrating Face Mask', 'Argan Hair Oil', 'Sunscreen SPF 50', 'Makeup Brush Kit', 'Herbal Shampoo', 'Rose Water Toner'],
  'Sports & Outdoors': ['Yoga Mat Premium', 'Adjustable Dumbbell Set', 'Camping Tent 2-Person', 'Insulated Water Bottle', 'Resistance Bands Kit', 'Cycling Helmet', 'Hiking Backpack 40L', 'Jump Rope Speed']
};

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
    Order.deleteMany(),
    Review.deleteMany()
  ]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123_secure_password',
    role: 'admin'
  });

  const customer = await User.create({
    name: 'Standard Customer',
    email: 'user@example.com',
    password: 'user123_secure_password',
    role: 'customer'
  });

  console.log('Creating categories...');
  const categories = await Category.insertMany(
    categoriesData.map((c) => ({ ...c, slug: slugify(c.name) }))
  );

  console.log('Creating products...');
  const products = [];
  for (const cat of categories) {
    const names = productNames[cat.name] || [];
    for (const name of names) {
      const price = randomBetween(15, 250);
      const hasDiscount = Math.random() > 0.6;
      products.push({
        name,
        slug: slugify(name) + '-' + Math.random().toString(36).slice(2, 7),
        description: `${name} - premium quality from our ${cat.name} collection. Designed for comfort, durability, and everyday value.`,
        price,
        discountPrice: hasDiscount ? Math.round(price * 0.8) : 0,
        category: cat._id,
        brand: 'AuraShop',
        images: [`https://picsum.photos/seed/${slugify(name)}/600/600`],
        stock: randomBetween(0, 60),
        sku: `SKU-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
        tags: [cat.name.toLowerCase()],
        isFeatured: Math.random() > 0.75
      });
    }
  }
  const createdProducts = await Product.insertMany(products);

  console.log('Creating a sample review...');
  await Review.create({
    product: createdProducts[0]._id,
    user: customer._id,
    rating: 5,
    comment: 'Excellent quality, exactly as described. Highly recommend!'
  });
  createdProducts[0].rating = 5;
  createdProducts[0].numReviews = 1;
  await createdProducts[0].save();

  console.log('Creating a sample order...');
  const sampleItems = createdProducts.slice(0, 2).map((p) => ({
    product: p._id,
    name: p.name,
    image: p.images[0],
    price: p.discountPrice > 0 ? p.discountPrice : p.price,
    quantity: 1
  }));
  const itemsPrice = sampleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  await Order.create({
    user: customer._id,
    items: sampleItems,
    shippingAddress: {
      line1: '221B Baker Street',
      city: 'Vadodara',
      state: 'Gujarat',
      postalCode: '390001',
      country: 'India',
      phone: '9999999999'
    },
    paymentMethod: 'cod',
    itemsPrice,
    shippingPrice: itemsPrice > 500 ? 0 : 50,
    taxPrice: Number((itemsPrice * 0.08).toFixed(2)),
    totalPrice: Number((itemsPrice + (itemsPrice > 500 ? 0 : 50) + itemsPrice * 0.08).toFixed(2)),
    status: 'processing'
  });

  console.log('--------------------------------------------------');
  console.log('Seed complete!');
  console.log(`Admin login:    admin@example.com / admin123_secure_password`);
  console.log(`Customer login: user@example.com / user123_secure_password`);
  console.log('--------------------------------------------------');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
