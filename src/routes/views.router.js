import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager(); // Sin path, ya no es archivo JSON

/*
- Ruta principal
- Renderiza la vista "home" con los productos
- Permite paginación, ordenamiento y filtrado de productos
*/
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
    });

    res.render("home", {
      title: "Inicio",
      products: result.payload,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit,
      sort,
      query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la página de inicio");
  }
});

// Ruta "Administración"
router.get("/admin", async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100 });
    res.render("admin", {
      title: "Productos en Tiempo Real",
      products: result.payload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la página de administración");
  }
});

// Ruta "Detalle De Producto"
router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).render("404", { message: "Producto no encontrado" });
  }

  res.render("productDetail", { product });
});

// Ruta "Acerca de Nosotros"
router.get("/about", (req, res) => {
  res.render("about", { title: "Acerca de Nosotros" });
});

// Ruta "Preguntas Frecuentes"
router.get("/faq", (req, res) => {
  res.render("faq", { title: "Preguntas Frecuentes" });
});

// Ruta "Contacto"
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contacto" });
});

export default router;
