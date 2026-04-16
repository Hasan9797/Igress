import { Global, Module } from '@nestjs/common';
import { RABBIT_SERVICE_NAME, RabbitQueues } from './rabbit.constants';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitService } from './rabbit.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBIT_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
            queue: RabbitQueues.FINES_QUEUE,
            queueOptions: {
              durable: true,
            },
            socketOptions: {
              heartbeatIntervalInSeconds: 60,
            },
          },
        }),
      },
    ]),
  ],
  providers: [RabbitService],
  exports: [ClientsModule, RabbitService],
})
export class RabbitModule {}
