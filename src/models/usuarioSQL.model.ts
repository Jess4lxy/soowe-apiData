import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrganizacionSQL } from './organizacionSQL.model';

@Entity('usuario_admin')
export class UsuarioSQL {
    @PrimaryGeneratedColumn()
    usuario_admin_id: number = 0;

    @Column({ type: 'varchar', length: 255 })
    correo: string = ' ';

    @Column({ type: 'varchar', length: 255, nullable: true })
    contrasena: string = ' ';

    @ManyToOne(() => OrganizacionSQL, organizacion => organizacion.usuarios_admin)
    @JoinColumn({ name: 'organizacion_id' })
    organizacion: OrganizacionSQL = new OrganizacionSQL();
}
