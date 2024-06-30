import { ExecutionContext } from "@nestjs/common";
declare const AccessTokenGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AccessTokenGuard extends AccessTokenGuard_base {
    getRequest(context: ExecutionContext): any;
    handleRequest(err: any, user: any, info: any, context: any, status?: any): any;
}
export {};
