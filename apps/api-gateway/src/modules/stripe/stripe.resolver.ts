import { Query } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import Stripe from 'stripe';

import { Logger, UnprocessableEntityException } from '@nestjs/common';

import * as util from 'util';
import { StripeService } from './stripe.service';

@ObjectType()
export class PaymentInfo {
  @Field((type) => Int)
  amount: number;

  @Field()
  currency: string;
}

@ObjectType()
export class PaymentIntentResponse {
  @Field(() => String)
  clientSecret: String;
}

@Resolver('Payment')
export class StripeResolver {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentsService: StripeService,
  ) {
    this.stripe = new Stripe(
      'sk_test_51OJfncBX7glaLMPlZXighIdG9OwSr99B20L8BrKHrDkRdrdsRNVGNJpdnlY6BhUBoatkRPWB5MEsPWEqLvSNaO9000jCetdXjk',
    );
  }

  @Mutation((returns) => PaymentIntentResponse, { name: 'paymentIntent' })
  async createPaymentIntent(@Args('amount') amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      Logger.error(
        '[stripeService] Error creating a payment intent',
        util.inspect(error),
      );
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }
  }
}
