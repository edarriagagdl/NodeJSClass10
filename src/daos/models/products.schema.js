import mongoose from 'mongoose';
const productCollection = 'products';

const ProductsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  thumbnails: {
    type: String,
  },
  status: {
    type: Boolean,
  },
});

export default mongoose.model('Products', ProductsSchema);
