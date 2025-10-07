import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();
const ticketRepo = new TicketRepository();

export default class CartsService {
  /**
   * Ejecuta la compra del carrito: verifica stock, actualiza stock, crea ticket (si corresponde)
   * @param {String} cartId
   * @param {String} purchaserEmail
   * @returns {Object} { ticket, unprocessed }
   */
  async purchaseCart(cartId, purchaserEmail) {
    const cart = await cartRepo.getCartById(cartId);
    if (!cart) throw new Error("Cart not found");

    const unprocessed = []; // ids no comprados
    let amount = 0;
    const productsToUpdate = [];

    // cart.products se espera: [{ product: {...}, quantity }]
    for (const item of cart.products) {
      const prodId = item.product._id
        ? item.product._id.toString()
        : item.product.toString();
      const product = await productRepo.getById(prodId);

      if (!product) {
        unprocessed.push(prodId);
        continue;
      }

      if (product.stock >= item.quantity) {
        // se puede comprar
        product.stock = product.stock - item.quantity;
        amount += product.price * item.quantity;
        productsToUpdate.push({ id: product._id, stock: product.stock });
      } else {
        // no hay stock suficiente -> no se procesa
        unprocessed.push(prodId);
      }
    }

    // actualizar stocks
    await Promise.all(
      productsToUpdate.map((p) =>
        productRepo.updateProduct(p.id, { stock: p.stock })
      )
    );

    let ticket = null;
    if (amount > 0) {
      ticket = await ticketRepo.create({ amount, purchaser: purchaserEmail });
    }

    // filtrar el carrito para que queden sólo los no procesados
    const remaining = cart.products.filter((item) => {
      const pid = item.product._id
        ? item.product._id.toString()
        : item.product.toString();
      return unprocessed.includes(pid);
    });

    await cartRepo.updateCart(cartId, { products: remaining });

    return { ticket, unprocessed };
  }
}
