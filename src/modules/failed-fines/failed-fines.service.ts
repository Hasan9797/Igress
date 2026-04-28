import { Injectable, Inject, Logger } from '@nestjs/common';
import type { DrizzleDB } from '../../infrastructure/drizzle/drizzle.module';
import { failedFines } from '../../infrastructure/drizzle/schema';
import { DRIZZLE } from '@/common/constants/drizzle.constants';
@Injectable()
export class FailedFinesService {
  private readonly logger = new Logger(FailedFinesService.name);
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async saveFailedFines(data: any[]) {
    try {
      console.log(data);
      await this.db.insert(failedFines).values(data);
    } catch (error: any) {
      this.logger.error(`Failed to save failed fine: ${error.message}`);
    }
  }
}
