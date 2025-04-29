import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDto } from './dtos/message.dto';
export declare class ChatGateway {
    private chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleMessage(messageDto: MessageDto, client: Socket): Promise<void>;
    handleMarkAsRead({ senderId, receiverId }: {
        senderId: string;
        receiverId: string;
    }): Promise<void>;
}
