import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

// Página de login del admin
router.get("/login", (req, res) => {
  res.render("adminLogin", {
    title: "Login Administrador",
  });
});

// Euta protegida que solo puede acceder el admin
router.get("/", isAdmin, (req, res) => {
  res.render("adminDashboard", {
    title: "Panel de Administración",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/admin");
    }
    res.redirect("/");
  });
});

// Procesar el login (post)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@hostlee.com" && password === "1234") {
    req.session.isAdmin = true;
    return res.redirect("/admin");
  }

  res.render("adminLogin", {
    title: "Login Administrador",
    error: "Usuario o contraseña incorrectos",
  });
});

export default router;
