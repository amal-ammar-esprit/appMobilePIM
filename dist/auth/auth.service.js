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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || user.password !== loginDto.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user._id, email: user.email, role: user.role };
        return {
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, patientId: user.patientId },
            token: this.jwtService.sign(payload),
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        let patientId = registerDto.patientId;
        if (registerDto.role === 'parent') {
            if (!patientId) {
                throw new common_1.BadRequestException('Patient ID is required for parents');
            }
            const patient = await this.usersService.findByPatientId(patientId);
            if (!patient || patient.role !== 'patient') {
                throw new common_1.BadRequestException('No patient found with this ID');
            }
        }
        else if (registerDto.role === 'patient') {
            patientId = (0, uuid_1.v4)().slice(0, 8);
        }
        const user = await this.usersService.create({
            name: registerDto.name,
            email: registerDto.email,
            password: registerDto.password,
            role: registerDto.role,
            patientId,
            relatedUsers: [],
        });
        const payload = { sub: user._id, email: user.email, role: user.role };
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                patientId: user.patientId,
                relatedUsers: user.relatedUsers,
            },
            token: this.jwtService.sign(payload),
        };
    }
    async getRelatedUsers(relatedDto) {
        const user = await this.usersService.findById(relatedDto.userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const relatedUsers = await this.usersService.find({
            '_id': { $in: user.relatedUsers }
        });
        return relatedUsers.map(relatedUser => ({
            _id: relatedUser._id,
            name: relatedUser.name,
            email: relatedUser.email,
            role: relatedUser.role,
            patientId: relatedUser.patientId,
        }));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map