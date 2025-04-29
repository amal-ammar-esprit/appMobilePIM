import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDto } from './dtos/message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(userId);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() messageDto: MessageDto, @ConnectedSocket() client: Socket) {
    const message = await this.chatService.saveMessage(messageDto);
    this.server.to(message.receiverId).emit('receiveMessage', message);
    this.server.to(message.senderId).emit('messageSent', message);
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@MessageBody() { senderId, receiverId }: { senderId: string; receiverId: string }) {
    await this.chatService.markMessagesAsRead(senderId, receiverId);
    this.server.to(senderId).emit('messagesRead', { receiverId });
  }
}