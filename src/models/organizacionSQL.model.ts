import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EnfermeroSQL } from './enfermeroSQL.model';
import { UsuarioSQL } from './usuarioSQL.model';
import { SolicitudSQL } from './solicitudSQL.model';

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

    @Column({ type: 'varchar', length: 20})
    cuenta_bancaria: string = ' ';

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date = new Date();

    @Column({ type: 'timestamp', nullable: true })
    fecha_modificacion?: Date;

    @OneToMany(() => EnfermeroSQL, enfermero => enfermero.organizacion)
    enfermeros?: EnfermeroSQL[];

    @OneToMany(() => UsuarioSQL, usuario => usuario.organizacion)
    usuarios_admin?: UsuarioSQL[];

    @OneToMany(() => SolicitudSQL, solicitudes => solicitudes.organizacion)
    solicitudes?: SolicitudSQL[];
}