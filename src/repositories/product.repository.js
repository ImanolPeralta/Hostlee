import ProductManager from '../managers/ProductManager.js';

const productManager = new ProductManager();

export default class ProductRepository {
    async getById(id) {
        return productManager.getProductById(id);
    }
    async updateProduct(id, updates) {
        return productManager.updateProduct(id, updates);
    }
    async getByCode(code) {
        return productManager.getProductByCode(code);
    }
    // ... otros wrappers
}