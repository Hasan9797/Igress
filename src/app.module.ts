import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntegrationModule } from './modules/integration/integration.module';
import { FailedFinesModule } from './modules/failed-fines/failed-fines.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule } from './infrastructure/rabbit/rabbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IntegrationModule,
    FailedFinesModule,
    RabbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
