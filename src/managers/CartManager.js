import CartModel from "../data/models/Cart.js";

export default class CartManager {
  // Obtener todos los carritos (opcional)
  async getCarts() {
    return await CartModel.find().populate("products.product").lean();
  }

  // Obtener carrito por ID con populate
  async getCartById(cartId) {
    return await CartModel.findById(cartId).populate("products.product").lean();
  }

  // Crear un nuevo carrito
  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart.toObject();
  }

  // Agregar producto a carrito
  async addProductToCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart.toObject();
  }

  // Eliminar un producto específico del carrito
  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    return cart.toObject();
  }

  // Reemplazar todos los productos del carrito
  async updateCart(cartId, newProducts) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = newProducts;
    await cart.save();
    return cart.toObject();
  }

  // Actualizar solo la cantidad de un producto
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const product = cart.products.find(p => p.product.toString() === productId);
    if (!product) return null;

    product.quantity = quantity;
    await cart.save();
    return cart.toObject();
  }

  // Vaciar carrito
  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart.toObject();
  }
}