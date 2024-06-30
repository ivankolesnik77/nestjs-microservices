import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { IoAdapter } from "@nestjs/platform-socket.io";

import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { port: 3002 },
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen().then((value) => {
    console.log(" Server is running on 3002: ");
  });
}

bootstrap();
