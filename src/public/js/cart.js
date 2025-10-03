// Obtener o crear carrito
async function getOrCreateCart() {
  let cartId = localStorage.getItem("cartId");
  if (!cartId) {
    const res = await fetch("/api/carts", { method: "POST" });
    if (!res.ok) throw new Error("No se pudo crear el carrito");
    const newCart = await res.json();
    cartId = newCart._id || newCart.id || newCart.cartId;
    localStorage.setItem("cartId", cartId);
  }
  return cartId;
}

// Actualizar contador en navbar
async function updateCartCount() {
  try {
    const res = await fetch(`/api/carts`);
    if (!res.ok) throw new Error("No se pudo obtener el carrito");
    const products = await res.json();
    const totalCount = products.reduce((acc, p) => acc + (p.quantity || 1), 0);
    document.querySelector(".cart-count").textContent = totalCount;
  } catch (error) {
    console.error(error);
  }
}

// Agregar producto al carrito
async function addToCart(productId) {
  try {
    const res = await fetch(`/api/carts/product/${productId}`, {
      method: "POST",
    });

    if (!res.ok) {
      const err = await res.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.error || "Error desconocido",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Producto agregado!",
      text: "Se añadió al carrito correctamente",
      timer: 1500,
      showConfirmButton: false,
    });

    updateCartCount();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo agregar el producto",
    });
  }
}

// Inicializar contador al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  document.querySelectorAll(".reserve-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-product-id");
      addToCart(productId);
    });
  });
});

// Actualizar cantidad de producto
async function updateQuantity(productId, newQuantity) {
  const quantity = parseInt(newQuantity);
  if (isNaN(quantity) || quantity < 1) {
    Swal.fire({ icon: "warning", title: "Cantidad inválida" });
    return;
  }

  try {
    const res = await fetch(`/api/carts/product/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      const err = await res.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.error || "Error desconocido",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Cantidad actualizada",
      timer: 1200,
      showConfirmButton: false,
    }).then(() => location.reload());
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo actualizar la cantidad",
    });
  }
}

// Eliminar producto del carrito
async function removeFromCart(productId) {
  const confirmDelete = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar este producto?",
    text: "Esta acción no se puede deshacer",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmDelete.isConfirmed) return;

  try {
    const res = await fetch(`/api/carts/product/${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.error || "Error desconocido",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Producto eliminado",
      timer: 1200,
      showConfirmButton: false,
    }).then(() => location.reload());
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el producto",
    });
  }
}
