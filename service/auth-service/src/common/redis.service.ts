import { HttpException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis;
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });
  }

  async set(key: string, value: string, ttl: number): Promise<string> {
    return await this.redis.setex(key, ttl, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async extendTTL(key: string, ttl: number): Promise<void> {
    const exists = await this.redis.exists(key);
    if (exists) {
      await this.redis.expire(key, ttl);
    } else {
      throw new HttpException('Key not found', 404);
    }
  }
}
