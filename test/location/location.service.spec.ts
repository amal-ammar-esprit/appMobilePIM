import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../../src/location/location.service';
import { UsersService } from '../../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Location } from '../../src/location/entities/location.entity';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { UserRole } from '../../src/users/entities/user.entity';

describe('LocationService', () => {
  let service: LocationService;
  let locationModel: Model<Location>;
  let usersService: UsersService;

  const mockLocation = {
    userId: '507f1f77bcf86cd799439011',
    latitude: 40.7128,
    longitude: -74.0060,
    timestamp: new Date(),
    save: jest.fn().mockResolvedValue({
      userId: '507f1f77bcf86cd799439011',
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date(),
    }),
  };

  const mockLocationModel: Partial<Model<Location>> = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLocation]),
      }),
    }),
  };

  const locationModelMock = jest.fn().mockImplementation(() => mockLocation);
  Object.assign(locationModelMock, mockLocationModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken(Location.name),
          useValue: locationModelMock as unknown as Model<Location>,
        },
        {
          provide: UsersService,
          useValue: {
            findPatientsByDoctor: jest.fn().mockResolvedValue([
              {
                _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
                role: UserRole.PATIENT,
                name: 'Test Patient',
                email: 'patient@example.com',
                password: 'hashed',
              },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    locationModel = module.get<Model<Location>>(getModelToken(Location.name));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveLocation', () => {
    it('should save a location', async () => {
      const locationDto = { userId: '507f1f77bcf86cd799439011', latitude: 40.7128, longitude: -74.0060 };
      const result = await service.saveLocation(locationDto);
      expect(locationModelMock).toHaveBeenCalledWith({
        ...locationDto,
        timestamp: expect.any(Date),
      });
      expect(mockLocation.save).toHaveBeenCalled();
      expect(result).toMatchObject(locationDto);
    });
  });

  describe('getLocations', () => {
    it('should retrieve locations for a user', async () => {
      const result = await service.getLocations('507f1f77bcf86cd799439011');
      expect(locationModel.find).toHaveBeenCalledWith({ userId: '507f1f77bcf86cd799439011' });
      expect(result).toEqual([mockLocation]);
    });
  });

  describe('getPatientLocations', () => {
    it('should retrieve locations for doctor’s patients', async () => {
      const result = await service.getPatientLocations('doctor1');
      expect(usersService.findPatientsByDoctor).toHaveBeenCalledWith('doctor1');
      expect(locationModel.find).toHaveBeenCalledWith({ userId: { $in: ['507f1f77bcf86cd799439011'] } });
      expect(result).toEqual([mockLocation]);
    });
  });
});