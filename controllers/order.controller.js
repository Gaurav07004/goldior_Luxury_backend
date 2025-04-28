import Order from '../models/order.model.js'; // Make sure to adjust the path as necessary

const addOrder = async (req, res) => {
    try {
        const { user_id, items, total_cost, payment_method, estimated_delivery_date, status } = req.body;

        // Create a new order instance
        const newOrder = new Order({
            user_id,
            items,
            total_cost,
            payment_method,
            estimated_delivery_date,
            status
        });

        // Save the order to the database
        await newOrder.save();

        // Send back the saved order data in the response
        res.status(201).json({
            id: newOrder._id,
            user_id: newOrder.user_id,
            items: newOrder.items,
            total_cost: newOrder.total_cost,
            payment_method: newOrder.payment_method,
            estimated_delivery_date: newOrder.estimated_delivery_date,
            status: newOrder.status,
            createdAt: newOrder.createdAt,
            updatedAt: newOrder.updatedAt,
        });

    } catch (error) {
        console.error("Error in order add controller: ", error.message);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const skip = (page - 1) * pageSize;

        const orders = await Order.find()
            .populate('user_id') // Optionally populate user data if needed
            .skip(skip)
            .limit(pageSize);

        const totalOrders = await Order.countDocuments();

        const totalPages = Math.ceil(totalOrders / pageSize);

        res.status(200).json({
            orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
                pageSize,
            },
        });

    } catch (error) {
        console.error("Error fetching orders: ", error.message);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

export { addOrder, getOrders };
