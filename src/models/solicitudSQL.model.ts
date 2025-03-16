import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrganizacionSQL } from './organizacionSQL.model';
import { PagoSQL } from './pagoSQL.model';
import { ServicioSQL } from './servicioSQL.model';

@Entity('solicitudes')
export class SolicitudSQL {
    @PrimaryGeneratedColumn()
    solicitud_id?: number = 0;

    @Column({ name: 'organizacion_id', nullable: true })
    organizacion_id?: number;

    @ManyToOne(() => OrganizacionSQL, (organizacion) => organizacion.solicitudes)
    @JoinColumn({ name: 'organizacion_id' })
    organizacion?: OrganizacionSQL;

    @Column({ name: 'servicios_id', nullable: true })
    servicios_id?: number;

    @ManyToOne(() => ServicioSQL, (servicio) => servicio.solicitudes)
    @JoinColumn({ name: 'servicios_id' })
    servicio?: ServicioSQL;

    @OneToMany(() => PagoSQL, (pago) => pago.solicitud)
    pagos?: PagoSQL[];

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
    fecha_creacion: Date = new Date();

    @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    fecha_modificacion?: Date;

    @Column({ type: 'boolean', default: true })
    activo: boolean = true;
}
