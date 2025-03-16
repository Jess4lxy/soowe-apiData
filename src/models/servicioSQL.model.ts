import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CategoriaSQL } from './categoriaSQL.model';
import { SolicitudSQL } from './solicitudSQL.model';

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

  @OneToMany(() => SolicitudSQL, (solicitudes) => solicitudes.servicio)
  solicitudes?: SolicitudSQL[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date = new Date();

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_modificacion?: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean = true;
}
