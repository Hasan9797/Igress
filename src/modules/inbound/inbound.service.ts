import { RabbitService } from '@/infrastructure/rabbit/rabbit.service';
import { Injectable, Logger } from '@nestjs/common';
import { PartnerType } from '@/common/enums/partner-type.enum';
import { RedisService } from '@/infrastructure/redis/redis.service';
import { TelegramService } from '@/modules/telegram/telegram.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InboundService {
  private readonly logger = new Logger(InboundService.name);
  private lastTelegramNotifyTime: number = 0;
  private readonly TG_NOTIFY_COOLDOWN = 2 * 60 * 1000; // 2 minutes

  constructor(
    private readonly rabbit: RabbitService,
    private readonly redisService: RedisService,
    private readonly telegramService: TelegramService,
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
    const cachedData = {
      _id: crypto.randomUUID(),
      ...webhookData,
    };
    try {
      await this.redisService.addToSortedSet(
        'failed_fines',
        Date.now(),
        cachedData,
      );
      await this.sendTelegramNotification(
        `🚨🐇 RabbitMQ error: Jarima DB-ga saqlanish uchun Cache ga tushdi`,
      );
    } catch (error: any) {
      const logData = {
        timestamp: new Date().toISOString(),
        finesData: cachedData,
        error: error.message,
      };

      await this.sendTelegramNotification(
        `🚨🙀🤯 Redis error: Jarima Log File ga yozilmoqda❗️(Server ga Yuguur)`,
      );

      const filePath = path.join(process.cwd(), 'failed_fines.log');
      fs.appendFileSync(filePath, JSON.stringify(logData) + '\n');

      this.logger.error('Error handling failed delivery: ', error.message);
    }
  }

  async sendTelegramNotification(message: string) {
    const now = Date.now();
    if (now - this.lastTelegramNotifyTime > this.TG_NOTIFY_COOLDOWN) {
      await this.telegramService.notify(message);
      this.lastTelegramNotifyTime = now;
    }
  }
}
