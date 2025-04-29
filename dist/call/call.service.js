"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const call_entity_1 = require("./entities/call.entity");
let CallService = class CallService {
    callModel;
    constructor(callModel) {
        this.callModel = callModel;
    }
    async saveCall(callData) {
        const call = new this.callModel(callData);
        return call.save();
    }
    async updateCallStatus(callId, status, duration) {
        const updatedCall = await this.callModel
            .findByIdAndUpdate(callId, { status, duration }, { new: true })
            .exec();
        if (!updatedCall) {
            throw new common_1.NotFoundException(`Call with ID ${callId} not found`);
        }
        return updatedCall;
    }
    async getCallHistory(userId) {
        return this.callModel
            .find({
            $or: [{ callerId: userId }, { receiverId: userId }],
        })
            .sort({ timestamp: -1 })
            .limit(50)
            .exec();
    }
};
exports.CallService = CallService;
exports.CallService = CallService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(call_entity_1.Call.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CallService);
//# sourceMappingURL=call.service.js.map