import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  PATIENT = 'patient',
  PARENT = 'parent',
}
@Schema()
export class User extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, required: true })
  role: UserRole;

  @Prop()
  patientId?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  relatedUsers: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);