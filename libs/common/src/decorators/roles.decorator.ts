import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

// enum Roles {
//   VISITOR = "visitor",
//   USER = "user",
// }

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
