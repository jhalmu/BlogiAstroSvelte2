import knex from 'knex';
import { getDatabaseConfig } from '../config/database';

// Initialize knex with our configuration
const db = knex(getDatabaseConfig());

export default db;
