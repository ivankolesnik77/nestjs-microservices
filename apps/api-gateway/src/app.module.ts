import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";

import { join } from "path";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloDriver } from "@nestjs/apollo/dist/drivers";

import { APP_FILTER } from "@nestjs/core";
import { ConfigAppModule } from "./settings/config.module";

import { UsersModule } from "./modules/users/users.module";

import { UsersService } from "./modules/users/users.service";

import { RawBodyMiddleware } from "@common/middlewares/rawBody.middleware";
import { JsonBodyMiddleware } from "@common/middlewares/jsonBody";
import { GraphQLErrorFilter, OriginalError } from "@common/exeptions";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaService } from "./modules/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { StripeService } from "./modules/stripe/stripe.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USERS",
        transport: Transport.TCP,
        options: {
          host: "localhost",
          port: 3002,
        },
      },
    ]),
    JwtModule.register({}),
    ConfigAppModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: {
        settings: {
          "request.credentials": "include",
        },
      },
      formatError: (error) => {
        const originalError = error.extensions?.originalError as OriginalError;

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError.message,
          code: error.extensions?.code,
        };
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    UsersModule,
    // MediaModule,
  ],
  providers: [
    StripeService,
    UsersService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter,
    },
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: "/webhook",
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes("*");
  }
}
