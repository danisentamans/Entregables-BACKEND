const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const path = require("path");
const mongoose = require("mongoose");
const Binance = require("node-binance-api");
const axios = require("axios");
const Order = require("./models/Order");
const db = require("./database/db");
const cookieParser = require("cookie-parser");

const app = express();
const binance = new Binance().options({
  APIKEY: config.API_KEY,
  APISECRET: config.API_SECRET,
  useServerTime: true,
});

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//Cookies
app.use(cookieParser()); // Utilizamos el middleware cookie-parser

let latestData = [];

// Función para generar un ID de orden aleatorio
function generateOrderId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Función para procesar y ejecutar las operaciones según el comentario recibido
function processOrder(comment) {
  let slPrice = 0;
  let tpPrice = 0;
  let exitPrice = 0;
  let profitLoss = 0;

  if (comment.includes("Compra_Long")) {
    const prices = comment.split(": ")[1].split("; ");
    console.log(entryPrice);
    const pricesSL = comment.split(": ")[2].split("; ");
    slPrice = parseFloat(pricesSL[0]);
    const pricesTP = comment.split(": ")[3].split("; ");
    tpPrice = parseFloat(pricesTP[0]);
    // console.log(`Compra Long: ${entryPrice}, SL: ${slPrice}, TP: ${tpPrice}`);
  } else if (comment.includes("Venta_Short")) {
    const prices = comment.split(": ")[1].split("; ");
    const entryPrice = parseFloat(prices[0]);
    const pricesSL = comment.split(": ")[2].split("; ");
    slPrice = parseFloat(pricesSL[0]);
    const pricesTP = comment.split(": ")[3].split("; ");
    tpPrice = parseFloat(pricesTP[0]);
    // console.log(`Venta Short: ${entryPrice}, SL: ${slPrice}, TP: ${tpPrice}`);
  } else if (comment.includes("Compra_Cerrada")) {
    const prices = comment.split(": ")[1].split(", ");
    exitPrice = parseFloat(prices[0]);
    profitLoss = parseFloat(comment.split(": ")[2].split(", ")[0]);
    // console.log(
    //   `Compra Cerrada: ${exitPrice}, Beneficio/Pérdida: ${profitLoss}`
    // );
  } else if (comment.includes("Venta_Cerrada")) {
    const prices = comment.split(": ")[1].split(", ");
    exitPrice = parseFloat(prices[0]);
    profitLoss = parseFloat(comment.split(": ")[2].split(", ")[0]);
    // console.log(
    //   `Venta Cerrada: ${exitPrice}, Beneficio/Pérdida: ${profitLoss}`
    // );
  }

  return { slPrice, tpPrice, exitPrice, profitLoss };
}

// Función para crear una orden en Binance
async function createOrder(symbol, side, quantity, price) {
  try {
    const order = await binance.order({
      symbol,
      side,
      quantity,
      type: "LIMIT",
      price,
    });
    return order;
  } catch (error) {
    console.error("Error creando la orden:", error);
    return null;
  }
}

// Función para cerrar una orden en Binance
async function closeOrder(symbol, orderId) {
  try {
    const result = await binance.cancel(symbol, orderId);
    return result;
  } catch (error) {
    console.error("Error cerrando la orden:", error);
    return null;
  }
}

// Rutas
app.get("/", async (req, res) => {
  try {
    // Recuperar las órdenes desde la base de datos
    const orders = await Order.find();
    // const userId = req.cookies.userId;

    // Renderizar la vista 'index' y pasarle los datos de las órdenes
    res.render("index", {
      message: "Bienvenido al bot de trading",
      latestData: orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error en la base de datos" });
  }
});

// //Tratamiento de cookies

// Ejemplo de cómo establecer una cookie
app.get("/set-cookie", (req, res) => {
  // Establecer la cookie "userId" con el valor "12345" y una duración de 1 día
  res.cookie("userId", "12345", { maxAge: 86400000 }); // Duración de 1 día en milisegundos
  res.send("Cookie establecida correctamente");
});

// Ejemplo de cómo eliminar una cookie
app.get("/clear-cookie", (req, res) => {
  // Borrar la cookie "userId"
  res.clearCookie("userId");
  res.send("Cookie eliminada correctamente");
});

app.post("/orders", async (req, res) => {
  const data = req.body;

  if (data.passphrase !== config.WEBHOOK_PASSPHRASE) {
    return res
      .status(401)
      .json({ code: "error", message: "Frase de paso inválida" });
  }

  const side = data.strategy.order_action.toUpperCase();
  const quantity = data.strategy.order_contracts;
  const symbol = data.ticker;
  const comment = data.strategy.order_comment;
  const price = parseFloat(data.strategy.order_price);
  const orderPosition = comment.includes("Compra_Long")
    ? "COMPRA"
    : comment.includes("Venta_Short")
    ? "VENTA"
    : comment.includes("Compra_Cerrada")
    ? "CIERRE COMPRA"
    : "CIERRE VENTA";

  const orderId = generateOrderId(10);
  const { slPrice, tpPrice, exitPrice, profitLoss } = processOrder(commenty);

  const stopLoss = slPrice > 0 ? slPrice : "";
  const takeProfit = tpPrice > 0 ? tpPrice : "";
  const closePrice = exitPrice > 0 ? exitPrice : "";
  const profitOrLoss = profitLoss > 0 ? profitLoss : "";

  const newOrder = new Order({
    ticker: symbol,
    orderId: orderId,
    side: side,
    type: "LIMIT", // Asume que el tipo es LIMIT
    price: price,
    quantity: quantity,
    status: "pending",
    bar: {
      open: data.bar.open,
      high: data.bar.high,
      low: data.bar.low,
      close: data.bar.close,
      volume: quantity,
      time: data.time,
    },
    strategy: {
      order_contracts: quantity,
      order_price: price,
      order_comment: comment,
    },
    order: orderPosition,
    stopLoss: stopLoss,
    takeProfit: takeProfit,
    closePrice: closePrice,
    profitOrLoss: profitOrLoss,
  });

  try {
    await newOrder.save();
    res
      .status(201)
      .json({ code: "success", message: "Orden creada", order: newOrder });

    const newEntry = {
      ticker: symbol,
      bar: data.bar,
      strategy: data.strategy,
      order: orderPosition,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
      closePrice: closePrice,
      profitOrLoss: profitOrLoss,
    };

    latestData.push(newEntry);
  } catch (error) {
    res
      .status(500)
      .json({
        code: "error",
        message: "Error guardando la orden en la base de datos",
      });
  }
});

// Leer (GET) - Listar todas las órdenes
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error en la base de datos" });
  }
});

