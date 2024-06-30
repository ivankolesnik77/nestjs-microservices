import { UsersService } from './../users/users.service';
import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import Stripe from 'stripe';

import { StripeService } from './stripe.service';
import { Socket } from 'socket.io';

@Controller('webhook')
export class StripeWebhookController {
  private readonly stripe: Stripe;

  constructor(
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY);
  }

  @Post()
  async handleWebhook(
    @Body() body: Buffer,
    @Headers('stripe-signature') stripeSignature: string,
    @Res() res,
  ): Promise<String | null> {
    let event;
    console.log('web-hook');
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error(err);
      console.log(`⚠️  Webhook signature verification failed.`);
      console.log(
        `⚠️  Check the env file and enter the correct webhook secret.`,
      );
      return res.status(HttpStatus.BAD_REQUEST).json();
    }
    console.log('event', event);
    const customerPaymentId = event.data.object.customer;

    if (!customerPaymentId) return;
    const userToUpdate = await this.usersService.userBy({
      customerId: customerPaymentId,
    });

    if (!userToUpdate) return;

    switch (event.type) {
      case 'invoice.paid': {
        await this.usersService.updateUser({
          data: { subscriptionStatus: 'Payed' },
          where: { id: userToUpdate.id },
        });
      }

      case 'invoice.payment_failed': {
        await this.usersService.updateUser({
          data: { subscriptionStatus: 'Failed' },
          where: { id: userToUpdate.id },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        await this.usersService.updateUser({
          data: { subscriptionStatus: null },
          where: { id: userToUpdate.id },
        });
        break;
      }
      default:
      // Unexpected event type
    }

    return null;
  }
}
