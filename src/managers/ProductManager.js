import ProductModel from "../data/models/Product.js";

export default class ProductManager {
  // Obtener productos con paginación, filtros y orden
  async getProducts({ limit = 40, page = 1, sort, query } = {}) {
    const filter = {};

    if (query) {
      if (query === "available") {
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort:
        sort === "asc" || sort === "desc"
          ? { price: sort === "asc" ? 1 : -1 }
          : {},
      lean: true,
    };

    const result = await ProductModel.paginate(filter, options);

    return {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `?page=${result.nextPage}` : null,
    };
  }

  async getProductById(id) {
    return ProductModel.findById(id).lean();
  }

  async addProduct(product) {
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

    const newProduct = await ProductModel.create({
      ...product,
      status: product.status ?? true,
      thumbnails: product.thumbnails || [],
    });

    return newProduct.toObject();
  }

  async updateProduct(id, updates) {
    const updated = await ProductModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    return updated;
  }

  async deleteProduct(id) {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }
}
