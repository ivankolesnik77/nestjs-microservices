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
exports.UsersController = exports.CheckUserEmailResponse = exports.AuthResponse = exports.UserInfoResponse = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./user.entity");
const createUser_dto_1 = require("../../../../../libs/shared/src/dtos/createUser.dto");
const jwt_1 = require("@nestjs/jwt");
const microservices_1 = require("@nestjs/microservices");
const users_service_1 = require("./users.service");
let UserInfoResponse = class UserInfoResponse {
};
exports.UserInfoResponse = UserInfoResponse;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], UserInfoResponse.prototype, "status", void 0);
exports.UserInfoResponse = UserInfoResponse = __decorate([
    (0, graphql_1.ObjectType)() // Add ObjectType decorator to UserInfoResponse
], UserInfoResponse);
let AuthResponse = class AuthResponse {
};
exports.AuthResponse = AuthResponse;
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], AuthResponse.prototype, "user", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AuthResponse.prototype, "error", void 0);
exports.AuthResponse = AuthResponse = __decorate([
    (0, graphql_1.ObjectType)()
], AuthResponse);
let CheckUserEmailResponse = class CheckUserEmailResponse {
};
exports.CheckUserEmailResponse = CheckUserEmailResponse;
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], CheckUserEmailResponse.prototype, "isExistingUser", void 0);
exports.CheckUserEmailResponse = CheckUserEmailResponse = __decorate([
    (0, graphql_1.ObjectType)()
], CheckUserEmailResponse);
let UsersController = class UsersController {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async getUsers() {
        return this.usersService.users({});
    }
    async getUser(id) {
        return this.usersService.user(id);
    }
    async createUser(createUserData) {
        return this.usersService.createUser(createUserData);
    }
    async checkUserWithEmail(email) {
        try {
            const user = await this.usersService.userBy({ email });
            console.log("test", { isExistingUser: !!user });
            return { isExistingUser: !!user };
        }
        catch (err) {
            console.log(err);
            return { isExisting: false };
        }
    }
    async authUser(authData) {
        try {
            const userResponse = await this.usersService.authUser(authData);
            return userResponse;
        }
        catch (error) {
            // Handle other potential errors during authentication
            console.error("Error during authentication:", error);
            // You can throw a different exception or return a meaningful error response to the client
            return "Failed to authenticate user";
        }
    }
    async authMe(context) {
        const { req } = context;
        const user = req.user;
        console.log(req);
        if (!(user === null || user === void 0 ? void 0 : user.sub)) {
            return new common_1.UnauthorizedException(user.message);
        }
        const userResponse = await this.usersService.userBy({
            id: user.sub,
        });
        return userResponse;
    }
    async refreshTokens(context) {
        var _a;
        const { req, res } = context;
        const userId = req.user["sub"];
        const tokens = await this.usersService.refreshTokens(userId);
        if ((_a = tokens === null || tokens === void 0 ? void 0 : tokens.errors) === null || _a === void 0 ? void 0 : _a.length)
            return tokens.errors[0];
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 900000,
            httpOnly: true,
        });
        return tokens.accessToken;
    }
    async getInviteLink(userId) {
        const inviteLink = await this.usersService.createInviteLink(userId);
        return inviteLink;
    }
    async resetPassword(data) {
        try {
            const isUpdated = await this.usersService.resetPassword(data);
            if (isUpdated) {
                return { status: "Ok" };
            }
            throw new common_1.NotFoundException("User with provided email is not found");
        }
        catch (err) {
            console.log(err);
            throw new common_1.NotFoundException("User with provided email is not found");
        }
    }
    async updateUser(updateUserData) {
        await this.usersService.updateUser({
            data: updateUserData,
            where: { id: 1 },
        });
        return { status: "Ok" };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "getUsers" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "getUser" }),
    __param(0, (0, graphql_1.Args)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "createUser" }),
    __param(0, (0, graphql_1.Args)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "checkUserWithEmail" }),
    __param(0, (0, graphql_1.Args)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkUserWithEmail", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "authUser" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.AuthUserInput]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "authUser", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "authMe" }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "authMe", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "refreshTokens" }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "refreshTokens", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "getInviteLink" }),
    __param(0, (0, graphql_1.Args)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInviteLink", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "resetPassword" }),
    __param(0, (0, graphql_1.Args)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.ResetPasswordInput]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: "updateUser" }),
    __param(0, (0, graphql_1.Args)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], UsersController);
