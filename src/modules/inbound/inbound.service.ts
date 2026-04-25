import { RabbitService } from '@/infrastructure/rabbit/rabbit.service';
import { Injectable, Logger } from '@nestjs/common';
import { FailedFinesService } from '../failed-fines/failed-fines.service';
import { PartnerType } from '@/common/enums/partner-type.enum';

@Injectable()
export class InboundService {
  private readonly logger = new Logger(InboundService.name);
  constructor(
    private readonly rabbit: RabbitService,
    private readonly failedFinesService: FailedFinesService,
  ) {}

  async processIncomingWebhookTelecomSoft(data: any) {
    const queueData = {
      ...data,
      source: PartnerType.TELECOM_SOFT,
    };

    try {
      await this.rabbit.emitToPrepare(queueData);
    } catch (error: any) {
      await this.handleFailedDelivery(queueData, error.message);
    }
  }

  async processIncomingWebhookASBT(data: any) {
    const queueData = {
      ...data,
      source: PartnerType.ASBT,
    };

    try {
      await this.rabbit.emitToPrepare(queueData);
    } catch (error: any) {
      await this.handleFailedDelivery(queueData, error.message);
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
