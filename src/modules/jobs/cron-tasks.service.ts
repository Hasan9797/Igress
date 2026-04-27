import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FailedFinesService } from '../failed-fines/failed-fines.service';
import { RedisService } from '@/infrastructure/redis/redis.service';

@Injectable()
export class CronTasksService {
  private readonly logger = new Logger(CronTasksService.name);
  constructor(
    private readonly failedFinesService: FailedFinesService,
    private readonly redisService: RedisService,
  ) {}

  // Har minutda ishlaydi
  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'minuteCron',
  })
  async handleMinuteCron() {
    this.logger.debug('Har minutda bajariladigan vazifa ishga tushdi');
    const currentTime = Date.now();

    const fines = await this.redisService.getFromZset(
      'failed_fines_zset',
      0,
      currentTime,
    );

    if (fines.length > 0) {
      const parsedFines = fines.map((f) => JSON.parse(f));

      try {
        await this.failedFinesService.saveFailedFines(parsedFines);

        await this.redisService.removeFromZset(
          'failed_fines_zset',
          0,
          currentTime,
        );
      } catch (error: any) {
        this.logger.error('DBga yozishda xato: ' + error.message);
      }
    }
  }

  // Har kuni soat 00:00 da ishlaydi
  // @Cron('0 0 * * *', {
  //   name: 'dailyJob',
  // })
  // async handleDailyJob() {
  //   this.logger.log('Yangi kun boshlandi, bazani tozalash boshlandi...');
  // }
}
