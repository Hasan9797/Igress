import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import type { DrizzleDB } from './drizzle.module'; // Faqat tip sifatida
import { sql } from 'drizzle-orm';
import { DRIZZLE } from '@/common/constants/drizzle.constants';

@Injectable()
export class DrizzleService implements OnModuleInit {
  private readonly logger = new Logger(DrizzleService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB // Index [0] mana shu!
  ) {}

  async onModuleInit() {
    try {
      await this.db.execute(sql`SELECT 1`);
      this.logger.log('Database connected successfully! 🚀');
    } catch (error: any) {
      this.logger.error(`Database connection failed: ${error.message}`);
    }
  }
}