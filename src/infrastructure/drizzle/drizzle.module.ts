import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DrizzleService } from './drizzle.service';
import { DRIZZLE } from '@/common/constants/drizzle.constants';

// Service-larda @Inject(DRIZZLE) db: DrizzleDB deb tip berish uchun
export type DrizzleDB = PostgresJsDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const url = config.getOrThrow<string>('database.url');
        const max = config.get<number>('database.max');
        const idle_timeout = config.get<number>('database.idleTimeout');
        const connect_timeout = config.get<number>('database.connectTimeout');

        const queryClient = postgres(url, {
          max, // Maksimal ulanishlar
          idle_timeout, // Bo'sh turganda o'chish vaqti (soniya)
          connect_timeout, // Ulanishni kutish vaqti
        });

        return drizzle(queryClient, { schema, logger: true }) as DrizzleDB;
      },
    },
    DrizzleService,
  ],
  exports: [DRIZZLE, DrizzleService],
})
export class DrizzleModule {}
