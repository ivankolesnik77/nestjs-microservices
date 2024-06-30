"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const prisma_service_1 = require("../../../../../libs/common/src/prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const microservices_1 = require("@nestjs/microservices");
const users_service_1 = require("./users.service");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: "USERS",
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: "localhost",
                        port: 3002,
                    },
                },
            ]),
            jwt_1.JwtModule.register({ secret: process.env.SECRET_AUTH_KEY }),
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
        ],
        providers: [users_service_1.UsersService, prisma_service_1.PrismaService],
        controllers: [users_controller_1.UsersController],
    })
], UsersModule);
