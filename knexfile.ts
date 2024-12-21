import type { Knex } from 'knex';
import { getDatabaseConfig } from './src/config/database';

const config: { [key: string]: Knex.Config } = {
  development: {
    ...getDatabaseConfig(),
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts',
    },
  },
  production: {
    ...getDatabaseConfig(),
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;
