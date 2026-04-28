import { RabbitService } from '@/infrastructure/rabbit/rabbit.service';
import { Injectable, Logger } from '@nestjs/common';
import { PartnerType } from '@/common/enums/partner-type.enum';
import { RedisService } from '@/infrastructure/redis/redis.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InboundService {
  private readonly logger = new Logger(InboundService.name);
  constructor(
    private readonly rabbit: RabbitService,
    private readonly redisService: RedisService,
  ) {}

  async processIncomingWebhookTelecomSoft(data: any) {
    const queueData = {
      ...data,
      source: PartnerType.TELECOM_SOFT,
    };

    try {
      await this.rabbit.emitToReceived(queueData);
    } catch (error: any) {
      this.logger.error('Error processing webhook: ', error.message);
      await this.handleFailedDelivery(queueData);
    }
  }

  async processIncomingWebhookASBT(data: any) {
    const queueData = {
      ...data,
      source: PartnerType.ASBT,
    };

    try {
      await this.rabbit.emitToReceived(queueData);
    } catch (error: any) {
      this.logger.error('Error processing webhook: ', error.message);
      await this.handleFailedDelivery(queueData);
    }
  }

  private async handleFailedDelivery(webhookData: any) {
    console.log('RabbitMQ Connection Refused');

    try {
      // await this.telegram.notify(`🚨 RabbitMQ error: Jarima DB-ga saqlanish uchun Cache ga tushdi.`);
      await this.redisService.addToSortedSet(
        'failed_fines',
        Date.now(),
        webhookData,
      );
    } catch (error: any) {
      // await this.telegram.notify(`🚨 Redis error: Jarima Log File ga tushdi.`);
      const logData = {
        timestamp: new Date().toISOString(),
        finesData: webhookData,
        error: error.message,
      };

      // Ma'lumotni log faylga qo'shish (Append)
      fs.appendFileSync(
        path.join(__dirname, '../../../logs/failed_fines.log'),
        JSON.stringify(logData) + '\n',
      );

      this.logger.error(
        'CRITICAL: Redis ham olyapti! Ma’lumot faylga yozildi.',
      );
    }
  }
}
