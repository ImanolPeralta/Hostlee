# 🏠 Backend Hostlee - E-commerce de Alquiler de Departamentos y Hoteles

Proyecto desarrollado para la **Primera Preentrega** del curso de **Programación Backend I** (Coderhouse).  
Consiste en la construcción del backend de un e-commerce estilo Airbnb, utilizando **Node.js**, **Express** y persistencia con **FileSystem**.

---

## 🚀 Tecnologías Utilizadas

- Node.js
- Express.js
- FileSystem (persistencia en `.json`)
- Postman (para testing de rutas)

---

## 📂 Estructura del Proyecto

```
proyecto-airbnb-backend/
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── data/
│   │   ├── productos.json
│   │   └── carrito.json
├── package.json
├── README.md
```

---

## 📦 Rutas del API

### 📁 `/api/products`

- `GET /api/products/`  
  Lista todos los productos (opcional: `?limit=2`).
- `GET /api/products/:pid`  
  Devuelve un producto por ID.

- `POST /api/products/`  
  Crea un nuevo producto. Todos los campos son obligatorios salvo `thumbnails`.  
  Campos esperados en `body`:

  ```json
  {
    "title": "Depto moderno",
    "description": "Departamento con pileta y Wi-Fi",
    "code": "APT001",
    "price": 120,
    "stock": 2,
    "category": "Departamento",
    "thumbnails": ["http://example.com/img.jpg"]
  }
  ```

- `PUT /api/products/:pid`  
  Actualiza un producto existente. No se puede modificar el `id`.

- `DELETE /api/products/:pid`  
  Elimina un producto por su ID.

---

### 🛒 `/api/carts`

- `POST /api/carts/`  
  Crea un nuevo carrito vacío.

- `GET /api/carts/:cid`  
  Muestra los productos de un carrito específico.

- `POST /api/carts/:cid/product/:pid`  
  Agrega un producto al carrito. Si ya existe, aumenta su cantidad en 1.

---

## 💾 Persistencia

Los datos se almacenan localmente en archivos JSON:

- `productos.json` → productos disponibles.
- `carrito.json` → carritos de usuarios.

---

## 📬 Autor

**Imanol Augusto Peralta**  
📧 imanolaugusto18@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/imanol-augusto-peralta)  
💻 [GitHub](https://github.com/ImanolPeralta)

---

## 📝 Notas

- Este proyecto es la primera etapa de un e-commerce que evoluciona hacia una app completa de alquiler estilo Airbnb.
- No se utiliza Multer ni base de datos aún. La persistencia se hace 100% con FileSystem.
- Testeado completamente con Postman.

---