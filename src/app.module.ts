import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InboundModule } from './modules/inbound/inbound.module';
import { FailedFinesModule } from './modules/failed-fines/failed-fines.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule } from './infrastructure/rabbit/rabbit.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './infrastructure/redis/redis.module';
import { JobsModule } from './modules/jobs/jobs.module';
import databaseConfig from './common/config/database.config';
import { DrizzleModule } from './infrastructure/drizzle/drizzle.module';
import redisConfig from './common/config/redis.config';
import rabbitConfig from './common/config/rabbit.config';
import { TelegramModule } from './modules/telegram/telegram.module';
import telegramConfig from './common/config/telegram.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, rabbitConfig, telegramConfig],
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    DrizzleModule,
    InboundModule,
    JobsModule,
    FailedFinesModule,
    RabbitModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
