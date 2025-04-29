import { Model } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
import { Message } from './entities/message.entity';
export declare class ChatService {
    private messageModel;
    constructor(messageModel: Model<Message>);
    saveMessage(messageDto: MessageDto): Promise<Message>;
    getMessages(senderId: string, receiverId: string): Promise<Message[]>;
    markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
}
