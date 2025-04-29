import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from '../../src/users/entities/user.entity';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.PATIENT,
    save: jest.fn().mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: UserRole.PATIENT,
    }),
  };

  const mockUserModel: Partial<Model<User>> = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockUser]),
    }),
  };

  const userModelMock = jest.fn().mockImplementation(() => mockUser);
  Object.assign(userModelMock, mockUserModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock as unknown as Model<User>,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.PATIENT,
      };
      const result = await service.create(userDto);
      expect(userModelMock).toHaveBeenCalledWith(userDto);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toMatchObject(userDto);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const result = await service.findByEmail('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const result = await service.findById('507f1f77bcf86cd799439011');
      expect(userModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findPatientsByDoctor', () => {
    it('should find patients for a doctor', async () => {
      const result = await service.findPatientsByDoctor('doctor1');
      expect(userModel.find).toHaveBeenCalledWith({
        role: UserRole.PATIENT,
        patientId: 'doctor1',
      });
      expect(result).toEqual([mockUser]);
    });
  });
});