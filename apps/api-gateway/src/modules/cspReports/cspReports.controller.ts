// video.controller.ts

import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";

@Controller("cspReports")
export class CspReportsController {
  constructor() {}

  @Post()
  @HttpCode(204)
  handleCspViolation(@Body() report: any, @Res() res: Response) {
    console.log("CSP Violation Report:", report);

    return null;
  }
}
