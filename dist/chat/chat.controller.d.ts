import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getMessages(senderId: string, receiverId: string): Promise<import("./entities/message.entity").Message[]>;
}
