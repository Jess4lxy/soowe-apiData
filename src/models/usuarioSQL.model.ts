import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrganizacionSQL } from './organizacionSQL.model';

@Entity('usuario_admin')
export class UsuarioSQL {
    @PrimaryGeneratedColumn()
    usuario_admin_id: number = 0;

    @Column({ type: 'varchar', length: 255 })
    nombre: string = ' ';

    @Column({ type: 'varchar', length: 255 })
    apellido: string = ' ';

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono?: string;

    @Column({ type: 'varchar', length: 255 })
    correo: string = ' ';

    @Column({ type: 'varchar', length: 255, nullable: true })
    contrasena?: string;

    @Column({ name: 'organizacion_id' })
    organizacion_id: number = 0;

    @ManyToOne(() => OrganizacionSQL, organizacion => organizacion.usuarios_admin)
    @JoinColumn({ name: 'organizacion_id' })
    organizacion?: OrganizacionSQL;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
    fecha_creacion: Date = new Date();

    @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    fecha_modificacion?: Date;

    @Column({ type: 'boolean', default: true })
    activo: boolean = true;
}
