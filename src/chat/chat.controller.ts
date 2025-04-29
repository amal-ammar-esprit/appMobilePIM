import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages/:senderId/:receiverId')
  async getMessages(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string) {
    return this.chatService.getMessages(senderId, receiverId);
  }
}