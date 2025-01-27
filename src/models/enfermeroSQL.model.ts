import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrganizacionSQL } from './organizacionSQL.model';

@Entity('enfermeros')
export class EnfermeroSQL {
  @PrimaryGeneratedColumn()
  enfermero_id: number = 0;

  @Column({ type: 'varchar', length: 255 })
  nombre: string = ' ';

  @Column({ type: 'varchar', length: 255 })
  apellido: string = ' ';

  @Column({ type: 'varchar', length: 255, nullable: true })
  especialidad?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correo?: string;

  @ManyToOne(() => OrganizacionSQL, (organizacion) => organizacion.enfermeros)
  @JoinColumn({ name: 'organizacion_id' })
  organizacion: OrganizacionSQL = new OrganizacionSQL();

  @Column({ type: 'boolean', default: true })
  disponibilidad: boolean = true;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date = new Date();

  @Column({ type: 'timestamp', nullable: true })
  fecha_modificacion?: Date;
}