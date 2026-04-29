import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  // RabbitMQ Consumer qismini ulash
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('rabbit.url')],
      queue: configService.get<string>('rabbit.queues.incoming'),
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  app
    .startAllMicroservices()
    .then(() => {
      console.log('Microservices are connected');
    })
    .catch((err) => {
      console.error('Microservice initial connection failed, but HTTP is fine');
    });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
