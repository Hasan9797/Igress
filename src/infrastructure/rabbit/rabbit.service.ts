import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import {
  RABBIT_PREPARE_CLIENT,
  RABBIT_WORKER_CLIENT,
  RabbitPatterns,
} from './rabbit.constants';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class RabbitService {
  private readonly logger = new Logger(RabbitService.name);

  constructor(
    @Inject(RABBIT_PREPARE_CLIENT) private readonly prepareClient: ClientProxy,
    @Inject(RABBIT_WORKER_CLIENT) private readonly workerClient: ClientProxy,
  ) {}

  async emitToPrepare(data: any) {
    return this.baseEmit(
      this.prepareClient,
      RabbitPatterns.PREPARE_FINES,
      data,
    );
  }

  async emitToWorker(batchData: any[]) {
    return this.baseEmit(
      this.workerClient,
      RabbitPatterns.WORKER_FINES,
      batchData,
    );
  }

  private async baseEmit(client: ClientProxy, pattern: string, data: any) {
    try {
      const record = new RmqRecordBuilder(data)
        .setOptions({
          persistent: true,
          headers: {
            'x-sent-at': new Date().toISOString(),
          },
        })
        .build();

      await firstValueFrom(client.emit(pattern, record));
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
        this.workerClient.send(pattern, data).pipe(timeout(5000)),
      );
    } catch (error: any) {
      this.logger.error(`RabbitMQ send error: ${error.message}`);
      return null;
    }
  }
}
