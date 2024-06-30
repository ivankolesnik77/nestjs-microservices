import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { RefreshTokenGuard } from "@common/guards/refresh.guard";
import { AccessTokenGuard } from "@common/guards/auth.guard";
import { PassportModule } from "@nestjs/passport";
import { RefreshTokenStrategy } from "../../aunthentication/refresh.strategy";
import { AccessTokenStrategy } from "../../aunthentication/jwt.strategy";
import { ClientsModule, Transport } from "@nestjs/microservices";

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
    JwtModule.register({ secret: process.env.SECRET_AUTH_KEY }),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [
    UsersService,
    UsersResolver,
    PrismaService,
    RefreshTokenStrategy,
    AccessTokenStrategy,
    RefreshTokenGuard,
    AccessTokenGuard,
  ],
})
export class UsersModule {}
