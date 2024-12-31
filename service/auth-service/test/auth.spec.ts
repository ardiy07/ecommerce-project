import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  // Verify email
  describe('POST /api/v1/auth/verify-email', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-email')
        .send({
          email: '',
        });

      // logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should be able to verify email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-email')
        .send({
          email: 'test@example.com',
        });

      // logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    it('should be able to verify email ready', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-email')
        .send({
          email: 'test@example.com',
        });

      // logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  // Verify otp
  describe('POST /api/v1/auth/verify-otp', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-otp')
        .send({
          otp: '',
          email: '',
        });

      // logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should be able to verify token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-otp')
        .send({
          otp: await testService.getOTP(),
          email: 'test@example.com',
        });

      // logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    it('should be able to verify token invalid', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-otp')
        .send({
          otp: '123456',
          email: 'test@example.com',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  // Register
  describe('POST /api/v1/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          otp: '',
          email: '',
          password: '',
        });

      // logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should be able to register', async () => {
      await testService.deleteUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          otp: await testService.getOTP(),
          password: 'test123456',
          email: 'test@example.com',
        });

      // logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.username).toBe('test');
    });

    it('should be able to verify vailed register', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          otp: '123456',
          password: 'test123456',
          email: 'test@example.com',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  // Login
  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: '',
          password: '',
        });

      // logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should be able to login', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test123456',
        });

      // logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.username).toBe('test');
    });

    it('should be able to verify vailed login', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          password: 'test1234567',
          email: 'test@example.com',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  // Logout
  describe('POST /api/v1/auth/logout', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be able to logout', async () => {
      const user = await testService.createUserSession();
      await testService.createdSession(user);
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({
          id: user.id,
        });

      // logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout successful');
      expect(response.body.status).toBe('success');
    });

    it('should be able to verify vailed logout', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({
          id: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });
});
