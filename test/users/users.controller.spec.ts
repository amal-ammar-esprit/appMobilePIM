import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserRole } from '../../src/users/entities/user.entity';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';

describe('UsersController', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const mockUser = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.PATIENT,
  };

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue(mockUser),
    findPatientsByDoctor: jest.fn().mockResolvedValue([
      {
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.PATIENT,
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    usersService = module.get<UsersService>(UsersService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/507f1f77bcf86cd799439011')
        .expect(200);
      expect(response.body).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.PATIENT,
      });
      expect(usersService.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await request(app.getHttpServer())
        .get('/users/507f1f77bcf86cd799439011')
        .expect(404)
        .expect({ statusCode: 404, message: 'User not found', error: 'Not Found' });
    });
  });

  describe('GET /users/doctor/:doctorId/patients', () => {
    it('should return patients for a doctor', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/doctor/doctor1/patients')
        .expect(200);
      expect(response.body).toEqual([
        {
          name: 'Test User',
          email: 'test@example.com',
          role: UserRole.PATIENT,
        },
      ]);
      expect(usersService.findPatientsByDoctor).toHaveBeenCalledWith('doctor1');
    });
  });
});