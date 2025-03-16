import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ServicioSQL } from './servicioSQL.model';

@Entity('categorias')
export class CategoriaSQL {
  @PrimaryGeneratedColumn({ name: 'categoria_id' })
  categoria_id: number = 0;

  @Column({ name: 'nombre_categoria', type: 'varchar', length: 255 })
  nombre_categoria: string = ' ';

  @Column({ type: 'varchar', length: 255 })
  descripcion: string = ' ';

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date = new Date();

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_modificacion?: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean = true;

  @OneToMany(() => ServicioSQL, (servicio) => servicio.categoria)
  servicios?: ServicioSQL[];
}
