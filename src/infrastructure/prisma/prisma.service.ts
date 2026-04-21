import { Prisma } from '@prisma/client';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.getOrThrow<string>('database.url'),
        },
      },
      log: config.get<any>('database.logLevel'),
    } as Prisma.PrismaClientOptions);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to Database successfully');
    } catch (error: any) {
      this.logger.error('Error connecting to Database:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
