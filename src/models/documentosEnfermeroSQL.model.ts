import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EnfermeroSQL } from './enfermeroSQL.model';

@Entity('documentos_enfermeros')
export class DocumentoEnfermeroSQL {
    @PrimaryGeneratedColumn()
    documento_id: number = 0;

    @Column({ name: 'enfermero_id' })
    enfermero_id: number = 0;

    @ManyToOne(() => EnfermeroSQL, (enfermero) => enfermero.documentos)
    @JoinColumn({ name: 'enfermero_id' })
    enfermero?: EnfermeroSQL;

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
