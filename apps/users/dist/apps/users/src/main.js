"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: { port: 3002 },
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    await app.listen().then((value) => {
        console.log(" Server is running on 3002: ");
    });
}
bootstrap();
