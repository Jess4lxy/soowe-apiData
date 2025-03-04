import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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

    @ManyToOne(() => ServicioSQL, (servicios) => servicios.solicitudes)
    @JoinColumn({ name: 'servicios_id' })
    servicio?: ServicioSQL;

    @OneToMany(() => PagoSQL, (pago) => pago.solicitud)
    pagos?: PagoSQL[];
}
