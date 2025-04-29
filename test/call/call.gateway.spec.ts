import { Test, TestingModule } from '@nestjs/testing';
import { CallGateway } from '../../src/call/call.gateway';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

describe('CallGateway', () => {
  let app: INestApplication;
  let gateway: CallGateway;
  let socket: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallGateway],
    }).compile();

    app = module.createNestApplication();
    gateway = module.get<CallGateway>(CallGateway);
    await app.listen(0);

    const port = (app.getHttpServer().address() as any).port;
    socket = io(`http://localhost:${port}`, { transports: ['websocket'], reconnection: false });
  });

  afterEach(async () => {
    socket.disconnect();
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('startCall', () => {
    it('should emit incomingCall event', async () => {
      const callDto = { callerId: '1', receiverId: '2', type: 'video', sdp: 'sdp_data' };
      
      // Join the receiver's room
      socket.emit('join', { userId: '2' });

      // Wait for connection
      await new Promise<void>((resolve) => socket.on('connect', () => resolve()));

      // Wait briefly for room joining
      await new Promise((resolve) => setTimeout(resolve, 100));

      const promise = new Promise<void>((resolve) => {
        socket.on('incomingCall', (data) => {
          expect(data).toEqual(callDto);
          resolve();
        });
      });

      socket.emit('startCall', callDto);
      await promise;
    }, 15000); // Increase timeout
  });

  describe('answerCall', () => {
    it('should emit callAnswered event', async () => {
      const callDto = { callerId: '1', receiverId: '2', type: 'video', sdp: 'sdp_data' };
      
      // Join the caller's room
      socket.emit('join', { userId: '1' });

      // Wait for connection
      await new Promise<void>((resolve) => socket.on('connect', () => resolve()));

      // Wait briefly for room joining
      await new Promise((resolve) => setTimeout(resolve, 100));

      const promise = new Promise<void>((resolve) => {
        socket.on('callAnswered', (data) => {
          expect(data).toEqual(callDto);
          resolve();
        });
      });

      socket.emit('answerCall', callDto);
      await promise;
    }, 15000); // Increase timeout
  });
});