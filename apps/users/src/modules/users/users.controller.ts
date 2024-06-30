import { Mutation, ObjectType, Query, Resolver, Args, Field, ResolveField, Parent, Context } from "@nestjs/graphql";
import { Controller, NotFoundException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { User } from "./user.entity";
import { AuthUserInput, CreateUserInput, ResetPasswordInput } from "@shared/dtos/createUser.dto";

import { JwtService } from "@nestjs/jwt";
import { MessagePattern } from "@nestjs/microservices";
import { UsersService } from "./users.service";

@ObjectType() // Add ObjectType decorator to UserInfoResponse
export class UserInfoResponse {
  @Field(() => String)
  status: string;
}

@ObjectType()
export class AuthResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class CheckUserEmailResponse {
  @Field(() => Boolean)
  isExistingUser: boolean;
}

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @MessagePattern({ cmd: "getUsers" })
  async getUsers(): Promise<User[] | null> {
    return this.usersService.users({});
  }

  @MessagePattern({ cmd: "getUser" })
  async getUser(@Args("id") id: number): Promise<User | null> {
    return this.usersService.user(id);
  }

  @MessagePattern({ cmd: "createUser" })
  async createUser(@Args("user") createUserData: CreateUserInput) {
    return this.usersService.createUser(createUserData);
  }

  @MessagePattern({ cmd: "checkUserWithEmail" })
  async checkUserWithEmail(@Args("email") email: string) {
    try {
      const user = await this.usersService.userBy({ email });
      console.log("test", { isExistingUser: !!user });
      return { isExistingUser: !!user };
    } catch (err) {
      console.log(err);
      return { isExisting: false };
    }
  }

  @MessagePattern({ cmd: "authUser" })
  async authUser(authData: AuthUserInput) {
    try {
      const userResponse = await this.usersService.authUser(authData);
      return userResponse;
    } catch (error) {
      // Handle other potential errors during authentication
      console.error("Error during authentication:", error);

      // You can throw a different exception or return a meaningful error response to the client
      return "Failed to authenticate user";
    }
  }

  @MessagePattern({ cmd: "authMe" })
  async authMe(@Context() context: any) {
    const { req } = context;
    const user = req.user;
    console.log(req);

    if (!user?.sub) {
      return new UnauthorizedException(user.message);
    }

    const userResponse = await this.usersService.userBy({
      id: user.sub,
    });

    return userResponse;
  }

  @MessagePattern({ cmd: "refreshTokens" })
  async refreshTokens(@Context() context: any) {
    const { req, res } = context;
    const userId = req.user["sub"];

    const tokens = await this.usersService.refreshTokens(userId);

    if (tokens?.errors?.length) return tokens.errors[0];

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    return tokens.accessToken;
  }

  @MessagePattern({ cmd: "getInviteLink" })
  async getInviteLink(@Args("userId") userId: number) {
    const inviteLink = await this.usersService.createInviteLink(userId);
    return inviteLink;
  }

  @MessagePattern({ cmd: "resetPassword" })
  async resetPassword(@Args("user") data: ResetPasswordInput): Promise<UserInfoResponse> {
    try {
      const isUpdated = await this.usersService.resetPassword(data);
      if (isUpdated) {
        return { status: "Ok" };
      }
      throw new NotFoundException("User with provided email is not found");
    } catch (err) {
      console.log(err);
      throw new NotFoundException("User with provided email is not found");
    }
  }

  @MessagePattern({ cmd: "updateUser" })
  async updateUser(@Args("user") updateUserData: CreateUserInput): Promise<UserInfoResponse> {
    await this.usersService.updateUser({
      data: updateUserData,
      where: { id: 1 },
    });
    return { status: "Ok" };
  }
}
