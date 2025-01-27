import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';
import { OrganizacionSQL } from '../models/organizacionSQL.model';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import { UsuarioSQL } from '../models/usuarioSQL.model';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true, // only for development
    logging: false,
    entities: [EnfermeroSQL, OrganizacionSQL, SolicitudSQL, UsuarioSQL], // all the relational entitys
});