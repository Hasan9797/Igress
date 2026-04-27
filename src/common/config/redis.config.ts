import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);
  const password = process.env.REDIS_PASSWORD;

  const credentials = password ? `:${password}@` : '';
  const url = `redis://${credentials}${host}:${port}`;

  return {
    host,
    port,
    password,
    url,
  };
});
