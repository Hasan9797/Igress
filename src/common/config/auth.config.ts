import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  internalSecret: process.env.INTERNAL_SERVICE_SECRET || 'secret',
  jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
}));
