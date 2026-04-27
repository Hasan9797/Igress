import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule as IoredisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Global() // Global qilsangiz, boshqa modullarda import qilish shart bo'lmaydi
@Module({
  imports: [
    IoredisModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>('redis.url'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService], // Service-ni tashqariga chiqarish
})
export class RedisModule {}
