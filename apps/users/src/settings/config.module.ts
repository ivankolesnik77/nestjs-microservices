import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { defaultAppSettings } from "./domain/app-settings";

@Module({
  imports: [ConfigModule.forRoot(defaultAppSettings)],
})
export class ConfigAppModule {}
