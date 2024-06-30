import { Module } from "@nestjs/common";

import { CspReportsController } from "./cspReports.controller";

@Module({
  controllers: [CspReportsController],
  providers: [],
})
export class CspReportsModule {}
