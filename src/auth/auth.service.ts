// auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { RelatedDto } from './dtos/related.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, patientId: user.patientId },
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    let patientId = registerDto.patientId;

    if (registerDto.role === 'parent') {
      if (!patientId) {
        throw new BadRequestException('Patient ID is required for parents');
      }

      const patient = await this.usersService.findByPatientId(patientId);
      if (!patient || patient.role !== 'patient') {
        throw new BadRequestException('No patient found with this ID');
      }
    } else if (registerDto.role === 'patient') {
      patientId = uuidv4().slice(0, 8); // 8-character ID
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

  // New method to fetch related users by userId
  async getRelatedUsers(relatedDto: RelatedDto) {
    const user = await this.usersService.findById(relatedDto.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Fetch users whose relatedUsers array contains the provided userId
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
}
