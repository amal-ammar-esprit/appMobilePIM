import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async saveMessage(messageDto: MessageDto): Promise<Message> {
    const message = new this.messageModel({
      ...messageDto,
      timestamp: new Date(),
    });
    return message.save();
  }

  async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
      .sort({ timestamp: 1 })
      .limit(50) // Limit to last 50 messages for performance
      .exec();
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await this.messageModel
      .updateMany(
        { senderId: receiverId, receiverId: senderId, read: false },
        { read: true }
      )
      .exec();
  }
}