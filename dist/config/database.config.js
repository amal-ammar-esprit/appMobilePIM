"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = (configService) => ({
    uri: configService.get('MONGODB_URI'),
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map