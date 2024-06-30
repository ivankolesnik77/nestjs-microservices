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
exports.UsersService = void 0;
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let UsersService = class UsersService {
    constructor(usersClient, prisma, jwtService, configService) {
        this.usersClient = usersClient;
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async user(id) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "user" }, id));
    }
    async userBy(data) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "userBy" }, data));
    }
    async users(params) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "users" }, params));
    }
    async createUser(data) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "createUser" }, data));
    }
    async authUser(data) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "authUser" }, data));
    }
    async refreshTokens(userId) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "refreshTokens" }, userId));
    }
    async updateUser(params) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "updateUser" }, params));
    }
    async resetPassword(params) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "resetPassword" }, params));
    }
    async createInviteLink(userId) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "createInviteLink" }, userId));
    }
    async verifyUser(token) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "verifyUser" }, token));
    }
    async deleteUser(where) {
        return (0, rxjs_1.lastValueFrom)(this.usersClient.send({ cmd: "deleteUser" }, where));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("USERS")),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], UsersService);
