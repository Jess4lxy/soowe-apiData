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
            if (data.solicitud && data.solicitud.solicitud_id) {
                const solicitud = await AppDataSource.getRepository(SolicitudSQL).findOneBy({ solicitud_id: data.solicitud?.solicitud_id });
                if (!solicitud) {
                    throw new Error('Solicitud not found');
                }

                data.solicitud = solicitud;
            } else {
                throw new Error('Solicitud ID is required');
            }

            const payment = AppDataSource.getRepository(PagoSQL).create(data);
            const savedPayment = await AppDataSource.getRepository(PagoSQL).save(payment);
            return savedPayment;
        } catch (error) {
            const err = error as any;
            console.error('Error creating payment:', err.stack || err.message);
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

    public async deletePayment(id: number): Promise<boolean> {
        try {
            const payment = await AppDataSource.getRepository(PagoSQL).findOneBy({ pago_id: id });
            if (!payment) return false;

            await AppDataSource.getRepository(PagoSQL).update({ pago_id: id }, { activo: false })
            return true;
        } catch (error) {
            console.error('Error deleting payment:', error);
            throw error;
        }
    }
}

export default new PaymentService();