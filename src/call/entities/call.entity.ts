import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Call extends Document {
  @Prop({ required: true })
  callerId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  type: 'voice' | 'video';

  @Prop({ required: true })
  status: 'initiated' | 'accepted' | 'rejected' | 'ended';

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  duration?: number; // In seconds

  @Prop()
  recordingUrl?: string; // URL to stored recording (if applicable)
}

export const CallSchema = SchemaFactory.createForClass(Call);