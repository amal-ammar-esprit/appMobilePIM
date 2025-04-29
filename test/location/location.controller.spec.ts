import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from '../../src/location/location.controller';
import { LocationService } from '../../src/location/location.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';

describe('LocationController', () => {
  let app: INestApplication;
  let locationService: LocationService;

  const mockLocationService = {
    saveLocation: jest.fn().mockResolvedValue({
      userId: '1',
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date(),
    }),
    getLocations: jest.fn().mockResolvedValue([
      { userId: '1', latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
    ]),
    getPatientLocations: jest.fn().mockResolvedValue([
      { userId: '1', latitude: 40.7128, longitude: -74.0060, timestamp: new Date() },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock JWT guard
      .compile();

    app = module.createNestApplication();
    locationService = module.get<LocationService>(LocationService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(locationService).toBeDefined();
  });

  describe('POST /location', () => {
    it('should save a location', async () => {
      const locationDto = { userId: '1', latitude: 40.7128, longitude: -74.0060 };
      const response = await request(app.getHttpServer())
        .post('/location')
        .send(locationDto)
        .expect(201);
      expect(response.body).toMatchObject(locationDto);
      expect(locationService.saveLocation).toHaveBeenCalledWith(locationDto);
    });
  });

  describe('GET /location/:userId', () => {
    it('should return locations for a user', async () => {
      const response = await request(app.getHttpServer())
        .get('/location/1')
        .expect(200);
      expect(response.body).toEqual([
        { userId: '1', latitude: 40.7128, longitude: -74.0060, timestamp: expect.any(String) },
      ]);
      expect(locationService.getLocations).toHaveBeenCalledWith('1');
    });
  });

  describe('GET /location/doctor/:doctorId', () => {
    it('should return locations for doctor’s patients', async () => {
      const response = await request(app.getHttpServer())
        .get('/location/doctor/doctor1')
        .expect(200);
      expect(response.body).toEqual([
        { userId: '1', latitude: 40.7128, longitude: -74.0060, timestamp: expect.any(String) },
      ]);
      expect(locationService.getPatientLocations).toHaveBeenCalledWith('doctor1');
    });
  });
});