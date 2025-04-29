import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { RelatedDto } from './dtos/related.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
            patientId: string | undefined;
        };
        token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
            patientId: string | undefined;
            relatedUsers: import("mongoose").Types.ObjectId[];
        };
        token: string;
    }>;
    getRelatedUsers(relatedDto: RelatedDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
        patientId: string | undefined;
    }[]>;
}
