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
    name: 'redis-fines-to-db',
  })
  async handleMinuteCron() {
    this.logger.debug('Har minutda bajariladigan vazifa ishga tushdi');
    const currentTime = Date.now();

    const fines = await this.redisService.getFromZset(
      'failed_fines',
      0,
      currentTime,
    );
    console.log(fines);
    
    if (fines && fines.length > 0) {
      const parsedFines = fines.map((f) => {
        return {
          payload: JSON.parse(f),
          message: 'RabbitMQ-error: Redis to DB',
        };
      });

      try {
        await this.failedFinesService.saveFailedFines(parsedFines);
        await this.redisService.removeFromZset('failed_fines', 0, currentTime);
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
