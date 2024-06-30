import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../modules/users/user.entity";
import { UsersService } from "../modules/users/users.service";

type JwtPayload = {
  sub: string;
  user: User;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_AUTH_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
