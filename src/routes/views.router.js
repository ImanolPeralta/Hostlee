import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager(); // Sin path, ya no es archivo JSON

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });

    res.render("home", {
      title: "Inicio",
      products: result.payload,
      pagination: {
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la página de inicio");
  }
});

router.get("/admin", async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100 }); // por ejemplo
    res.render("admin", {
      title: "Productos en Tiempo Real",
      products: result.payload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la página de administración");
  }
});

// Ruta lista paginada de productos
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    const result = await productManager.getProducts({ page, limit, sort, query });

    res.render("products", {
      title: "Productos",
      products: result.payload,
      pagination: {
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      },
      query,
      sort,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar productos");
  }
});

// Ruta detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).render("404", { message: "Producto no encontrado" });
    }

    res.render("productDetail", {
      title: product.title,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el producto");
  }
});


export default router;
