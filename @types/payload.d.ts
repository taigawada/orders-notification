/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OrdersCreate {
  id: number;
  admin_graphql_api_id: string;
  app_id: any;
  browser_ip: any;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: any;
  checkout_id: any;
  checkout_token: any;
  client_details: any;
  closed_at: any;
  confirmation_number: any;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_shipping_price_set: CurrentShippingPriceSet;
  current_subtotal_price: string;
  current_subtotal_price_set: CurrentSubtotalPriceSet;
  current_total_additional_fees_set: any;
  current_total_discounts: string;
  current_total_discounts_set: CurrentTotalDiscountsSet;
  current_total_duties_set: any;
  current_total_price: string;
  current_total_price_set: CurrentTotalPriceSet;
  current_total_tax: string;
  current_total_tax_set: CurrentTotalTaxSet;
  customer_locale: string;
  device_id: any;
  discount_codes: any[];
  duties_included: boolean;
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  landing_site: any;
  landing_site_ref: any;
  location_id: any;
  merchant_business_entity_id: string;
  merchant_of_record_app_id: any;
  name: string;
  note: any;
  note_attributes: any[];
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: any;
  original_total_duties_set: any;
  payment_gateway_names: string[];
  phone: any;
  po_number: any;
  presentment_currency: string;
  processed_at: string;
  reference: any;
  referring_site: any;
  source_identifier: any;
  source_name: string;
  source_url: any;
  subtotal_price: string;
  subtotal_price_set: SubtotalPriceSet;
  tags: string;
  tax_exempt: boolean;
  tax_lines: any[];
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_cash_rounding_payment_adjustment_set: TotalCashRoundingPaymentAdjustmentSet;
  total_cash_rounding_refund_adjustment_set: TotalCashRoundingRefundAdjustmentSet;
  total_discounts: string;
  total_discounts_set: TotalDiscountsSet;
  total_line_items_price: string;
  total_line_items_price_set: TotalLineItemsPriceSet;
  total_outstanding: string;
  total_price: string;
  total_price_set: TotalPriceSet;
  total_shipping_price_set: TotalShippingPriceSet;
  total_tax: string;
  total_tax_set: TotalTaxSet;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: any;
  billing_address: BillingAddress;
  customer: Customer;
  discount_applications: any[];
  fulfillments: any[];
  line_items: LineItem[];
  payment_terms: any;
  refunds: any[];
  shipping_address: ShippingAddress;
  shipping_lines: ShippingLine[];
  returns: never[];
}

export interface CurrentShippingPriceSet {
  shop_money: ShopMoney;
  presentment_money: PresentmentMoney;
}

