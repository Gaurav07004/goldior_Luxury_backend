import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId, // Assuming user_id references a User model
        required: true,
        ref: 'User',
    },
    items: [{
        imgUrl: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        bottle_size: {
            type: String,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Create the cart model
const Cart = model('Cart', cartSchema);

export default Cart;
