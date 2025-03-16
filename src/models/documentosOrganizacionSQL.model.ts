import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrganizacionSQL } from './organizacionSQL.model';

@Entity('documentos_organizaciones')
export class DocumentoOrganizacionSQL {
    @PrimaryGeneratedColumn()
    documento_id: number = 0;

    @Column({ name: 'organizacion_id' })
    organizacion_id: number = 0;

    @ManyToOne(() => OrganizacionSQL, (organizacion) => organizacion.documentos)
    @JoinColumn({ name: 'organizacion_id' })
    organizacion?: OrganizacionSQL;

    @Column({ type: 'varchar', length: 255 })
    nombre_documento: string = ' ';

    @Column({ type: 'text' })
    url_documento: string = ' ';

    @Column({ type: 'varchar', length: 50, nullable: true })
    tipo?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date = new Date();

    @Column({ type: 'boolean', default: true })
    activo: boolean = true;
}
