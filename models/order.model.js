import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId, // Assuming user_id references a User model
        required: true,
        ref: 'User', // Reference to the User model
    },
    items: [{
        product_id: {
            type: Schema.Types.ObjectId, // Assuming each item references a Product model
            required: true,
            ref: 'Product', // Reference to the Product model
        },
        quantity: {
            type: Number,
            required: true,
            min: 1, // Ensures quantity is at least 1
        },
        price: {
            type: Number,
            required: true,
            min: 0, // Ensures price cannot be negative
        },
    }],
    total_cost: {
        type: Number,
        required: true,
        min: 0, // Ensures total cost cannot be negative
    },
    payment_method: {
        type: String,
        required: true,
        enum: ['credit_card', 'paypal', 'bank_transfer'], // Example payment methods
    },
    estimated_delivery_date: {
        type: Date,
        required: true, // Ensures the estimated delivery date is provided
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], // Order status options
        default: 'pending', // Default status is 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the creation date
    }
});

// Create the order model
const Order = model('Order', orderSchema);

export default Order;
