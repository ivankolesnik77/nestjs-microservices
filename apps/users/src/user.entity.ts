import { Prisma, PrismaClient } from "@prisma/client";

import { Field, GraphQLISODateTime, Int, ObjectType } from "@nestjs/graphql";
import { Product as ProductDB, User as UserDB } from "@prisma/client";

@ObjectType()
export class User {
  @Field(() => Int)
  id?: UserDB[`id`];

  @Field(() => String, { nullable: true })
  email: UserDB[`email`];

  @Field(() => String)
  password: UserDB[`password`];

  @Field(() => String)
  subscriptionId?: UserDB[`subscriptionId`];

  @Field(() => String)
  name: UserDB[`name`];

  @Field(() => String)
  surname: UserDB[`surname`];

  @Field(() => String, { nullable: true })
  resetPasswordToken: UserDB[`resetPasswordToken`];

  @Field(() => String, { nullable: true })
  userName: UserDB[`userName`];

  @Field(() => String)
  customerId: UserDB[`customerId`];

  @Field(() => String)
  stripeSubscriptionId: UserDB[`stripeSubscriptionId`];

  @Field(() => String, { nullable: true })
  accessToken?: string;
}
