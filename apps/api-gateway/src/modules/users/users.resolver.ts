import { Mutation, ObjectType, Query, Resolver, Args, Field, ResolveField, Parent, Context } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { NotFoundException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { User } from "./user.entity";
import { AuthUserInput, CreateUserInput, ResetPasswordInput } from "./dto/createUser.dto";

import { AccessTokenGuard } from "@common/guards/auth.guard";
import { RefreshTokenGuard } from "@common/guards/refresh.guard";
import { JwtService } from "@nestjs/jwt";

@ObjectType()
export class UserInfoResponse {
  @Field(() => String)
  status: string;
}

@ObjectType()
export class RefreshTokensResponse {
  @Field(() => String, { nullable: true })
  error?: string;
  @Field(() => String, { nullable: true })
  accessToken?: string;
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

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Query((returns) => [User])
  async getUsers(): Promise<User[] | null> {
    return this.usersService.users({});
  }

  @Query((returns) => User)
  async getUser(@Args("id") id: number): Promise<User | null> {
    return this.usersService.user(id);
  }

  @Mutation((returns) => String)
  async createUser(@Args("user") createUserData: CreateUserInput) {
    return this.usersService.createUser(createUserData);
  }

  @Query((returns) => CheckUserEmailResponse)
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

  @Query((returns) => AuthResponse, { nullable: true })
  async authUser(@Args("user") authData: AuthUserInput, @Context() context: any) {
    const { res } = context;
    let userResponse;
    try {
      userResponse = await this.usersService.authUser(authData);
    } catch (error) {
      // Handle other potential errors during authentication
      console.error("Error during authentication:", error);

      // You can throw a different exception or return a meaningful error response to the client
      throw new Error("Failed to authenticate user");
      return;
    }

    if (!userResponse) {
      return new NotFoundException("User not found");
    }

    const { refreshToken, ...user } = userResponse;
    res.cookie("refreshToken", refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    return { user };
  }

  @Query((returns) => User, { nullable: true })
  @UseGuards(AccessTokenGuard)
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

  @Mutation((returns) => RefreshTokensResponse, { nullable: true })
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Context() context: any) {
    const { req, res } = context;
    const userId = req.user["sub"];

    const tokens = await this.usersService.refreshTokens(userId);

    if (tokens?.errors?.length) return { error: tokens.errors[0] };

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @Mutation((returns) => String)
  @UseGuards(AccessTokenGuard)
  async getInviteLink(@Args("userId") userId: number) {
    const inviteLink = await this.usersService.createInviteLink(userId);
    return inviteLink;
  }

  @ResolveField()
  async userName(@Parent() user: User) {
    // @ts-ignore
    return user.name + user.surname;
  }

  @Mutation((returns) => UserInfoResponse)
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

  @Mutation((returns) => UserInfoResponse)
  async updateUser(@Args("user") updateUserData: CreateUserInput): Promise<UserInfoResponse> {
    await this.usersService.updateUser({
      data: updateUserData,
      where: { id: 1 },
    });
    return { status: "Ok" };
  }
}
