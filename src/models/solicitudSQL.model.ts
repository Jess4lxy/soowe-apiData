import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrganizacionSQL } from './organizacionSQL.model';

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
    estado: string = '';

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_solicitud: Date = new Date();

    @Column({ type: 'timestamp', nullable: true })
    fecha_respuesta?: Date;
}
