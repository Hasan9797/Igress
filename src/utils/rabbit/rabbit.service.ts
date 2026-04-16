import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { RABBIT_SERVICE_NAME, RabbitPatterns } from './rabbit.constants';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class RabbitService {
  private readonly logger = new Logger(RabbitService.name);

  constructor(
    @Inject(RABBIT_SERVICE_NAME) private readonly client: ClientProxy,
  ) {}

  async emit(pattern: RabbitPatterns, data: any) {
    try {
      // RabbitMQ uchun maxsus opsiyalarni (persistent kabi) builder orqali qo'shamiz
      const record = new RmqRecordBuilder(data)
        .setOptions({
          persistent: true, // Xabarni diskda saqlash
          headers: {
            'x-sent-at': new Date().toISOString(),
          },
        })
        .build();

      // Endi faqat 2 ta argument: pattern va record
      await firstValueFrom(this.client.emit(pattern, record));

      return true;
    } catch (error: any) {
      this.logger.error(`RabbitMQ emit error: ${error.message}`);
      throw error;
    }
  }

  async send(pattern: RabbitPatterns, data: any) {
    try {
      // 5 soniya kutadi, javob kelmasa xato beradi
      return await lastValueFrom(
        this.client.send(pattern, data).pipe(timeout(5000)),
      );
    } catch (error: any) {
      this.logger.error(`RabbitMQ send error: ${error.message}`);
      return null;
    }
  }
}
