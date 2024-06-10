const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { sendWhatsApp } = require('../utils/whatsapp');

exports.createOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        const newOrder = new Order({ user: userId, items });
        await newOrder.save();

        const message = `Nuevo pedido de ${user.firstName} ${user.lastName}:\n${items.map(item => `${item.product}: ${item.quantity}`).join('\n')}`;

        // Send Email
        // await sendEmail('danisl47@hotmail.com', 'New Order', message);

        // // Send WhatsApp if phone number is provided
        // if (user.phone) {
        //     await sendWhatsApp('+34655599021', message);
        // }

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getOrders = async (req, res) => {
    const userId = req.user.userId;
    try {
        const orders = await Order.find({ user: userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { items } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { items }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({ message: 'Order Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
