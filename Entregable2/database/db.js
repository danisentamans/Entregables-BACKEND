const mongoose = require('mongoose');
const config = require('../config');
 
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conexión correcta'))
  .catch(err => console.error('MongoDB error al conectarse:', err));

const db = mongoose.connection;
module.exports = db;