// Obtener una orden específica
app.get("/orders/:id", async (req, res) => {
  try {
    const searchOrder = await Order.findById(req.params.id);
    res.status(200).json(searchOrder);
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error en la base de datos" });
  }
});

// Actualizar (PUT) - Actualizar una orden (ejemplo: para actualizar el estado)
app.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error en la base de datos" });
  }
});

// Eliminar (DELETE) - Eliminar una orden
app.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(`Intentando borrar la orden con ID: ${orderId}`);

    // Usar findByIdAndDelete para eliminar la orden directamente
    const order = await Order.findByIdAndDelete(orderId);

    // Aquí cerraríamos la orden de binance
    // const result = await closeOrder(order.ticker, order.orderId);

    if (order) {
      console.log(`Orden con ID ${orderId} borrada correctamente`);
      res.status(204).send();
    } else {
      console.log(`Orden con ID ${orderId} no encontrada`);
      res.status(404).json({ code: "error", message: "Orden no encontrada" });
    }
  } catch (error) {
    console.error("Error borrando la orden:", error);
    res
      .status(500)
      .json({ code: "error", message: "Error en la base de datos" });
  }
});

// Actualizar una orden
app.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error en la base de datos" });
  }
});

// Obtener el precio de una criptomoneda desde CoinGecko
app.get("/price/:coin", async (req, res) => {
  const coin = req.params.coin;
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error obteniendo datos de precios" });
  }
});

// Función para obtener y actualizar la lista de monedas con precios
async function updateCoinsWithPrices() {
  try {
    // Obtener la lista de monedas
    const coinsResponse = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );
    const coins = coinsResponse.data;

    // Obtener precios para las primeras 250 monedas (para evitar hacer demasiadas solicitudes)
    const coinIds = coins
      .slice(0, 250)
      .map((coin) => coin.id)
      .join(",");
    const pricesResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
    );
    const prices = pricesResponse.data;

    // Combinar la información de las monedas con sus precios
    coinsWithPrices = coins.map((coin) => {
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: prices[coin.id] ? prices[coin.id].usd : 0,
      };
    });

    // Ordenar las monedas por precio
    coinsWithPrices.sort((a, b) => b.price - a.price);
  } catch (error) {
    console.error("Error actualizando la lista de monedas con precios:", error);
    throw new Error("Error actualizando la lista de monedas con precios");
  }
}

// Llamar a la función para obtener y actualizar la lista de monedas con precios al iniciar la aplicación
updateCoinsWithPrices().catch((error) => {
  console.error("Error al iniciar la aplicación:", error);
  process.exit(1); // Salir de la aplicación si hay un error al iniciar
});

// Listar las criptomonedas principales por precio desde CoinGecko
app.get("/coins/list", async (req, res) => {
  try {
    // Asegurarse de que coinsWithPrices esté actualizado
    await updateCoinsWithPrices();

    // Obtener las 5 primeras monedas con precios
    const topCoins = coinsWithPrices.slice(0, 5);
    res.status(200).json(topCoins);
  } catch (error) {
    res.status(500).json({ code: "error", message: "Error obteniendo la lista de monedas" });
  }
});

// Obtener una criptomoneda de la lista por su ID
app.get("/coins/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Asegurarse de que coinsWithPrices esté actualizado
    await updateCoinsWithPrices();

    // Buscar la moneda con el ID especificado en la lista de monedas con precios
    const coin = coinsWithPrices.find((coin) => coin.id == id);
    if (coin) {
      res.status(200).json(coin);
    } else {
      res.status(404).json({ code: "error", message: "Moneda no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ code: "error", message: "Error obteniendo la moneda" });
  }
});

// Eliminar una criptomoneda de la lista
app.delete("/coins/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Filtrar la moneda con el ID especificado
    const updatedCoins = coinsWithPrices.filter((coin) => coin.id !== id);
    res.status(200).json(updatedCoins);
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error borrando la moneda" });
  }
});

// Actualizar una criptomoneda en la lista
app.put("/coins/:id", async (req, res) => {
  const id = req.params.id;
  const { name, symbol, price } = req.body;
  try {
    // Encontrar el índice de la moneda con el ID especificado
    const index = coinsWithPrices.findIndex((coin) => coin.id === id);
    if (index !== -1) {
      // Actualizar la moneda con los nuevos valores
      coinsWithPrices[index] = { id, name, symbol, price };
      res.status(200).json(coinsWithPrices[index]);
    } else {
      res.status(404).json({ code: "error", message: "Moneda no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Error actualizando la moneda" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en el puerto ${PORT}, en la URL: http://localhost:3000`
  );
});
