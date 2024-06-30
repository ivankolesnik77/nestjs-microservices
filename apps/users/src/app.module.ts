import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";

import { JwtModule } from "@nestjs/jwt";

import { ConfigAppModule } from "./settings/config.module";

import { PrismaService } from "./modules/prisma/prisma.service";

import { RawBodyMiddleware } from "@common/middlewares/rawBody.middleware";
import { JsonBodyMiddleware } from "@common/middlewares/jsonBody";

import { ClientsModule, Transport } from "@nestjs/microservices";
import { UsersModule } from "./modules/users/users.module";

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
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: "/",
    }),
    UsersModule,
  ],
  providers: [],
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
