import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call } from './entities/call.entity';

@Injectable()
export class CallService {
  constructor(@InjectModel(Call.name) private callModel: Model<Call>) {}

  async saveCall(callData: Partial<Call>): Promise<Call> {
    const call = new this.callModel(callData);
    return call.save();
  }

  async updateCallStatus(callId: string, status: string, duration?: number): Promise<Call> {
    const updatedCall = await this.callModel
      .findByIdAndUpdate(
        callId,
        { status, duration },
        { new: true }
      )
      .exec();

    if (!updatedCall) {
      throw new NotFoundException(`Call with ID ${callId} not found`);
    }

    return updatedCall;
  }

  async getCallHistory(userId: string): Promise<Call[]> {
    return this.callModel
      .find({
        $or: [{ callerId: userId }, { receiverId: userId }],
      })
      .sort({ timestamp: -1 })
      .limit(50)
      .exec();
  }
}