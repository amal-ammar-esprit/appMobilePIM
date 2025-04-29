import { IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  content: string;
}