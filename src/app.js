import express from "express";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import path from "path";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { createServer } from "http";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";
import connectDB from "./data/db.js";

const app = express();
const PORT = 8080;
const httpServer = createServer(app);
const io = new Server(httpServer);

// Ya no pasamos ruta a ProductManager porque usaremos Mongo
const productManager = new ProductManager();

// Conectar a la base de datos
connectDB();

// Motor de vistas Handlebars
app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a === b,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas
app.use("/", viewsRouter);

// Socket.io
io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  // Traemos solo el array de productos con payload
  const result = await productManager.getProducts();
  socket.emit("productosActualizados", result.payload);

  socket.on("nuevoProducto", async (producto) => {
    if (producto.imageUrl) {
      producto.thumbnails = [producto.imageUrl];
      delete producto.imageUrl;
    } else {
      producto.thumbnails = [];
    }

    await productManager.addProduct(producto);
    const updatedResult = await productManager.getProducts();
    io.emit("productosActualizados", updatedResult.payload);
  });

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    const updatedResult = await productManager.getProducts();
    io.emit("productosActualizados", updatedResult.payload);
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
