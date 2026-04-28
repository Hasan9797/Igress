import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '20', 10),
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '5', 10),
  logLevel: ['query', 'error', 'warn'],
}));
