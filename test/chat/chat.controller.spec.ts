import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from '../../src/chat/chat.controller';
import { ChatService } from '../../src/chat/chat.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';

describe('ChatController', () => {
  let app: INestApplication;
  let chatService: ChatService;

  const mockChatService = {
    getMessages: jest.fn().mockResolvedValue([
      {
        senderId: '507f1f77bcf86cd799439011',
        receiverId: '507f1f77bcf86cd799439012',
        content: 'Hello',
        timestamp: new Date(),
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    chatService = module.get<ChatService>(ChatService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('GET /chat/messages/:senderId/:receiverId', () => {
    it('should return messages between two users', async () => {
      const response = await request(app.getHttpServer())
        .get('/chat/messages/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012')
        .expect(200);
      expect(response.body).toEqual([
        {
          senderId: '507f1f77bcf86cd799439011',
          receiverId: '507f1f77bcf86cd799439012',
          content: 'Hello',
          timestamp: expect.any(String),
        },
      ]);
      expect(chatService.getMessages).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
      );
    });
  });
});