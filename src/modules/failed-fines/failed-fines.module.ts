import { Module } from '@nestjs/common';
import { FailedFinesService } from './failed-fines.service';
import { FailedFinesController } from './failed-fines.controller';
import { RabbitModule } from '@/infrastructure/rabbit/rabbit.module';
import { DrizzleModule } from '@/infrastructure/drizzle/drizzle.module';

@Module({
  imports: [RabbitModule, DrizzleModule],
  controllers: [FailedFinesController],
  providers: [FailedFinesService],
  exports: [FailedFinesService],
})
export class FailedFinesModule {}
