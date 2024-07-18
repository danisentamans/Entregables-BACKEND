const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { sendWhatsApp } = require('../utils/whatsapp');
const dotenv = require('dotenv');

dotenv.config();

exports.createOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        const newOrder = new Order({ user: userId, items });
        await newOrder.save();

        const message = `Nuevo pedido de ${user.firstName} ${user.lastName}:\n${items.map(item => `${item.product}: ${item.quantity}`).join('\n')}`;

        // Send Email
        await sendEmail(process.env.ADMIN_EMAIL, 'Nuevo Pedido', message);

        // Send WhatsApp if phone number is provided
        if (user.phone) {
            await sendWhatsApp(process.env.ADMIN_NUMBER_PHONE, message);
        }

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getOrders = async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        // Si el usuario es administrador, obtener todos los pedidos
        if (user.role == 'admin') {
            const orders = await Order.find();
            return res.status(200).json(orders);
        }
        else{
            const orders = await Order.find({ user: userId });
            res.status(200).json(orders);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getOrdersById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { items } = req.body;
    const userId = req.user.userId;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { items }, { new: true });

        const user = await User.findById(userId);

        const message = `Pedido actualizado de ${user.firstName} ${user.lastName}:\n${items.map(item => `${item.product}: ${item.quantity}`).join('\n')}`;

        // Send Email
        await sendEmail(process.env.ADMIN_EMAIL, 'Pedido Actualizado', message);

        // Send WhatsApp if phone number is provided
        if (user.phone) {
            await sendWhatsApp(process.env.ADMIN_NUMBER_PHONE, message);
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        await Order.findByIdAndDelete(id);

        const user = await User.findById(userId);

        const message = `${user.firstName} ${user.lastName} ha eliminado el pedido`;

        // Send Email
        await sendEmail(process.env.ADMIN_EMAIL, 'Pedido Eliminado', message);

        // Send WhatsApp if phone number is provided
        if (user.phone) {
            await sendWhatsApp(process.env.ADMIN_NUMBER_PHONE, message);
        }

        res.status(200).json({ message: 'Order Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
