import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CallGateway } from './call.gateway';
import { CallService } from './call.service';
import { Call, CallSchema } from './entities/call.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Call.name, schema: CallSchema }]),
  ],
  providers: [CallGateway, CallService],
  exports: [CallService],
})
export class CallModule {}