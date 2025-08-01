import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("src/data/carrito.json");

export default class CartManager {
  constructor() {
    this.path = filePath;
  }

  async getCarts() {
    return await this.#readFile();
  }

  async getCartById(id) {
    const data = await this.#readFile();
    return data.find((cart) => cart.id === id);
  }

  async createCart() {
    const data = await this.#readFile();
    const newCart = {
      id: this.#generateId(data),
      products: [],
    };

    data.push(newCart);
    await this.#saveFile(data);
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const data = await this.#readFile();
    const cartIndex = data.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) return null;

    const cart = data[cartIndex];
    const productIndex = cart.products.findIndex(
      (p) => p.product === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    data[cartIndex] = cart;
    await this.#saveFile(data);
    return cart;
  }

  async #readFile() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async #saveFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  #generateId(data) {
    const ids = data
      .map((p) => (typeof p.id === "number" ? p.id : parseInt(p.id)))
      .filter((n) => !isNaN(n));
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}