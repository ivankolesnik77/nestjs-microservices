import { SetMetadata } from "@nestjs/common";

export const LOGGER_KEY = "logger";
export const Logger = (enabled: boolean) => SetMetadata(LOGGER_KEY, enabled);
