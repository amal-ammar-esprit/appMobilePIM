import { Document } from 'mongoose';
export declare class Call extends Document {
    callerId: string;
    receiverId: string;
    type: 'voice' | 'video';
    status: 'initiated' | 'accepted' | 'rejected' | 'ended';
    timestamp: Date;
    duration?: number;
    recordingUrl?: string;
}
export declare const CallSchema: import("mongoose").Schema<Call, import("mongoose").Model<Call, any, any, any, Document<unknown, any, Call> & Call & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Call, Document<unknown, {}, import("mongoose").FlatRecord<Call>> & import("mongoose").FlatRecord<Call> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
