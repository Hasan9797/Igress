import { Module } from '@nestjs/common';
import { CronTasksService } from './cron-tasks.service';
import { FailedFinesModule } from '../failed-fines/failed-fines.module';

@Module({
  imports: [FailedFinesModule],
  providers: [CronTasksService],
})
export class JobsModule {}
