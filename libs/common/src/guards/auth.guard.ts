import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessTokenGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    console.log(err, user, info, context, status);

    if (err || !user) {
      return info;
    }

    return user;
  }
}
