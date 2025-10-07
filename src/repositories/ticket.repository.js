import TicketManager from '../managers/TicketManager.js';

const ticketManager = new TicketManager();

export default class TicketRepository {
    async create(data) {
        return ticketManager.createTicket(data);
    }
    async getById(id) {
        return ticketManager.getTicketById(id);
    }
}