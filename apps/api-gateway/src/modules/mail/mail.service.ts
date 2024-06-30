import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPassword(user: User) {
    const url =
      process.env.CLIENT_DOMAIN_NAME + `/account/resetPassword?token=${user.resetPasswordToken}&email=${user.email}`;
    console.log(url, " was sent to invited user");
    await this.mailerService.sendMail({
      to: user.email,
      from: "vanilage77@gmail.com",
      subject: "Welcome to Nice App! Confirm your Email",
      template: "./confirmation",

      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendUserConfirmation(user: User, token: string) {
    const url = process.env.CLIENT_DOMAIN_NAME + `/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: "vanilage77@gmail.com",
      from: '"Support Team" stonebosh56@gmail.com', // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      // template: './confirmation', // `.hbs` extension is appended automatically
      html: `<p>Hey ${user.name},</p>
<p>Please click below to confirm your email</p>
<p>
  <a href={${url}}>Confirm</a>
</p>

<p>If you did not request this email you can safely ignore it.</p>`,
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
}
