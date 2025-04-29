import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../src/users/entities/user.entity'; // Import UserRole

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    _id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.PATIENT, // Use enum
    name: 'Test User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt_token'),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: UserRole.PATIENT, // Use enum
      };
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
      const result = await service.register(registerDto);
      expect(usersService.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.PATIENT, // Use enum
      });
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'jwt_token' });
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      const result = await service.login(loginDto);
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = { email: 'wrong@example.com', password: 'password' };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong' };
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});