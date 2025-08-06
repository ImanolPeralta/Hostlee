import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";

const router = Router();
const productManager = new ProductManager(
  path.resolve("src/data/productos.json")
);

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {
    title: "Inicio",
    products,
  });
});

router.get("/admin", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("admin", {
    title: "Productos en Tiempo Real",
    product: products,
  });
});

export default router;