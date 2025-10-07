import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager(); // Ya usa base de datos o memoria

// ----------------------
// 🏠 Página principal
// ----------------------
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

// ----------------------
// 🧑‍💼 Panel de administración
// ----------------------
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

// ----------------------
// 🛍️ Detalle de producto
// ----------------------
router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).render("404", { message: "Producto no encontrado" });
  }

  res.render("productDetail", { product });
});

// ----------------------
// 🧾 Carrito
// ----------------------
router.get("/cart", (req, res) => {
  res.render("cart", { title: "Tu Carrito" });
});

// ----------------------
// 👤 Registro y Login
// ----------------------
router.get("/register", (req, res) => {
  res.render("register", { title: "Crear cuenta" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar sesión" });
});

// ----------------------
// 👥 Perfil del usuario
// ----------------------
router.get("/profile", (req, res) => {
  res.render("profile", { title: "Perfil de usuario" });
});

// ----------------------
// 📄 Secciones informativas
// ----------------------
router.get("/about", (req, res) => {
  res.render("about", { title: "Acerca de Nosotros" });
});

router.get("/faq", (req, res) => {
  res.render("faq", { title: "Preguntas Frecuentes" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contacto" });
});

export default router;
