import { RabbitPatterns } from '@/utils/rabbit/rabbit.constants';
import { RabbitService } from '@/utils/rabbit/rabbit.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);
  constructor(private readonly rabbit: RabbitService) {}

  async processIncomingWebhook(data: any) {
    try {
      // Birinchi navbatda RabbitMQ-ga yuborishga harakat qilamiz
      await this.rabbit.emit(RabbitPatterns.FINE_CREATED, data);
    } catch (error: any) {
      // Agar RabbitMQ o'chiq bo'lsa yoki networkda xato bo'lsa
      await this.handleFailedDelivery(data, error.message);
    }
  }

  private async handleFailedDelivery(data: any, reason: string) {
    // 1. DB-ga xabarni keyinchalik qayta yuborish (Retry) uchun saqlaymiz
    // await this.db.failedFines.insert({
    //   payload: data,
    //   error_message: reason,
    //   status: 'PENDING_RETRY',
    //   created_at: new Date(),
    // });
    // 2. Telegramga xabar berish (ixtiyoriy)
    // await this.telegram.notify(`🚨 RabbitMQ error: Jarima DB-ga saqlandi.`);
  }
}
