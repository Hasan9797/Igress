import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GatewayCheckMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const internalSecret = req.headers['x-internal-secret'];
    const expectedSecret = this.configService.get<string>(
      'auth.internalSecret',
    );

    if (!internalSecret || internalSecret !== expectedSecret) {
      throw new UnauthorizedException(
        'Access denied: Request must come from API Gateway',
      );
    }

    next();
  }
}
