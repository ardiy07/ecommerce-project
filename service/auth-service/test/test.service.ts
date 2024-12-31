import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../src/common/redis.service';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async getOTP(): Promise<string> {
    return await this.redisService.get('otp:test@example.com');
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        email: 'test@example.com',
        username: 'test',
        password: await bcrypt.hash('test123456', 10),
      },
    });
  }

  async createUserSession() {
    const user = await this.prismaService.user.create({
      data: {
        email: 'test@example.com',
        username: 'test',
        password: await bcrypt.hash('test123456', 10),
      },
    });
    return user;
  }

  async createdSession(user: {id: number}) {
    await this.prismaService.session.create({
      data: {
        user_id: user.id,
      },
    });
  }
}
