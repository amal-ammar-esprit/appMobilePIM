import { IsString } from 'class-validator';

export class CallDto {
  @IsString()
  callerId: string;

  @IsString()
  receiverId: string;

  @IsString()
  type: 'voice' | 'video';

  @IsString()
  sdp: string;
}