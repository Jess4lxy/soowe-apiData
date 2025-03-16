import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date = new Date();

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_modificacion?: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean = true;

  @ManyToOne(() => SolicitudSQL, (solicitud) => solicitud.pagos)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud!: SolicitudSQL;
}
