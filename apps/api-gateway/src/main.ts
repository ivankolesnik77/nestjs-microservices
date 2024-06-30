import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import { IoAdapter } from "@nestjs/platform-socket.io";
var cookieParser = require("cookie-parser");
import helmet from "helmet";
import { ValidationPipe } from "@common/pipes";
import "tsconfig-paths/register";
export const greet = (name: string) => `Hello, ${name}`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(
    helmet({
      hidePoweredBy: true,
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      referrerPolicy: false,
      frameguard: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        reportUri: "/csp-reports",
      },
    }),
  );
  console.log("cors: ", process.env.CLIENT_DOMAIN_NAME);
  app.enableCors({ origin: process.env.CLIENT_DOMAIN_NAME, credentials: true });

  app.use(cookieParser());

  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(express.static("public"));

  app.use((req, res, next) => {
    res.header("Access-Control-Expose-Headers", "x-total-count");
    next();
  });

  await app.listen(3000).then((value) => {
    console.log("Server is running on 3000: ");
  });
}

bootstrap();
