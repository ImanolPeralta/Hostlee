export function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next(); // Usuario autenticado como admin → continúa
  }
  res.redirect("/login"); // No autenticado → manda al login
}
