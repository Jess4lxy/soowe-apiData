import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EnfermeroSQL } from './enfermeroSQL.model';
import { UsuarioSQL } from './usuarioSQL.model';
import { SolicitudSQL } from './solicitudSQL.model';
import { DocumentoOrganizacionSQL } from './documentosOrganizacionSQL.model';

@Entity('organizaciones')
export class OrganizacionSQL {
  @PrimaryGeneratedColumn()
  organizacion_id: number = 0;

  @Column({ type: 'varchar', length: 255 })
  nombre: string = ' ';

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 20 })
  cuenta_bancaria: string = ' ';

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date = new Date();

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_modificacion?: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean = true;

  @OneToMany(() => EnfermeroSQL, (enfermero) => enfermero.organizacion)
  enfermeros?: EnfermeroSQL[];

  @OneToMany(() => UsuarioSQL, (usuario) => usuario.organizacion)
  usuarios_admin?: UsuarioSQL[];

  @OneToMany(() => SolicitudSQL, (solicitud) => solicitud.organizacion)
  solicitudes?: SolicitudSQL[];
  
  @OneToMany(() => DocumentoOrganizacionSQL, (documento) => documento.organizacion)
  documentos?: DocumentoOrganizacionSQL[];
}
