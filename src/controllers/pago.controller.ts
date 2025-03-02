import { Request, Response, NextFunction } from "express";
import pagoService from "../services/pago.service";

export class PaymentController {
    // getAllPayments could be added to super admin later
    async getAllPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const payment = await pagoService.getAllPayments();
            res.json(payment);
        } catch (error) {
            res.status(500).json({ message: "Error fetching payments", error });
        }
    }

    async createPayment(req: Request, res: Response, next: NextFunction) {
        try {
            await pagoService.createPayment(req.body);
            res.json({ message: "Payment created successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error creating payment", error });
        }
    }

    async getPaymentById(req: Request, res: Response, next: NextFunction) {
        try {
            const payment = await pagoService.getPaymentById(parseInt(req.params.id, 10));
            res.json(payment);
        } catch (error) {
            res.status(500).json({ message: "Error fetching payment", error });
        }
    }

    async updatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const paymentId = parseInt(req.params.id, 10);
            await pagoService.updatePayment(paymentId, req.body);
            res.json({ message: "Payment updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating payment", error });
        }
    }

    // delete payment will be added later
}

export default new PaymentController();