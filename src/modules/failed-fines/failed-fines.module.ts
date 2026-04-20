import { Module } from '@nestjs/common';
import { FailedFinesService } from './failed-fines.service';
import { FailedFinesController } from './failed-fines.controller';
import { RabbitModule } from '@/infrastructure/rabbit/rabbit.module';

@Module({
  imports: [RabbitModule],
  controllers: [FailedFinesController],
  providers: [FailedFinesService],
  exports: [FailedFinesService],
})
export class FailedFinesModule {}
