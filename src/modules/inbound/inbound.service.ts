import { RabbitService } from '@/infrastructure/rabbit/rabbit.service';
import { Injectable, Logger } from '@nestjs/common';
import { FailedFinesService } from '../failed-fines/failed-fines.service';

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);
  constructor(
    private readonly rabbit: RabbitService,
    private readonly failedFinesService: FailedFinesService,
  ) {}

  async processIncomingWebhook(data: any) {
    try {
      await this.rabbit.emitToPrepare(data);
    } catch (error: any) {
      await this.handleFailedDelivery(data, error.message);
    }
  }

  private async handleFailedDelivery(data: any, message: string) {
    console.log('RabbitMQ Connection Refused');

    // 1. DB-ga xabarni keyinchalik qayta yuborish (Retry) uchun saqlaymiz
    await this.failedFinesService.saveFailedFine({
      webhookData: data,
      error_message: message,
    });
    // 2. Telegramga xabar berish (ixtiyoriy)
    // await this.telegram.notify(`🚨 RabbitMQ error: Jarima DB-ga saqlandi.`);
  }
}
