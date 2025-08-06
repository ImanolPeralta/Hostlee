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

const app = express();
const PORT = 8080;
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager(
  path.join(__dirname, "src/data/productos.json")
);

// Motor de vistas Hanblebars
app.engine("handlebars", engine());
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

  socket.emit("productosActualizados", await productManager.getProducts());

  socket.on("nuevoProducto", async (producto) => {
    // Convertir la propiedad imageUrl a thumbnails array
    if (producto.imageUrl) {
      producto.thumbnails = [producto.imageUrl];
      delete producto.imageUrl; // opcional, para limpiar el objeto
    } else {
      producto.thumbnails = [];
    }

    await productManager.addProduct(producto);
    const productosActualizados = await productManager.getProducts();
    io.emit("productosActualizados", productosActualizados);
  });

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    const productosActualizados = await productManager.getProducts();
    io.emit("productosActualizados", productosActualizados);
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
