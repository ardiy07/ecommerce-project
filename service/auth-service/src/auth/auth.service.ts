import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  AuthResponse,
  LoginUserRequest,
  LogoutUserRespon,
  RegisterUserRequest,
  VerifyEmailRequest,
  VerifyOTPRequest,
} from '../model/auth.model';
import { Logger } from 'winston';
import { AuthValidation } from './auth.validation';
import { randomInt } from 'crypto';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { RedisService } from '../common/redis.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../common/jwt.service';
import { KafkaService } from '../common/kafka.service';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private redisService: RedisService,
    private jwtService: JwtService,
    private kafkaService: KafkaService,
  ) {}

  async verifyEmail(request: VerifyEmailRequest) {
    const verifyEmail: VerifyEmailRequest = this.validationService.validate(
      AuthValidation.VERIFY_EMAIL,
      request,
    );

    const verifyEmailResult = await this.prismaService.user.findUnique({
      where: {
        email: verifyEmail.email,
      },
    });

    if (verifyEmailResult) {
      throw new HttpException('Email already exists', 400);
    }

    const otp = randomInt(100000, 999999).toString();

    await Promise.all([
      this.redisService.set(`otp:${verifyEmail.email}`, otp, 300),
      this.kafkaService.send('verify-email', {
        to: verifyEmail.email,
        context: {
          email: verifyEmail.email,
          otp: otp,
        },
      }),
    ]);

    return {
      status: 'success',
      message: 'Check your email for OTP',
    };
  }

  async verifyOTP(request: VerifyOTPRequest) {
    const verifyOTP: VerifyOTPRequest = this.validationService.validate(
      AuthValidation.VERIFY_OTP,
      request,
    );

    const getVerifyOTP = await this.redisService.get(`otp:${verifyOTP.email}`);
    const verifyOTPResult = getVerifyOTP === verifyOTP.otp;

    if (!verifyOTPResult) {
      throw new HttpException('Invalid OTP', 400);
    }
    await this.redisService.extendTTL(`otp:${verifyOTP.email}`, 600);
    return {
      status: 'success',
      message: 'OTP verified',
    };
  }

  async RegisterUser(request: RegisterUserRequest): Promise<AuthResponse> {
    const registerUser: RegisterUserRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    const getVerifyOTP = await this.redisService.get(
      `otp:${registerUser.email}`,
    );
    const verifyOTPResult = getVerifyOTP === registerUser.otp;

    const verifyEmail = await this.prismaService.user.findUnique({
      where: {
        email: registerUser.email,
      },
    });

    if (!verifyOTPResult || verifyEmail) {
      throw new HttpException('Registrasion failed', 400);
    }

    const username = registerUser.email.split('@')[0];
    const hashPassword = await bcrypt.hash(registerUser.password, 10);

    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email: registerUser.email,
            username,
            password: hashPassword,
            status: 'INACTIVE',
          },
        });
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status,
        };
      });

      await this.redisService.del(`otp:${registerUser.email}`);
      await this.kafkaService.send('register-user', {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
        password: hashPassword,
        status: result.status,
      });

      return {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
      };
    } catch (error) {
      throw new HttpException('Registration failed', 500);
    }
  }

  async LoginUser(request: LoginUserRequest, req: any) {
    const loginUser: LoginUserRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        email: loginUser.email,
      },
    });

    const verifyPassword = await bcrypt.compare(
      loginUser.password,
      user.password,
    );

    if (!user || !verifyPassword) {
      throw new HttpException('Email or password is incorrect', 400);
    }

    const token = await this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        user = await prisma.user.update({
          where: {
            email: loginUser.email,
          },
          data: {
            status: 'ACTIVE',
          },
        });
        await prisma.session.create({
          data: {
            user_id: user.id,
            access_token: token,
            refresh_token: token,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
          },
        });

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          status: user.status,
          role: user.role,
          token: token,
        };
      });

      await this.kafkaService.send('login-user', {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
        status: result.status,
        token: result.token,
      });

      return {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
        status: result.status,
        token: result.token,
      };
    } catch (errro) {
      throw new HttpException('Login failed', 500);
    }
  }

  async LogoutUser(request: LogoutUserRespon) {
    const result = await this.prismaService.session.deleteMany({
      where: {
        user_id: request.id,
      },
    });

    if (result.count === 0) {
      throw new HttpException(
        'Logout failed: No session found for the user',
        404,
      );
    }

    await this.prismaService.user.update({
      where: {
        id: request.id,
      },
      data: {
        status: 'INACTIVE',
      },
    });

    await this.kafkaService.send('logout-user', {
      id: request.id,
      status: 'inactive',
    });

    return {
      status: 'success',
      message: 'Logout successful',
    };
  }
}
