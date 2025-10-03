import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager();

// GET /api/products/?limit=5
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await manager.getProducts({ limit, page, sort, query });
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos." });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await manager.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto." });
  }
});

// POST /api/products/
router.post("/", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const updated = await manager.updateProduct(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const deleted = await manager.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({ message: "Producto eliminado con éxito." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto." });
  }
});

export default router;
