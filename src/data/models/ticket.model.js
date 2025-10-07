import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const ticketSchema = new mongoose.Schema({
    code: {type: String, unique: true, defaulto: () => nanoid(10)},
    purchase_datatime: { type: Date, defaulto: () => new Date() },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);