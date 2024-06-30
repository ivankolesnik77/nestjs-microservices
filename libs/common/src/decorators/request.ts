import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Header = createParamDecorator((headerName: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers[headerName.toLowerCase()];
});
