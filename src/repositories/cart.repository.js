import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager();

export default class CartRepository {
    async getCartById(id) {
        return cartManager.getCartById(id);
    }
    async updateCart(id, update) {
        return cartManager.updateCart(id, update);
    }
    async createCart() {
        return cartManager.createCart();
    }
    async addProductToCart(cartId, productId, qty) {
        return cartManager.addProductToCart(cartId, productId, qty);
    }
    // ... otros wrappers
}