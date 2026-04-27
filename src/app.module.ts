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
import redisConfig from './common/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [redisConfig],
      isGlobal: true,
      cache: true,
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    InboundModule,
    JobsModule,
    FailedFinesModule,
    RabbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
