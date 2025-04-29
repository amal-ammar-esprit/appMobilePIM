import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CallDto } from './dtos/call.dto';
import { CallService } from './call.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class CallGateway {
  @WebSocketServer()
  server: Server;

  constructor(private callService: CallService) {}

  @SubscribeMessage('join')
  handleJoin(client: any, payload: { userId: string }): void {
    client.join(payload.userId);
  }

  @SubscribeMessage('startCall')
  async handleStartCall(client: any, callDto: CallDto & { sdp: string }): Promise<void> {
    const call = await this.callService.saveCall({
      callerId: callDto.callerId,
      receiverId: callDto.receiverId,
      type: callDto.type,
      status: 'initiated',
    });
    this.server.to(callDto.receiverId).emit('incomingCall', {
      ...callDto,
      callId: call._id,
      sdp: callDto.sdp, // Forward the SDP offer
    });
  }

  @SubscribeMessage('answerCall')
  async handleAnswerCall(client: any, callDto: CallDto & { callId: string; accepted: boolean; sdp: string }): Promise<void> {
    const status = callDto.accepted ? 'accepted' : 'rejected';
    await this.callService.updateCallStatus(callDto.callId, status);
    this.server.to(callDto.callerId).emit('callAnswered', {
      ...callDto,
      status,
      sdp: callDto.sdp, // Forward the SDP answer
    });
  }

  @SubscribeMessage('endCall')
  async handleEndCall(client: any, { callId, duration }: { callId: string; duration: number }): Promise<void> {
    await this.callService.updateCallStatus(callId, 'ended', duration);
    this.server.to(client.id).emit('callEnded', { callId });
  }

  @SubscribeMessage('iceCandidate')
  handleIceCandidate(client: any, data: { callId: string; callerId: string; receiverId: string; candidate: any }): void {
    const targetUser = client.id === data.callerId ? data.receiverId : data.callerId;
    this.server.to(targetUser).emit('iceCandidate', {
      callId: data.callId,
      candidate: data.candidate,
    });
  }
}