import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Global, Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global() // 👈 global module
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          auth: {
            user: "vanilage77@gmail.com",
            pass: "vebrblazddymcnsw",
          },
        },
        template: {
          dir: join(__dirname, "..", "..", "..", "src", "modules", "mail", "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
