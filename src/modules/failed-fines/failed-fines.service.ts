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

  async saveFailedFines(data: any) {
    try {
      // DB-ga saqlash logikasi (masalan, TypeORM yoki Prisma orqali)
      await this.prisma.failedFines.createMany({
        data: data.map((item: any) => ({
          webhookData: item,
          error_message: 'RabbitMQ Connection Refused',
        })),
      })
    } catch (error: any) {
      this.logger.error(`Failed to save failed fine: ${error.message}`);
    }
  }
}
