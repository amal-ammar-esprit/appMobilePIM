import { Server } from 'socket.io';
import { CallDto } from './dtos/call.dto';
import { CallService } from './call.service';
export declare class CallGateway {
    private callService;
    server: Server;
    constructor(callService: CallService);
    handleJoin(client: any, payload: {
        userId: string;
    }): void;
    handleStartCall(client: any, callDto: CallDto & {
        sdp: string;
    }): Promise<void>;
    handleAnswerCall(client: any, callDto: CallDto & {
        callId: string;
        accepted: boolean;
        sdp: string;
    }): Promise<void>;
    handleEndCall(client: any, { callId, duration }: {
        callId: string;
        duration: number;
    }): Promise<void>;
    handleIceCandidate(client: any, data: {
        callId: string;
        callerId: string;
        receiverId: string;
        candidate: any;
    }): void;
}
