const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const { auth } = require('../../middleware/auth');
const cors = require('cors');

dotenv.config();

const app = express();

// Configuramos CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:5173' // Cambia esto a la URL de tu frontend si es diferente
}));

// Middlewares
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes); // Protected route, requires authentication
app.use('/api/orders', auth, orderRoutes); // Protected route, requires authentication
app.use('/api/news', newsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
