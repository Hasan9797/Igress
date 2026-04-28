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
    // ! belgisi yoki || orqali undefined emasligini ta'minlaymiz
    urls: [config.get<string>('rabbit.url') || 'amqp://localhost:5672'],
    queue: queueName,
    queueOptions: { durable: true },
    socketOptions: { heartbeatIntervalInSeconds: 60 },
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
          // config.get ga ham default qiymat yoki casting beramiz
          commonRmqOptions(
            config,
            config.get<string>('rabbit.queues.incoming') || 'incoming_queue',
          ),
      },
      {
        name: RABBIT_COLLECTED_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) =>
          commonRmqOptions(
            config,
            config.get<string>('rabbit.queues.collector') || 'collector_queue',
          ),
      },
    ]),
  ],
  providers: [RabbitService],
  exports: [ClientsModule, RabbitService],
})
export class RabbitModule {}
