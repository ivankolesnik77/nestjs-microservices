import { Module } from '@nestjs/common';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StripeWebhookController } from './stripe.contoller';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [StripeWebhookController],
  providers: [StripeResolver, StripeService, PrismaService, UsersService],
})
export class StripeModule {}
