export declare class CallDto {
    callerId: string;
    receiverId: string;
    type: 'voice' | 'video';
    sdp: string;
}
