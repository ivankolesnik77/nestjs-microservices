import { Resolver } from "@nestjs/graphql";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import { AuthUserInput, ResetPasswordInput } from "./dto/createUser.dto";

import { Inject, Injectable } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
@Injectable()
export class UsersService {
  constructor(
    @Inject("USERS") private readonly usersClient: ClientProxy,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async user(id: number): Promise<User | null> {
    return lastValueFrom(this.usersClient.send({ cmd: "user" }, id));
  }

  async userBy(data: Partial<User>): Promise<any | null> {
    return lastValueFrom(this.usersClient.send({ cmd: "userBy" }, data));
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return lastValueFrom(this.usersClient.send({ cmd: "users" }, params));
  }

  async createUser(data: Prisma.UserCreateInput): Promise<string> {
    return lastValueFrom(this.usersClient.send({ cmd: "createUser" }, data));
  }

  async authUser(data: AuthUserInput): Promise<(User & { accessToken: string }) | null> {
    return lastValueFrom(this.usersClient.send({ cmd: "authUser" }, data));
  }

  async refreshTokens(userId: string): Promise<any> {
    return lastValueFrom(this.usersClient.send({ cmd: "refreshTokens" }, userId));
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    return lastValueFrom(this.usersClient.send({ cmd: "updateUser" }, params));
  }

  async resetPassword(params: ResetPasswordInput): Promise<boolean> {
    return lastValueFrom(this.usersClient.send({ cmd: "resetPassword" }, params));
  }

  async createInviteLink(userId: number) {
    return lastValueFrom(this.usersClient.send({ cmd: "createInviteLink" }, userId));
  }

  async verifyUser(token: string): Promise<User | null> {
    return lastValueFrom(this.usersClient.send({ cmd: "verifyUser" }, token));
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return lastValueFrom(this.usersClient.send({ cmd: "deleteUser" }, where));
  }
}
