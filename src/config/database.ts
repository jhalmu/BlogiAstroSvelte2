import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string().optional(),
  SQLITE_DB_PATH: z.string().default(':memory:'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

interface DatabaseConfig {
  client: 'sqlite3' | 'pg';
  connection: any;
  useNullAsDefault?: boolean;
}

const config: Record<string, DatabaseConfig> = {
  development: {
    client: 'sqlite3',
    connection: {
      filename:
        env.SQLITE_DB_PATH === ':memory:' ? ':memory:' : `${process.cwd()}/data/blog.sqlite`,
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'pg',
    connection: env.DATABASE_URL,
  },
};

export const getDatabaseConfig = () => {
  return config[env.NODE_ENV];
};

export const isDevMode = () => env.NODE_ENV === 'development';
