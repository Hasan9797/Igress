import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setKey(key: string, value: any, ttl: number = 3600) {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async getKey(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delKey(key: string) {
    await this.redis.del(key);
  }

  async addToSortedSet(setName: string, score: number, value: any) {
    await this.redis.zadd(setName, score, JSON.stringify(value));
  }

  async getFromZset(
    setName: string,
    startScore: number,
    endScore: number,
    limit: number = 500,
  ) {
    return await this.redis.zrangebyscore(
      setName,
      startScore,
      endScore,
      'LIMIT',
      0,
      limit,
    );
  }

  async removeFromZset(setName: string, startScore: number, endScore: number) {
    await this.redis.zremrangebyscore(setName, startScore, endScore);
  }
}
