import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RabbitQueues } from './infrastructure/rabbit/rabbit.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // RabbitMQ Consumer qismini ulash
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // Local RabbitMQ manzili
      queue: RabbitQueues.PREPARE_FINES_QUEUE, // Siz ishlatayotgan queue nomi
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
