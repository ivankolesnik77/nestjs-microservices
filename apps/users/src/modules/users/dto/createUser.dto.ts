import { Field, ID, InputType } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsString, isNotEmpty, isNumber } from "class-validator";

@InputType()
export class CreateUserInput implements Prisma.UserCreateInput {
  @Field()
  @IsOptional()
  @IsEmail()
  email: string;

  @Field()
  @IsOptional()
  @IsString()
  name: string;

  @Field()
  @IsOptional()
  @IsString()
  surname: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  customerId: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsOptional()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  resetPasswordToken: string;
}

@InputType()
export class AuthUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class VerifyUserInput {
  @Field()
  @IsString()
  token: string;
}
