const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  ticker: String,
  bar: {
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    time: Date
  },
  strategy: {
    order_contracts: Number,
    order_price: Number,
    order_comment: String
  },
  order: String,
  stopLoss: Number,
  takeProfit: Number,
  closePrice: Number,
  profitOrLoss: Number
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
