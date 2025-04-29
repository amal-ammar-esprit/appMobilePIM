import { UsersService } from './users.service';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getRelatedUsers(userId: string): Promise<import("mongoose").Types.ObjectId[]>;
    findById(id: string): Promise<User>;
}
