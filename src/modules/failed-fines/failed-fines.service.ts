import { eq } from 'drizzle-orm';
import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import type { DrizzleDB } from '../../infrastructure/drizzle/drizzle.module';
import { failedFines } from '../../infrastructure/drizzle/schema';
import { DRIZZLE } from '@/common/constants/drizzle.constants';
@Injectable()
export class FailedFinesService {
  private readonly logger = new Logger(FailedFinesService.name);
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async saveFailedFines(data: any[]) {
    try {
      await this.db.insert(failedFines).values(data);
    } catch (error: any) {
      this.logger.error(`Failed to save failed fine: ${error.message}`);
    }
  }

  async getFailedFines(query: any) {
    try {
      const result = await this.db.select().from(failedFines);
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to retrieve failed fines: ${error.message}`);
      return [];
    }
  }

  async getFailedFine(id: number) {
    try {
      const result = await this.db.query.failedFines.findFirst({
        where: eq(failedFines.id, id),
      });

      if (!result) {
        throw new NotFoundException(`ID: ${id} bo'lgan ma'lumot topilmadi`);
      }

      return result;
    } catch (error: any) {
      this.logger.error(`Ma'lumot topishda xatolik: ${error.message}`);
      throw error;
    }
  }
}
