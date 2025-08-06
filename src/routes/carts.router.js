import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

// Crear carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito." });
  }
});

// Obtener carrito por ID (con productos)
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await manager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito." });
  }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await manager.addProductToCart(cartId, productId);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito." });
  }
});

// DELETE producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await manager.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado." });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto del carrito." });
  }
});

// PUT reemplazar productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body.products; // Se espera un array [{ product: id, quantity: n }, ...]
    if (!Array.isArray(newProducts)) {
      return res.status(400).json({ error: "Formato inválido para productos." });
    }
    const updatedCart = await manager.updateCart(cid, newProducts);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito." });
  }
});

// PUT actualizar cantidad producto específico
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "Cantidad inválida." });
    }
    const updatedCart = await manager.updateProductQuantity(cid, pid, quantity);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado." });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cantidad del producto." });
  }
});

// DELETE vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const emptiedCart = await manager.clearCart(cid);
    if (!emptiedCart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }
    res.json({ message: "Carrito vaciado con éxito." });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito." });
  }
});


export default router;
