import { Module } from '@nestjs/common';
import { InboundService } from './inbound.service';
import { InboundController } from './inbound.controller';
import { RabbitModule } from '@/infrastructure/rabbit/rabbit.module';
import { FailedFinesModule } from '../failed-fines/failed-fines.module';

@Module({
  imports: [RabbitModule, FailedFinesModule],
  controllers: [InboundController],
  providers: [InboundService],
})
export class InboundModule {}