export interface ShopMoney {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney {
  amount: string;
  currency_code: string;
}

export interface CurrentSubtotalPriceSet {
  shop_money: ShopMoney2;
  presentment_money: PresentmentMoney2;
}

export interface ShopMoney2 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney2 {
  amount: string;
  currency_code: string;
}

export interface CurrentTotalDiscountsSet {
  shop_money: ShopMoney3;
  presentment_money: PresentmentMoney3;
}

export interface ShopMoney3 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney3 {
  amount: string;
  currency_code: string;
}

export interface CurrentTotalPriceSet {
  shop_money: ShopMoney4;
  presentment_money: PresentmentMoney4;
}

export interface ShopMoney4 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney4 {
  amount: string;
  currency_code: string;
}

export interface CurrentTotalTaxSet {
  shop_money: ShopMoney5;
  presentment_money: PresentmentMoney5;
}

export interface ShopMoney5 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney5 {
  amount: string;
  currency_code: string;
}

export interface SubtotalPriceSet {
  shop_money: ShopMoney6;
  presentment_money: PresentmentMoney6;
}

export interface ShopMoney6 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney6 {
  amount: string;
  currency_code: string;
}

export interface TotalCashRoundingPaymentAdjustmentSet {
  shop_money: ShopMoney7;
  presentment_money: PresentmentMoney7;
}

export interface ShopMoney7 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney7 {
  amount: string;
  currency_code: string;
}

export interface TotalCashRoundingRefundAdjustmentSet {
  shop_money: ShopMoney8;
  presentment_money: PresentmentMoney8;
}

export interface ShopMoney8 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney8 {
  amount: string;
  currency_code: string;
}

export interface TotalDiscountsSet {
  shop_money: ShopMoney9;
  presentment_money: PresentmentMoney9;
}

export interface ShopMoney9 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney9 {
  amount: string;
  currency_code: string;
}

export interface TotalLineItemsPriceSet {
  shop_money: ShopMoney10;
  presentment_money: PresentmentMoney10;
}

export interface ShopMoney10 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney10 {
  amount: string;
  currency_code: string;
}

export interface TotalPriceSet {
  shop_money: ShopMoney11;
  presentment_money: PresentmentMoney11;
}

export interface ShopMoney11 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney11 {
  amount: string;
  currency_code: string;
}

export interface TotalShippingPriceSet {
  shop_money: ShopMoney12;
  presentment_money: PresentmentMoney12;
}

export interface ShopMoney12 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney12 {
  amount: string;
  currency_code: string;
}

export interface TotalTaxSet {
  shop_money: ShopMoney13;
  presentment_money: PresentmentMoney13;
}

export interface ShopMoney13 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney13 {
  amount: string;
  currency_code: string;
}

export interface BillingAddress {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: any;
  company: string;
  latitude: any;
  longitude: any;
  name: string;
  country_code: string;
  province_code: string;
}

export interface Customer {
  id: number;
  email: string;
  created_at: any;
  updated_at: any;
  first_name: string;
  last_name: string;
  state: string;
  note: any;
  verified_email: boolean;
  multipass_identifier: any;
  tax_exempt: boolean;
  phone: any;
  email_marketing_consent?: EmailMarketingConsent;
  sms_marketing_consent?: any;
  tags?: string;
  currency: string;
  tax_exemptions: any[];
  admin_graphql_api_id: string;
  default_address: DefaultAddress;
}

export interface EmailMarketingConsent {
  state: string;
  opt_in_level: any;
  consent_updated_at: any;
}

export interface DefaultAddress {
  id: number;
  customer_id: number;
  first_name: any;
  last_name: any;
  company: any;
  address1: string;
  address2: any;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}

export interface LineItem {
  id: number;
  admin_graphql_api_id: string;
  attributed_staffs: AttributedStaff[];
  current_quantity: number;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: any;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: PriceSet;
  product_exists: boolean;
  product_id: number;
  properties: any[];
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: TotalDiscountSet;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: any;
  vendor: any;
  tax_lines: any[];
  duties: any[];
  discount_allocations: any[];
}

export interface AttributedStaff {
  id: string;
  quantity: number;
}

export interface PriceSet {
  shop_money: ShopMoney14;
  presentment_money: PresentmentMoney14;
}

export interface ShopMoney14 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney14 {
  amount: string;
  currency_code: string;
}

export interface TotalDiscountSet {
  shop_money: ShopMoney15;
  presentment_money: PresentmentMoney15;
}

export interface ShopMoney15 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney15 {
  amount: string;
  currency_code: string;
}

export interface ShippingAddress {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: any;
  company: string;
  latitude: any;
  longitude: any;
  name: string;
  country_code: string;
  province_code: string;
}

export interface ShippingLine {
  id: number;
  carrier_identifier: any;
  code: any;
  current_discounted_price_set: CurrentDiscountedPriceSet;
  discounted_price: string;
  discounted_price_set: DiscountedPriceSet;
  is_removed: boolean;
  phone: any;
  price: string;
  price_set: PriceSet2;
  requested_fulfillment_service_id: any;
  source: string;
  title: string;
  tax_lines: any[];
  discount_allocations: any[];
}

export interface CurrentDiscountedPriceSet {
  shop_money: ShopMoney16;
  presentment_money: PresentmentMoney16;
}

export interface ShopMoney16 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney16 {
  amount: string;
  currency_code: string;
}

export interface DiscountedPriceSet {
  shop_money: ShopMoney17;
  presentment_money: PresentmentMoney17;
}

export interface ShopMoney17 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney17 {
  amount: string;
  currency_code: string;
}

export interface PriceSet2 {
  shop_money: ShopMoney18;
  presentment_money: PresentmentMoney18;
}

export interface ShopMoney18 {
  amount: string;
  currency_code: string;
}

export interface PresentmentMoney18 {
  amount: string;
  currency_code: string;
}
