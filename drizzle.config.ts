import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infrastructure/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Agar .env dan o'qimasa, vaqtincha string qo'yib tekshirib ko'ring
    url: process.env.DATABASE_URL as string,
  },
});
