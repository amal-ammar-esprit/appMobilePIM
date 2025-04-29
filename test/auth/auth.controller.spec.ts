import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
    login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    authService = module.get<AuthService>(AuthService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: 'patient',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);
      expect(response.body).toEqual({ access_token: 'jwt_token' });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);
      expect(response.body).toEqual({ access_token: 'jwt_token' });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});