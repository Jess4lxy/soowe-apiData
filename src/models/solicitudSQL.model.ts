import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { OrganizacionSQL } from './organizacionSQL.model';
import { ServicioSolicitudSQL } from './servicio_solicitud.model';

@Entity('solicitudes')
export class SolicitudSQL {
    @PrimaryGeneratedColumn()
    solicitud_id: number = 0;

    @Column({ type: 'int'})
    usuario_id: number = 0;

    @ManyToOne(() => OrganizacionSQL, (organizacion) => organizacion.solicitudes)
    @JoinColumn({ name: 'organizacion_id'})
    organizacion?: OrganizacionSQL;

    @Column({ type: 'varchar', length: 50 })
    estado: string = ' ';

    @Column({ type: 'timestamp', nullable: true })
    fecha_solicitud?: Date;

    @Column({ type: 'timestamp', nullable: true })
    fecha_respuesta?: Date;

    @Column({ type: 'text', nullable: true })
    comentarios?: string;

    @OneToMany(() => ServicioSolicitudSQL, (servicioSolicitud) => servicioSolicitud.solicitud)
    servicioSolicitudes?: ServicioSolicitudSQL[];
}
