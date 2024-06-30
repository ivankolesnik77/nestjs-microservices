import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";

export type OriginalError = {
  message: string;
};

@Injectable()
export class GraphQLErrorFilter implements GqlExceptionFilter {
  catch(exception: any, host: GqlArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const { req, res } = ctx;

    if (exception instanceof UnauthorizedException) {
      res.status(401);
    }

    return exception.message || JSON.stringify(exception);
  }
}
