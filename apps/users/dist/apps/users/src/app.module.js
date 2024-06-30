"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const jwt_1 = require("@nestjs/jwt");
const config_module_1 = require("./settings/config.module");
const prisma_service_1 = require("./modules/prisma/prisma.service");
const rawBody_middleware_1 = require("../../../libs/common/src/middlewares/rawBody.middleware");
const jsonBody_1 = require("../../../libs/common/src/middlewares/jsonBody");
const microservices_1 = require("@nestjs/microservices");
const users_module_1 = require("./modules/users/users.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(rawBody_middleware_1.RawBodyMiddleware)
            .forRoutes({
            path: "/webhook",
            method: common_1.RequestMethod.POST,
        })
            .apply(jsonBody_1.JsonBodyMiddleware)
            .forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: "USERS",
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: "localhost",
                        port: 3002,
                    },
                },
            ]),
            jwt_1.JwtModule.register({}),
            config_module_1.ConfigAppModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: `${__dirname}/../public`,
                renderPath: "/",
            }),
            // StripeModule,
            users_module_1.UsersModule,
            // MailModule,
            // SubscriptionsModule,
            // StripeModule,
            // CspReportsModule,
        ],
        providers: [prisma_service_1.PrismaService],
        controllers: [],
    })
], AppModule);
