import { Controller, Get, Header, Param, Res, Req, HttpStatus } from "@nestjs/common";
import { Response, Request } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

import * as stream from "stream";
import { promisify } from "util";

@Controller("media")
export class MediaController {
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }

  @Get(":key")
  async streamVideo(@Param("key") key: string, @Req() req: Request, @Res() res: Response) {
    const bucket = this.configService.get<string>("AWS_S3_BUCKET");
    const range = req.headers.range;

    if (!range) {
      return res.status(HttpStatus.BAD_REQUEST).send("Requires Range header");
    }

    const start = Number(range.replace(/\D/g, ""));
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: range,
    });

    try {
      const data = await this.s3.send(command);
      const streamPipeline = promisify(stream.pipeline);

      res.writeHead(HttpStatus.PARTIAL_CONTENT, {
        "Content-Range": data.ContentRange,
        "Accept-Ranges": "bytes",
        "Content-Length": data.ContentLength,
        "Content-Type": data.ContentType,
      });

      await streamPipeline(data.Body as stream.Readable, res);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    }
  }
}
