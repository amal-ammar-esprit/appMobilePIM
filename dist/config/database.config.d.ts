import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
export declare const databaseConfig: (configService: ConfigService) => MongooseModuleOptions;
