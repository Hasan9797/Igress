import { Global, Module } from '@nestjs/common';
import {
  RABBIT_PREPARE_CLIENT,
  RABBIT_WORKER_CLIENT,
  RabbitQueues,
} from './rabbit.constants';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitService } from './rabbit.service';

const commonRmqOptions = (config: ConfigService, queue: string) => ({
  transport: Transport.RMQ as const,
  options: {
    urls: [config.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
    queue: queue,
    queueOptions: { durable: true },
    socketOptions: { heartbeatIntervalInSeconds: 60 },
  },
});

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBIT_PREPARE_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) =>
          commonRmqOptions(config, RabbitQueues.PREPARE_FINES_QUEUE),
      },
      {
        name: RABBIT_WORKER_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) =>
          commonRmqOptions(config, RabbitQueues.WORKER_FINES_QUEUE),
      },
    ]),
  ],
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {}
