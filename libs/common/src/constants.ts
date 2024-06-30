export enum SubscriptionType {
  Basic = "Basic",
  Advanced = "Advanced",
  Premium = "Premium",
}
export const salt_rounds = 10;
export const stripe_products_ids = {
  [SubscriptionType.Basic]: "prod_PRrYfsXBHeOykk",
  [SubscriptionType.Advanced]: "prod_PRqLWASs3g1U8U",
  [SubscriptionType.Premium]: "prod_PRrZp0vWyY1Ua9",
};

export const INVITE_CODE_EXPIRATION_TIME = 12 * 60 * 60 * 1000;
