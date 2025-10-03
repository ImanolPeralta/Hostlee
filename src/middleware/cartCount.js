import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager();

export default async function cartCount(req, res, next) {
  try {
    let count = 0;
    if (req.session.cartId) {
      const cart = await cartManager.getCartById(req.session.cartId);
      if (cart && cart.products) {
        count = cart.products.reduce((acc, item) => acc + item.quantity, 0);
      }
    }
    res.locals.cartCount = count; // Esto estará disponible en TODAS las vistas
  } catch (err) {
    res.locals.cartCount = 0;
  }
  next();
}