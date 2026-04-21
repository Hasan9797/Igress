import { RabbitService } from '@/infrastructure/rabbit/rabbit.service';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class FailedFinesService {
  private readonly logger = new Logger(FailedFinesService.name);
  constructor(
    private readonly rabbit: RabbitService,
    private prisma: PrismaService,
  ) {}

  async saveFailedFine(data: any) {
    try {
      // DB-ga saqlash logikasi (masalan, TypeORM yoki Prisma orqali)
      await this.prisma.failedFines.create({
        data: {
          response: data.webhookData,
          message: data.error_message || 'Unknown error',
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to save failed fine: ${error.message}`);
    }
  }
}
