import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";
import { PrismaService } from "@common/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

import { PassportModule } from "@nestjs/passport";

import { ClientsModule, Transport } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { PrismaModule } from "../prisma/prisma.module";

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
    PrismaModule,
    JwtModule.register({ secret: process.env.SECRET_AUTH_KEY }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
