import { Resolver } from "@nestjs/graphql";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import { AuthUserInput, ResetPasswordInput } from "./dto/createUser.dto";

import { encrypt, generateResetToken, hashString } from "@common/helpers/auth";

import { Injectable } from "@nestjs/common";

import { getCurrentDatePlusWeek } from "@common/helpers/date";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async user(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async userBy(data: Partial<User>): Promise<any | null> {
    return this.prisma.user.findFirst({ where: data });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<string> {
    await this.prisma.user.create({
      data,
    });

    const token = await this.jwtService.sign({
      email: data.email,
    });

    return token;
  }

  async authUser(data: AuthUserInput): Promise<(User & { accessToken: string }) | null> {
    const resetPasswordToken = await generateResetToken();
    const user = await this.prisma.user.update({
      where: {
        email: data.email,
      },
      data: { resetPasswordToken },
    });
    console.log(data.email);

    if (!user) {
      return null;
    }

    const hashedInputPassword = hashString(data.password);

    if (hashedInputPassword === user.password) {
      const tokens = await this.getTokens(user.id, user.subscriptionId);
      const updatedUser = await this.updateRefreshToken(user.id, tokens.refreshToken);

      return { ...updatedUser, ...tokens };
    }

    return null;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.updateUser({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    });
    return user;
  }

  async getTokens(userId: number, subscriptionId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: Number(userId),
          subscriptionId: subscriptionId,
        },
        {
          secret: this.configService.get<string>("SECRET_AUTH_KEY"),
          expiresIn: "12h",
        },
      ),
      this.jwtService.signAsync(
        {
          sub: Number(userId),
          subscriptionId,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: "7d",
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string): Promise<any> {
    const user = await this.user(+userId);
    if (!user) return { errors: ["Access Denied"] };

    const tokens = await this.getTokens(user.id, user.subscriptionId);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async resetPassword(params: ResetPasswordInput): Promise<boolean> {
    const { email, resetPasswordToken, password } = params;
    const hashedInputPassword = hashString(password);
    const updatedUser = await this.prisma.user.update({
      where: { email, resetPasswordToken },
      data: { password: hashedInputPassword },
    });

    return !!updatedUser;
  }

  async createInviteLink(userId: number) {
    const user = await this.user(userId);

    if (!user) {
      return "User not found";
    }
    if (user?.subscriptionStatus === "Payed") {
      const hash = encrypt(`${user.subscriptionId}`);
      const data = {
        hash,
        userId: user.id,
        expireAt: getCurrentDatePlusWeek(),
      };

      await this.prisma.inviteCode.create({
        data,
      });
      return process.env.BASE_URL + `?invite_link=${hash}`;
    }
    return "";
  }

  async verifyUser(token: string): Promise<User | null> {
    try {
      const payload = await this.jwtService.verify<User>(token, {
        secret: process.env.SECRET_AUTH_KEY,
      });

      if (!payload) {
        return null;
      }

      const user = await this.prisma.user.findFirst({
        where: {
          email: payload.email,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
