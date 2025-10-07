import { Router } from "express";
import passport from "passport";
import CartsService from "../services/carts.services.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();
const service = new CartsService();

// Middleware para asegurar que el carrito exista
router.use(async (req, res, next) => {
  try {
    if (!req.session.cartId) {
      const newCart = await manager.createCart();
      req.session.cartId = newCart._id.toString();
    } else {
      // Verifica que el carrito guardado en sesión exista en DB
      const existingCart = await manager.getCartById(req.session.cartId);
      if (!existingCart) {
        const newCart = await manager.createCart();
        req.session.cartId = newCart._id.toString();
      }
    }
    next();
  } catch (error) {
    console.error("Error en middleware de carrito:", error);
    res.status(500).json({ error: "Error al inicializar el carrito." });
  }
});

// POST /api/carts/:cid/purchase
router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  async (req, res, next) => {
    try {
    const cid = req.params.cid;
    const user = req.user;

    // Autorización: el usuario debe ser el dueño del carrito o admin
    if (user.role !== "admin" && String(user.cart) !== String(cid)) {
      return res.status(403).json({ error: "Forbiden: cannot purchase this cart" });
    }

    const purchaserEmail = user.email;
    const { ticket, unprocessed } = await CartsService.purchaseCart(cid, purchaserEmail);

    return res.json({ status: "sucess", ticket, unprocessed });
  } catch (err) {
    next(err);
  }
}
);

// Crear carrito manualmente (solo si realmente querés hacerlo)
router.post("/", async (req, res) => {
  try {
    const newCart = await manager.createCart();
    req.session.cartId = newCart._id.toString();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito." });
  }
});

// Obtener carrito actual
router.get("/", async (req, res) => {
  try {
    const cart = await manager.getCartById(req.session.cartId);
    if (!cart) return res.json({ products: [] });
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito." });
  }
});

// Agregar producto
router.post("/product/:pid", async (req, res) => {
  try {
    const updatedCart = await manager.addProductToCart(
      req.session.cartId,
      req.params.pid
    );
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito." });
  }
});

// Eliminar producto
router.delete("/product/:pid", async (req, res) => {
  try {
    const updatedCart = await manager.removeProductFromCart(
      req.session.cartId,
      req.params.pid
    );
    if (!updatedCart) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado." });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto del carrito." });
  }
});

// Actualizar cantidad
router.put("/product/:pid", async (req, res) => {
  try {
    const cartId = req.session.cartId;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "Cantidad inválida." });
    }

    const updatedCart = await manager.updateProductQuantity(cartId, productId, quantity);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado." });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cantidad del producto." });
  }
});


// Vaciar carrito
router.delete("/product/:pid", async (req, res) => {
  try {
    const cartId = req.session.cartId;
    const productId = req.params.pid;

    const updatedCart = await manager.removeProductFromCart(cartId, productId);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado." });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto del carrito." });
  }
});


// Renderizar vista del carrito con productos
router.get("/view", async (req, res) => {
  try {
    const cartId = req.session.cartId;
    const cart = await manager.getCartById(cartId);

    if (!cart) {
      return res.render("cart", { products: [], totalPrice: 0 });
    }

    // Si usas MongoDB, podés poblar para obtener detalles del producto
    // await cart.populate('products.product');

    // Calcular total
    const totalPrice = cart.products.reduce((acc, p) => {
      const price = p.product?.price || 0; // chequea que exista el precio
      const qty = p.quantity || 0;
      return acc + price * qty;
    }, 0);

    res.render("cart", { products: cart.products, totalPrice });
  } catch (error) {
    res.status(500).send("Error al cargar el carrito");
  }
});


export default router;
