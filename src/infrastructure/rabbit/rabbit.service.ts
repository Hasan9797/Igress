import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import {
  RABBIT_RECEIVED_CLIENT,
  RABBIT_COLLECTED_CLIENT,
  RabbitPatterns,
} from './rabbit.constants';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class RabbitService {
  private readonly logger = new Logger(RabbitService.name);

  constructor(
    @Inject(RABBIT_RECEIVED_CLIENT)
    private readonly receivedClient: ClientProxy,
    @Inject(RABBIT_COLLECTED_CLIENT)
    private readonly collectedClient: ClientProxy,
  ) {}

  async emitToReceived(data: any) {
    return this.baseEmit(
      this.receivedClient,
      RabbitPatterns.FINES_RECEIVED,
      data,
    );
  }

  async emitToCollected(batchData: any[]) {
    return this.baseEmit(
      this.collectedClient,
      RabbitPatterns.FINES_COLLECTED,
      batchData,
    );
  }

  private async baseEmit(client: ClientProxy, pattern: string, data: any) {
    try {
      const record = new RmqRecordBuilder(data)
        .setOptions({
          persistent: true,
          headers: { 'x-sent-at': new Date().toISOString() },
        })
        .build();

      await firstValueFrom(client.emit(pattern, record).pipe(timeout(2000)));
      return true;
    } catch (error: any) {
      this.logger.error(`RabbitMQ emit error [${pattern}]: ${error.message}`);
      throw error;
    }
  }

  /**
   * Request-Response (RPC) uchun send metod
   */
  async send(pattern: string, data: any) {
    try {
      return await firstValueFrom(
        this.collectedClient.send(pattern, data).pipe(timeout(5000)),
      );
    } catch (error: any) {
      this.logger.error(`RabbitMQ send error: ${error.message}`);
      return null;
    }
  }
}
