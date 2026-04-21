import { Module } from '@nestjs/common';
import { IntegrationService } from './inbound.service';
import { IntegrationController } from './inbound.controller';
import { RabbitModule } from '@/infrastructure/rabbit/rabbit.module';
import { FailedFinesModule } from '../failed-fines/failed-fines.module';

@Module({
  imports: [RabbitModule, FailedFinesModule],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}
