import ticketModel from "../data/models/ticket.model.js";

export default class TicketManager {
    async createTicket({ amount, purchaser }) {
        const ticket = await ticketModel.create({ amount, purchaser });
        return ticket;
    }

    async getTicketById(id) {
        return ticketModel.findById(id).lean();
}

    async getTicketByCode(code) {
        return ticketModel.findOne({ code }).lean();
    }
}