const Review = require('../models/Review');
const Product = require('../models/Product');

const recalcProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating = numReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
    : 0;
  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating,
      comment
    });
    await recalcProductRating(req.params.productId);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const productId = review.product;
    await review.deleteOne();
    await recalcProductRating(productId);
    res.json({ message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductReviews, createReview, deleteReview };
