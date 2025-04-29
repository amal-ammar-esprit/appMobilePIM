import { Model } from 'mongoose';
import { Call } from './entities/call.entity';
export declare class CallService {
    private callModel;
    constructor(callModel: Model<Call>);
    saveCall(callData: Partial<Call>): Promise<Call>;
    updateCallStatus(callId: string, status: string, duration?: number): Promise<Call>;
    getCallHistory(userId: string): Promise<Call[]>;
}
