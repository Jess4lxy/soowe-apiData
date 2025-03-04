import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SolicitudSQL } from './solicitudSQL.model';

@Entity('pagos')
export class PagoSQL {
    @PrimaryGeneratedColumn()
    pago_id: number = 0;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number = 0;

    @Column({ type: 'varchar', length: 50 })
    metodo_pago: string = ' ';

    @Column({ type: 'timestamp', nullable: true })
    fecha_pago?: Date;

    @Column({ type: 'varchar', length: 50 })
    estado: string = ' ';

    @Column({ type: 'text', nullable: true })
    detalles?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    solicitud_id: number = 0;

    @ManyToOne(() => SolicitudSQL, (solicitud) => solicitud.pagos)
    @JoinColumn({ name: 'solicitud_id' })
    solicitud!: SolicitudSQL;
}