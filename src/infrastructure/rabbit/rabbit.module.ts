import { Global, Module } from '@nestjs/common';
import {
  RABBIT_RECEIVED_CLIENT,
  RABBIT_COLLECTED_CLIENT,
} from './rabbit.constants';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { RabbitService } from './rabbit.service';

const commonRmqOptions = (
  config: ConfigService,
  queueName: string,
): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [config.get<string>('rabbit.url') || 'amqp://localhost:5672'],
    queue: queueName,
    queueOptions: {
      durable: true,
    },
    socketOptions: {
      heartbeatIntervalInSeconds: 60, // heartbeat vaqti 60 soniya
      reconnectTimeInSeconds: 5, // qayta ulanish vaqti 5 soniya
    },
  },
});

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBIT_RECEIVED_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) =>
          commonRmqOptions(
            config,
            config.get<string>('rabbit.queues.incoming') || 'fines_incoming',
          ),
      },
      {
        name: RABBIT_COLLECTED_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) =>
          commonRmqOptions(
            config,
            config.get<string>('rabbit.queues.collector') || 'fines_collected',
          ),
      },
    ]),
  ],
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {}
