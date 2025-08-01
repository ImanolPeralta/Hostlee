import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("src/data/productos.json");

export default class ProductManager {
  constructor() {
    this.path = filePath;
  }

  // Leer todos los productos
  async getProducts(limit = null) {
    const data = await this.#readFile();
    return limit ? data.slice(0, limit) : data;
  }

  // Buscar por ID
  async getProductById(id) {
    const data = await this.#readFile();
    return data.find((prod) => prod.id === id);
  }

  // Agregar producto
  async addProduct(product) {
    const data = await this.#readFile();

    // Validar campos obligatorios
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    const missing = requiredFields.filter((f) => !product[f]);

    if (missing.length > 0) {
      throw new Error(`Faltan campos obligatorios: ${missing.join(", ")}`);
    }

    const newProduct = {
      id: this.#generateId(data),
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status ?? true,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails || [],
    };

    data.push(newProduct);
    await this.#saveFile(data);
    return newProduct;
  }

  // Actualizar producto
  async updateProduct(id, updates) {
    const data = await this.#readFile();
    const index = data.findIndex((prod) => prod.id === id);

    if (index === -1) return null;

    const updatedProduct = {
      ...data[index],
      ...updates,
      id: data[index].id, // No se permite cambiar el ID
    };

    data[index] = updatedProduct;
    await this.#saveFile(data);
    return updatedProduct;
  }

  // Eliminar producto
  async deleteProduct(id) {
    const data = await this.#readFile();
    const filtered = data.filter((prod) => prod.id !== id);
    if (filtered.length === data.length) return false;

    await this.#saveFile(filtered);
    return true;
  }

  // Métodos privados
  async #readFile() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content);
    } catch (error) {
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
