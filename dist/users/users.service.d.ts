import { Model } from 'mongoose';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    find(filter: any): Promise<User[]>;
    findByPatientId(patientId: string): Promise<User | null>;
    create(createUserDto: any): Promise<User>;
}
