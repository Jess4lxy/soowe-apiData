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
            if (data.solicitud && data.solicitud.solicitud_id) {  // Asegúrate de que 'solicitud_id' esté en 'data.solicitud'
                const solicitud = await AppDataSource.getRepository(SolicitudSQL).findOneBy({ solicitud_id: data.solicitud.solicitud_id });
                if (!solicitud) {
                    throw new Error('Solicitud not found');
                }
                // Asignamos la entidad 'solicitud' encontrada al campo 'solicitud' de PagoSQL
                data.solicitud = solicitud;
            } else {
                throw new Error('Solicitud ID is required');
            }
    
            const payment = AppDataSource.getRepository(PagoSQL).create(data);
            const savedPayment = await AppDataSource.getRepository(PagoSQL).save(payment);
            return savedPayment;
        } catch (error) {
            console.error('Error creating payment:', (error as any).stack || (error as any).message);
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