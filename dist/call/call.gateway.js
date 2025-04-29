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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const call_service_1 = require("./call.service");
let CallGateway = class CallGateway {
    callService;
    server;
    constructor(callService) {
        this.callService = callService;
    }
    handleJoin(client, payload) {
        client.join(payload.userId);
    }
    async handleStartCall(client, callDto) {
        const call = await this.callService.saveCall({
            callerId: callDto.callerId,
            receiverId: callDto.receiverId,
            type: callDto.type,
            status: 'initiated',
        });
        this.server.to(callDto.receiverId).emit('incomingCall', {
            ...callDto,
            callId: call._id,
            sdp: callDto.sdp,
        });
    }
    async handleAnswerCall(client, callDto) {
        const status = callDto.accepted ? 'accepted' : 'rejected';
        await this.callService.updateCallStatus(callDto.callId, status);
        this.server.to(callDto.callerId).emit('callAnswered', {
            ...callDto,
            status,
            sdp: callDto.sdp,
        });
    }
    async handleEndCall(client, { callId, duration }) {
        await this.callService.updateCallStatus(callId, 'ended', duration);
        this.server.to(client.id).emit('callEnded', { callId });
    }
    handleIceCandidate(client, data) {
        const targetUser = client.id === data.callerId ? data.receiverId : data.callerId;
        this.server.to(targetUser).emit('iceCandidate', {
            callId: data.callId,
            candidate: data.candidate,
        });
    }
};
exports.CallGateway = CallGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CallGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CallGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startCall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CallGateway.prototype, "handleStartCall", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('answerCall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CallGateway.prototype, "handleAnswerCall", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('endCall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CallGateway.prototype, "handleEndCall", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('iceCandidate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CallGateway.prototype, "handleIceCandidate", null);
exports.CallGateway = CallGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [call_service_1.CallService])
], CallGateway);
//# sourceMappingURL=call.gateway.js.map