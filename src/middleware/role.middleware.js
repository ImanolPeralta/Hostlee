// src/middlewares/role.middleware.js
export const permit =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (allowedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ error: "Forbidden" });
  };