import mongoose from 'mongoose';
const productCollection = 'carts';

const cartItemSchema = new mongoose.Schema({
	product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const CartsSchema = new mongoose.Schema({
  items: [cartItemSchema],
});

export default mongoose.model('Carts', CartsSchema);
