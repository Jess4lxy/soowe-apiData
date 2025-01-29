import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';
import { OrganizacionSQL } from '../models/organizacionSQL.model';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import { UsuarioSQL } from '../models/usuarioSQL.model';
import { ServicioSQL } from '../models/servicioSQL.model';
import { CategoriaSQL } from '../models/categoriaSQL.model';
import { ServicioSolicitudSQL } from '../models/servicio_solicitud.model';

config();

const isSSLRequired = process.env.POSTGRES_SSL === 'true';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DB,
    synchronize: true, // only for development
    logging: false,
    entities: [EnfermeroSQL, OrganizacionSQL, SolicitudSQL, UsuarioSQL, ServicioSQL, CategoriaSQL, ServicioSolicitudSQL], // all the relational entitys
    ssl: isSSLRequired
    ? {
          rejectUnauthorized: false, // Use SSL if required
    }
    : undefined, // Skip SSL if not required
    name: 'default',
});