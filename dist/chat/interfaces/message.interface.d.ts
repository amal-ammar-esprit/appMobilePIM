import { Document } from 'mongoose';
export interface Message extends Document {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
}
