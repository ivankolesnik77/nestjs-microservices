import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

import { stripe_products_ids, SubscriptionType } from "@common/constants";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { Prisma } from "@prisma/client";

import { Socket } from "socket.io";

export type StripeSubscriptionParams = {
  user: {
    // id: number;
    name: string;
    surname: string;
    paymentMethod: any;
    // customerId: string;
  };
  subscriptionType: SubscriptionType;
  subscriptionPrice: number;
  // connectedUsers: User[];
  // subscriptionId: string;
  // inviteLink: string | undefined;
};

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private clients: Socket[] = [];
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.SECRET_STRIPE_KEY);
  }

  getStripeSecretKey(): string {
    return this.configService.get<string>(process.env.SECRET_STRIPE_KEY);
  }

  updateCustomer(customerId, updateData: Prisma.UserUpdateInput) {
    try {
      return this.usersService.updateUser({
        where: { id: customerId },
        data: updateData,
      });
    } catch (err) {
      console.log("Error while updating paying status:");
    }
  }

  createCustomer(user: { name: string; surname: string }) {
    return this.stripe.customers.create({
      // payment_method: 'visa',
      name: `${user.name} ${user.surname}`,
    });
  }

  async createPrice({
    unitAmount,
    productName,
    interval,
  }: {
    unitAmount: number;
    productName: string;
    interval: "day" | "week" | "month" | "year";
  }) {
    try {
      const price = await this.stripe.prices.create({
        unit_amount: unitAmount,
        currency: "usd",
        product: productName,
        recurring: {
          interval,
        },
      });
      return price;
    } catch (error) {
      throw error;
    }
  }

  async updatePrice({ priceId, unitAmount }: { unitAmount: number; priceId: string }) {
    try {
      const price = await this.stripe.prices.update(priceId, {
        currency_options: { unit_amount_decimal: `${unitAmount}` } as any,
      });
      return price;
    } catch (error) {
      throw error;
    }
  }

  async createStripeSubscription(params: StripeSubscriptionParams) {
    const { user, subscriptionType, subscriptionPrice } = params;
    try {
      const price = await this.createPrice({
        unitAmount: subscriptionPrice,
        interval: "month",
        productName: stripe_products_ids[subscriptionType],
      });

      const customer = await this.stripe.customers.create({
        name: user.name,
        email: "stonebo0sh@gmail.com",
        payment_method: user.paymentMethod,
        invoice_settings: {
          default_payment_method: user.paymentMethod,
        },
      });

      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_settings: {
          payment_method_options: {
            card: {
              request_three_d_secure: "any",
            },
          },
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      });
      console.log(subscription);

      return {
        customer,
      };
    } catch (err) {
      console.log("Error during payment process: ", err);
    }
  }

  registerClient(client: Socket): void {
    this.clients.push(client);
  }

  unregisterClient(client: Socket): void {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }

  sendInvoicePaidInfoToClient(token): void {
    console.log("emit invoicePaid", token);
    this.clients.forEach((client) => {
      client.emit("invoicePaid", { token });
    });
  }
}
