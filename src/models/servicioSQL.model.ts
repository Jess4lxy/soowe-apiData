import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CategoriaSQL } from './categoriaSQL.model';
import { ServicioSolicitudSQL } from './servicio_solicitud.model';

@Entity('servicios')
export class ServicioSQL {
    @PrimaryGeneratedColumn({ name: 'servicios_id' })
    servicios_id: number = 0;

    @Column({ type: 'varchar', length: 255 })
    nombre: string = ' ';

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_estimado: number = 0;

    @Column({ type: 'varchar', length: 255 })
    descripcion: string = ' ';

    @ManyToOne(() => CategoriaSQL, (categoria) => categoria.servicios, { eager: true })
    @JoinColumn({ name: 'categoria_id' })
    categoria: CategoriaSQL = new CategoriaSQL();

    @OneToMany(() => ServicioSolicitudSQL, (servicioSolicitud) => servicioSolicitud.servicio)
    servicioSolicitudes?: ServicioSolicitudSQL[];
}