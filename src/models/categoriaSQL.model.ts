import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ServicioSQL } from './servicioSQL.model';

@Entity('categorias')
export class CategoriaSQL {
  @PrimaryGeneratedColumn({ name: 'categoria_id' })
  categoria_id: number = 0;

  @Column({ name: 'nombre_categoria', type: 'varchar', length: 255 })
  nombre_categoria: string = ' ';

  @Column({ type: 'varchar', length: 255 })
  descripcion: string = ' ';

  @OneToMany(() => ServicioSQL, (servicio) => servicio.categoria)
  servicios?: ServicioSQL[];
}