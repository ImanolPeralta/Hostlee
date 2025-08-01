import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

// POST /api/carts/ → crear carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito." });
  }
});

// GET /api/carts/:cid → obtener productos del carrito
router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await manager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito." });
  }
});

// POST /api/carts/:cid/product/:pid → agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const updatedCart = await manager.addProductToCart(cartId, productId);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito." });
  }
});

export default router;
