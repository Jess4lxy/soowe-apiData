import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SolicitudSQL } from './solicitudSQL.model';
import { ServicioSQL } from './servicioSQL.model';

@Entity('servicio_solicitud')
export class ServicioSolicitudSQL {
    @PrimaryGeneratedColumn({ name: 'servicio_solicitud_id' })
    servicio_solicitud_id: number = 0;

    @ManyToOne(() => SolicitudSQL, (solicitud) => solicitud.servicioSolicitudes)
    @JoinColumn({ name: 'solicitud_id' })
    solicitud: SolicitudSQL = new SolicitudSQL();

    @ManyToOne(() => ServicioSQL, (servicio) => servicio.servicioSolicitudes)
    @JoinColumn({ name: 'servicios_id' })
    servicio: ServicioSQL = new ServicioSQL();
}
