import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { RedisService } from './redis.service';
import { JwtService } from './jwt.service';
import { KafkaService } from './kafka.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    { provide: APP_FILTER, useClass: ErrorFilter },
    RedisService,
    JwtService,
    KafkaService,
  ],
  exports: [
    PrismaService,
    ValidationService,
    RedisService,
    JwtService,
    KafkaService,
  ],
})
export class CommonModule {}
