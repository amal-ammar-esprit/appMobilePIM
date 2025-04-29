import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register and login a user, send a message, and save a location', async () => {
    // Register a user
    const registerDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'patient',
    };
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);
    const token = registerResponse.body.access_token;

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(201);
    expect(loginResponse.body.access_token).toBeDefined();

    // Send a message (mock receiver)
    const messageResponse = await request(app.getHttpServer())
      .get('/chat/messages/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(messageResponse.body).toBeInstanceOf(Array);

    // Save a location
    const locationDto = { userId: '507f1f77bcf86cd799439011', latitude: 40.7128, longitude: -74.0060 };
    const locationResponse = await request(app.getHttpServer())
      .post('/location')
      .set('Authorization', `Bearer ${token}`)
      .send(locationDto)
      .expect(201);
    expect(locationResponse.body).toMatchObject(locationDto);
  });
});