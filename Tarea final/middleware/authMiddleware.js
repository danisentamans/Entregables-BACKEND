const User = require('../backend/src/models/User');

const isAdmin = async (req, res, next) => {
    try {
        console.log("User: ", req.user)
        const user = await User.findById(req.user.userId);
        console.log("Es admin? ", user, " Rol: ", user.role)
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Función para actualizar el rol de un usuario a administrador
const makeAdmin = async (req, res) => {
    try {
        // Buscar al usuario por su ID y actualizar su rol
        const user = await User.findByIdAndUpdate(req.user.userId, { role: 'admin' }, { new: true });
        res.status(200).json({ message: 'User role updated to admin', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { isAdmin, makeAdmin };
