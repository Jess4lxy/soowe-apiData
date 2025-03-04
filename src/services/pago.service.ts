import { AppDataSource } from '../config/data-source';
import { PagoSQL } from '../models/pagoSQL.model';
import { SolicitudSQL } from '../models/solicitudSQL.model';

class PaymentService {
    public async getAllPayments(): Promise<PagoSQL[]> {
        try {
            return await AppDataSource.getRepository(PagoSQL).find({
                relations: ['solicitud'],
            });
        } catch (error) {
            console.error('Error fetching all payments:', error);
            throw error;
        }
    }

    public async getPaymentById(id: number): Promise<PagoSQL | null> {
        try {
            const payment = await AppDataSource.getRepository(PagoSQL).findOneBy({ pago_id: id });
            if (!payment) {
                throw new Error(`Payment with ID ${id} not found`);
            }
            return payment;
        } catch (error) {
            console.error(`Error fetching payment with ID ${id}:`, error);
            throw error;
        }
    }

    public async createPayment(data: PagoSQL): Promise<PagoSQL> {
        try {
            const payment = AppDataSource.getRepository(PagoSQL).create(data);
            return await AppDataSource.getRepository(PagoSQL).save(payment);
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    }

    public async updatePayment(id: number, data: PagoSQL): Promise<PagoSQL | null> {
        try {
            await AppDataSource.getRepository(PagoSQL).update(id, data);
            return await AppDataSource.getRepository(PagoSQL).findOneBy({ pago_id: id });
        } catch (error) {
            console.error('Error updating payment:', error);
            throw error;
        }
    }

    // delete payment will be added later
}

export default new PaymentService();