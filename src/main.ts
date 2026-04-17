import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // RabbitMQ Consumer qismini ulash
  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'], // Local RabbitMQ manzili
  //     queue: 'fines_queue', // Siz ishlatayotgan queue nomi
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });
  // await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
