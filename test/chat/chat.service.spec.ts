import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../../src/chat/chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { Message } from '../../src/chat/entities/message.entity';
import { Model } from 'mongoose';

describe('ChatService', () => {
  let service: ChatService;
  let messageModel: Model<Message>;

  const mockMessage = {
    senderId: '507f1f77bcf86cd799439011',
    receiverId: '507f1f77bcf86cd799439012',
    content: 'Hello',
    timestamp: new Date(),
    save: jest.fn().mockResolvedValue({
      senderId: '507f1f77bcf86cd799439011',
      receiverId: '507f1f77bcf86cd799439012',
      content: 'Hello',
      timestamp: new Date(),
    }),
  };

  const mockMessageModel: Partial<Model<Message>> = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockMessage]),
      }),
    }),
  };

  const messageModelMock = jest.fn().mockImplementation(() => mockMessage);
  Object.assign(messageModelMock, mockMessageModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Message.name),
          useValue: messageModelMock as unknown as Model<Message>,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    messageModel = module.get<Model<Message>>(getModelToken(Message.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveMessage', () => {
    it('should save a message', async () => {
      const messageDto = {
        senderId: '507f1f77bcf86cd799439011',
        receiverId: '507f1f77bcf86cd799439012',
        content: 'Hello',
      };
      const result = await service.saveMessage(messageDto);
      expect(messageModelMock).toHaveBeenCalledWith({
        ...messageDto,
        timestamp: expect.any(Date),
      });
      expect(mockMessage.save).toHaveBeenCalled();
      expect(result).toMatchObject(messageDto);
    });
  });

  describe('getMessages', () => {
    it('should retrieve messages between two users', async () => {
      const result = await service.getMessages('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
      expect(messageModel.find).toHaveBeenCalledWith({
        $or: [
          { senderId: '507f1f77bcf86cd799439011', receiverId: '507f1f77bcf86cd799439012' },
          { senderId: '507f1f77bcf86cd799439012', receiverId: '507f1f77bcf86cd799439011' },
        ],
      });
      expect(result).toEqual([mockMessage]);
    });
  });
});