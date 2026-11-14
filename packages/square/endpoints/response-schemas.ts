import { z } from 'zod';

// Types follow Square's OpenAPI spec (square/connect-api-specification, api.json,
// sha256 8f65460732e1…, Square-Version 2026-09-16).
// Response side: objects are `.loose()`, every field is optional and enums are
// plain strings. A field or enum value Square adds later passes through, and a
// field Square leaves out of an answer never turns a completed call (a charge,
// a refund) into a parse error.

// unknown: Square types this object as free-form (no properties in the spec).
const FreeForm = z.record(z.string(), z.unknown());

// unknown: the spec points at these types but never defines them.
const UnspecifiedObject = z.record(z.string(), z.unknown());

// unknown: Deeply nested objects are typed down to a fixed depth; below that,
// and at the edge that closes the catalog cycle, they are open objects.
// Square checks what is inside.
const OpenObject = z.record(z.string(), z.unknown());

export const ErrorSchema = z.looseObject({
	category: z.string().nullish(),
	code: z.string().nullish(),
	detail: z.string().nullish(),
	field: z.string().nullish(),
});

export const MoneySchema = z.looseObject({
	amount: z.number().int().nullish(),
	currency: z.string().nullish(),
});

export const DisputedPaymentSchema = z.looseObject({
	payment_id: z.string().nullish(),
});

export const DisputeSchema = z.looseObject({
	dispute_id: z.string().nullish(),
	id: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	reason: z.string().nullish(),
	state: z.string().nullish(),
	due_at: z.string().nullish(),
	disputed_payment: DisputedPaymentSchema.nullish(),
	evidence_ids: z.array(z.string()).nullish(),
	card_brand: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
	brand_dispute_id: z.string().nullish(),
	reported_date: z.string().nullish(),
	reported_at: z.string().nullish(),
	version: z.number().int().nullish(),
	location_id: z.string().nullish(),
});

export const AcceptDisputeResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	dispute: DisputeSchema.nullish(),
});

export const AddGroupToCustomerResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const CustomAttributeDefinitionSchema = z.looseObject({
	key: z.string().nullish(),
	schema: FreeForm.nullish(),
	name: z.string().nullish(),
	description: z.string().nullish(),
	visibility: z.string().nullish(),
	version: z.number().int().nullish(),
	updated_at: z.string().nullish(),
	created_at: z.string().nullish(),
});

export const CustomAttributeSchema = z.looseObject({
	key: z.string().nullish(),
	value: FreeForm.nullish(),
	version: z.number().int().nullish(),
	visibility: z.string().nullish(),
	definition: CustomAttributeDefinitionSchema.nullish(),
	updated_at: z.string().nullish(),
	created_at: z.string().nullish(),
});

export const BulkUpsertCustomerCustomAttributesResponseCustomerCustomAttributeUpsertResponseSchema =
	z.looseObject({
		customer_id: z.string().nullish(),
		custom_attribute: CustomAttributeSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const BulkUpsertCustomerCustomAttributesResponseSchema = z.looseObject({
	values: z
		.record(
			z.string(),
			BulkUpsertCustomerCustomAttributesResponseCustomerCustomAttributeUpsertResponseSchema,
		)
		.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const BulkUpsertLocationCustomAttributesResponseLocationCustomAttributeUpsertResponseSchema =
	z.looseObject({
		location_id: z.string().nullish(),
		custom_attribute: CustomAttributeSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const BulkUpsertLocationCustomAttributesResponseSchema = z.looseObject({
	values: z
		.record(
			z.string(),
			BulkUpsertLocationCustomAttributesResponseLocationCustomAttributeUpsertResponseSchema,
		)
		.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const BulkUpsertMerchantCustomAttributesResponseMerchantCustomAttributeUpsertResponseSchema =
	z.looseObject({
		merchant_id: z.string().nullish(),
		custom_attribute: CustomAttributeSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const BulkUpsertMerchantCustomAttributesResponseSchema = z.looseObject({
	values: z
		.record(
			z.string(),
			BulkUpsertMerchantCustomAttributesResponseMerchantCustomAttributeUpsertResponseSchema,
		)
		.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteCustomerResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const BulkDeleteCustomersResponseSchema = z.looseObject({
	responses: z.record(z.string(), DeleteCustomerResponseSchema).nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const ReferenceSchema = z.looseObject({
	type: z.string().nullish(),
	id: z.string().nullish(),
});

export const ChannelSchema = z.looseObject({
	id: z.string().nullish(),
	merchant_id: z.string().nullish(),
	name: z.string().nullish(),
	version: z.number().int().nullish(),
	reference: ReferenceSchema.nullish(),
	status: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
});

export const RetrieveChannelResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	channel: ChannelSchema.nullish(),
});

export const BulkRetrieveChannelsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	responses: z.record(z.string(), RetrieveChannelResponseSchema).nullish(),
});

export const AddressSchema = z.looseObject({
	address_line_1: z.string().nullish(),
	address_line_2: z.string().nullish(),
	address_line_3: z.string().nullish(),
	locality: z.string().nullish(),
	sublocality: z.string().nullish(),
	sublocality_2: z.string().nullish(),
	sublocality_3: z.string().nullish(),
	administrative_district_level_1: z.string().nullish(),
	administrative_district_level_2: z.string().nullish(),
	administrative_district_level_3: z.string().nullish(),
	postal_code: z.string().nullish(),
	country: z.string().nullish(),
	first_name: z.string().nullish(),
	last_name: z.string().nullish(),
});

export const CustomerPreferencesSchema = z.looseObject({
	email_unsubscribed: z.boolean().nullish(),
});

export const CustomerTaxIdsSchema = z.looseObject({
	eu_vat: z.string().nullish(),
});

export const CustomerSchema = z.looseObject({
	id: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
	given_name: z.string().nullish(),
	family_name: z.string().nullish(),
	nickname: z.string().nullish(),
	company_name: z.string().nullish(),
	email_address: z.string().nullish(),
	address: AddressSchema.nullish(),
	phone_number: z.string().nullish(),
	birthday: z.string().nullish(),
	reference_id: z.string().nullish(),
	note: z.string().nullish(),
	preferences: CustomerPreferencesSchema.nullish(),
	creation_source: z.string().nullish(),
	group_ids: z.array(z.string()).nullish(),
	segment_ids: z.array(z.string()).nullish(),
	version: z.number().int().nullish(),
	tax_ids: CustomerTaxIdsSchema.nullish(),
});

export const UpdateCustomerResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	customer: CustomerSchema.nullish(),
});

export const BulkUpdateCustomersResponseSchema = z.looseObject({
	responses: z.record(z.string(), UpdateCustomerResponseSchema).nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const OrderSourceSchema = z.looseObject({
	name: z.string().nullish(),
});

export const MeasurementUnitSchema = z.looseObject({
	custom_unit: OpenObject.nullish(),
	area_unit: z.string().nullish(),
	length_unit: z.string().nullish(),
	volume_unit: z.string().nullish(),
	weight_unit: z.string().nullish(),
	generic_unit: z.string().nullish(),
	time_unit: z.string().nullish(),
	type: z.string().nullish(),
});

export const OrderQuantityUnitSchema = z.looseObject({
	measurement_unit: MeasurementUnitSchema.nullish(),
	precision: z.number().int().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
});

export const OrderLineItemModifierSchema = z.looseObject({
	uid: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	name: z.string().nullish(),
	quantity: z.string().nullish(),
	base_price_money: MoneySchema.nullish(),
	total_price_money: MoneySchema.nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
	parent_modifier_uid: z.string().nullish(),
});

export const OrderLineItemAppliedTaxSchema = z.looseObject({
	uid: z.string().nullish(),
	tax_uid: z.string().nullish(),
	applied_money: MoneySchema.nullish(),
	auto_applied: z.boolean().nullish(),
});

export const OrderLineItemAppliedDiscountSchema = z.looseObject({
	uid: z.string().nullish(),
	discount_uid: z.string().nullish(),
	applied_money: MoneySchema.nullish(),
});

export const OrderLineItemAppliedServiceChargeSchema = z.looseObject({
	uid: z.string().nullish(),
	service_charge_uid: z.string().nullish(),
	applied_money: MoneySchema.nullish(),
});

export const OrderLineItemPricingBlocklistsSchema = z.looseObject({
	blocked_discounts: z.array(OpenObject).nullish(),
	blocked_taxes: z.array(OpenObject).nullish(),
	blocked_service_charges: z.array(OpenObject).nullish(),
});

export const OrderLineItemSchema = z.looseObject({
	uid: z.string().nullish(),
	name: z.string().nullish(),
	quantity: z.string().nullish(),
	quantity_unit: OrderQuantityUnitSchema.nullish(),
	note: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	variation_name: z.string().nullish(),
	item_type: z.string().nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
	modifiers: z.array(OrderLineItemModifierSchema).nullish(),
	applied_taxes: z.array(OrderLineItemAppliedTaxSchema).nullish(),
	applied_discounts: z.array(OrderLineItemAppliedDiscountSchema).nullish(),
	applied_service_charges: z
		.array(OrderLineItemAppliedServiceChargeSchema)
		.nullish(),
	base_price_money: MoneySchema.nullish(),
	variation_total_price_money: MoneySchema.nullish(),
	gross_sales_money: MoneySchema.nullish(),
	total_tax_money: MoneySchema.nullish(),
	total_discount_money: MoneySchema.nullish(),
	total_money: MoneySchema.nullish(),
	pricing_blocklists: OrderLineItemPricingBlocklistsSchema.nullish(),
	total_service_charge_money: MoneySchema.nullish(),
});

export const OrderLineItemTaxSchema = z.looseObject({
	uid: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	name: z.string().nullish(),
	type: z.string().nullish(),
	percentage: z.string().nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
	applied_money: MoneySchema.nullish(),
	scope: z.string().nullish(),
	auto_applied: z.boolean().nullish(),
});

export const OrderLineItemDiscountSchema = z.looseObject({
	uid: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	name: z.string().nullish(),
	type: z.string().nullish(),
	percentage: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	applied_money: MoneySchema.nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
	scope: z.string().nullish(),
	reward_ids: z.array(z.string()).nullish(),
	pricing_rule_id: z.string().nullish(),
});

export const OrderServiceChargeSchema = z.looseObject({
	uid: z.string().nullish(),
	name: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	percentage: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	applied_money: MoneySchema.nullish(),
	total_money: MoneySchema.nullish(),
	total_tax_money: MoneySchema.nullish(),
	calculation_phase: z.string().nullish(),
	taxable: z.boolean().nullish(),
	applied_taxes: z.array(OrderLineItemAppliedTaxSchema).nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
	type: z.string().nullish(),
	treatment_type: z.string().nullish(),
	scope: z.string().nullish(),
});

export const FulfillmentFulfillmentEntrySchema = z.looseObject({
	uid: z.string().nullish(),
	line_item_uid: z.string().nullish(),
	quantity: z.string().nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
});

export const FulfillmentPickupDetailsSchema = z.looseObject({
	recipient: OpenObject.nullish(),
	expires_at: z.string().nullish(),
	auto_complete_duration: z.string().nullish(),
	schedule_type: z.string().nullish(),
	pickup_at: z.string().nullish(),
	pickup_window_duration: z.string().nullish(),
	prep_time_duration: z.string().nullish(),
	note: z.string().nullish(),
	placed_at: z.string().nullish(),
	accepted_at: z.string().nullish(),
	rejected_at: z.string().nullish(),
	ready_at: z.string().nullish(),
	expired_at: z.string().nullish(),
	picked_up_at: z.string().nullish(),
	canceled_at: z.string().nullish(),
	cancel_reason: z.string().nullish(),
	is_curbside_pickup: z.boolean().nullish(),
	curbside_pickup_details: OpenObject.nullish(),
});

export const FulfillmentShipmentDetailsSchema = z.looseObject({
	recipient: OpenObject.nullish(),
	carrier: z.string().nullish(),
	shipping_note: z.string().nullish(),
	shipping_type: z.string().nullish(),
	tracking_number: z.string().nullish(),
	tracking_url: z.string().nullish(),
	placed_at: z.string().nullish(),
	in_progress_at: z.string().nullish(),
	packaged_at: z.string().nullish(),
	expected_shipped_at: z.string().nullish(),
	shipped_at: z.string().nullish(),
	canceled_at: z.string().nullish(),
	cancel_reason: z.string().nullish(),
	failed_at: z.string().nullish(),
	failure_reason: z.string().nullish(),
});

export const FulfillmentDeliveryDetailsSchema = z.looseObject({
	recipient: OpenObject.nullish(),
	schedule_type: z.string().nullish(),
	placed_at: z.string().nullish(),
	deliver_at: z.string().nullish(),
	prep_time_duration: z.string().nullish(),
	delivery_window_duration: z.string().nullish(),
	note: z.string().nullish(),
	completed_at: z.string().nullish(),
	in_progress_at: z.string().nullish(),
	rejected_at: z.string().nullish(),
	ready_at: z.string().nullish(),
	delivered_at: z.string().nullish(),
	canceled_at: z.string().nullish(),
	cancel_reason: z.string().nullish(),
	courier_pickup_at: z.string().nullish(),
	courier_pickup_window_duration: z.string().nullish(),
	is_no_contact_delivery: z.boolean().nullish(),
	dropoff_notes: z.string().nullish(),
	courier_provider_name: z.string().nullish(),
	courier_support_phone_number: z.string().nullish(),
	square_delivery_id: z.string().nullish(),
	external_delivery_id: z.string().nullish(),
	managed_delivery: z.boolean().nullish(),
});

export const FulfillmentInStoreDetailsSchema = z.looseObject({
	note: z.string().nullish(),
	recipient: OpenObject.nullish(),
	placed_at: z.string().nullish(),
	completed_at: z.string().nullish(),
	in_progress_at: z.string().nullish(),
	prepared_at: z.string().nullish(),
	canceled_at: z.string().nullish(),
});

export const FulfillmentSchema = z.looseObject({
	uid: z.string().nullish(),
	type: z.string().nullish(),
	state: z.string().nullish(),
	line_item_application: z.string().nullish(),
	entries: z.array(FulfillmentFulfillmentEntrySchema).nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
	pickup_details: FulfillmentPickupDetailsSchema.nullish(),
	shipment_details: FulfillmentShipmentDetailsSchema.nullish(),
	delivery_details: FulfillmentDeliveryDetailsSchema.nullish(),
	in_store_details: FulfillmentInStoreDetailsSchema.nullish(),
});

export const OrderReturnLineItemSchema = z.looseObject({
	uid: z.string().nullish(),
	source_line_item_uid: z.string().nullish(),
	name: z.string().nullish(),
	quantity: z.string().nullish(),
	quantity_unit: OrderQuantityUnitSchema.nullish(),
	note: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	variation_name: z.string().nullish(),
	item_type: z.string().nullish(),
	return_modifiers: z.array(OpenObject).nullish(),
	applied_taxes: z.array(OrderLineItemAppliedTaxSchema).nullish(),
	applied_discounts: z.array(OrderLineItemAppliedDiscountSchema).nullish(),
	base_price_money: MoneySchema.nullish(),
	variation_total_price_money: MoneySchema.nullish(),
	gross_return_money: MoneySchema.nullish(),
	total_tax_money: MoneySchema.nullish(),
	total_discount_money: MoneySchema.nullish(),
	total_money: MoneySchema.nullish(),
	applied_service_charges: z
		.array(OrderLineItemAppliedServiceChargeSchema)
		.nullish(),
	total_service_charge_money: MoneySchema.nullish(),
});

export const OrderReturnServiceChargeSchema = z.looseObject({
	uid: z.string().nullish(),
	source_service_charge_uid: z.string().nullish(),
	name: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	percentage: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	applied_money: MoneySchema.nullish(),
	total_money: MoneySchema.nullish(),
	total_tax_money: MoneySchema.nullish(),
	calculation_phase: z.string().nullish(),
	taxable: z.boolean().nullish(),
	applied_taxes: z.array(OrderLineItemAppliedTaxSchema).nullish(),
	treatment_type: z.string().nullish(),
	scope: z.string().nullish(),
	type: z.string().nullish(),
});

export const OrderReturnTaxSchema = z.looseObject({
	uid: z.string().nullish(),
	source_tax_uid: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	name: z.string().nullish(),
	type: z.string().nullish(),
	percentage: z.string().nullish(),
	applied_money: MoneySchema.nullish(),
	scope: z.string().nullish(),
});

export const OrderReturnDiscountSchema = z.looseObject({
	uid: z.string().nullish(),
	source_discount_uid: z.string().nullish(),
	catalog_object_id: z.string().nullish(),
	catalog_version: z.number().int().nullish(),
	name: z.string().nullish(),
	type: z.string().nullish(),
	percentage: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	applied_money: MoneySchema.nullish(),
	scope: z.string().nullish(),
});

export const OrderReturnTipSchema = z.looseObject({
	uid: z.string().nullish(),
	applied_money: MoneySchema.nullish(),
	source_tender_uid: z.string().nullish(),
	source_tender_id: z.string().nullish(),
});

export const OrderRoundingAdjustmentSchema = z.looseObject({
	uid: z.string().nullish(),
	name: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
});

export const OrderMoneyAmountsSchema = z.looseObject({
	total_money: MoneySchema.nullish(),
	tax_money: MoneySchema.nullish(),
	discount_money: MoneySchema.nullish(),
	tip_money: MoneySchema.nullish(),
	service_charge_money: MoneySchema.nullish(),
});

export const OrderReturnSchema = z.looseObject({
	uid: z.string().nullish(),
	source_order_id: z.string().nullish(),
	return_line_items: z.array(OrderReturnLineItemSchema).nullish(),
	return_service_charges: z.array(OrderReturnServiceChargeSchema).nullish(),
	return_taxes: z.array(OrderReturnTaxSchema).nullish(),
	return_discounts: z.array(OrderReturnDiscountSchema).nullish(),
	return_tips: z.array(OrderReturnTipSchema).nullish(),
	rounding_adjustment: OrderRoundingAdjustmentSchema.nullish(),
	return_amounts: OrderMoneyAmountsSchema.nullish(),
});

export const CardSchema = z.looseObject({
	id: z.string().nullish(),
	card_brand: z.string().nullish(),
	last_4: z.string().nullish(),
	exp_month: z.number().int().nullish(),
	exp_year: z.number().int().nullish(),
	cardholder_name: z.string().nullish(),
	billing_address: AddressSchema.nullish(),
	fingerprint: z.string().nullish(),
	customer_id: z.string().nullish(),
	merchant_id: z.string().nullish(),
	reference_id: z.string().nullish(),
	enabled: z.boolean().nullish(),
	card_type: z.string().nullish(),
	prepaid_type: z.string().nullish(),
	bin: z.string().nullish(),
	created_at: z.string().nullish(),
	disabled_at: z.string().nullish(),
	version: z.number().int().nullish(),
	card_co_brand: z.string().nullish(),
	issuer_alert: z.string().nullish(),
	issuer_alert_at: z.string().nullish(),
	hsa_fsa: z.boolean().nullish(),
});

export const TenderCardDetailsSchema = z.looseObject({
	status: z.string().nullish(),
	card: CardSchema.nullish(),
	entry_method: z.string().nullish(),
});

export const TenderCashDetailsSchema = z.looseObject({
	buyer_tendered_money: MoneySchema.nullish(),
	change_back_money: MoneySchema.nullish(),
});

export const TenderBankAccountDetailsSchema = z.looseObject({
	status: z.string().nullish(),
});

export const TenderBuyNowPayLaterDetailsSchema = z.looseObject({
	buy_now_pay_later_brand: z.string().nullish(),
	status: z.string().nullish(),
});

export const TenderSquareAccountDetailsSchema = z.looseObject({
	status: z.string().nullish(),
});

export const AdditionalRecipientSchema = z.looseObject({
	location_id: z.string().nullish(),
	description: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	receivable_id: z.string().nullish(),
});

export const TenderSchema = z.looseObject({
	id: z.string().nullish(),
	location_id: z.string().nullish(),
	transaction_id: z.string().nullish(),
	created_at: z.string().nullish(),
	note: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	tip_money: MoneySchema.nullish(),
	processing_fee_money: MoneySchema.nullish(),
	customer_id: z.string().nullish(),
	type: z.string().nullish(),
	card_details: TenderCardDetailsSchema.nullish(),
	cash_details: TenderCashDetailsSchema.nullish(),
	bank_account_details: TenderBankAccountDetailsSchema.nullish(),
	buy_now_pay_later_details: TenderBuyNowPayLaterDetailsSchema.nullish(),
	square_account_details: TenderSquareAccountDetailsSchema.nullish(),
	additional_recipients: z.array(AdditionalRecipientSchema).nullish(),
	payment_id: z.string().nullish(),
});

export const RefundSchema = z.looseObject({
	id: z.string().nullish(),
	location_id: z.string().nullish(),
	transaction_id: z.string().nullish(),
	tender_id: z.string().nullish(),
	created_at: z.string().nullish(),
	reason: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	status: z.string().nullish(),
	processing_fee_money: MoneySchema.nullish(),
	additional_recipients: z.array(AdditionalRecipientSchema).nullish(),
});

export const OrderPricingOptionsSchema = z.looseObject({
	auto_apply_discounts: z.boolean().nullish(),
	auto_apply_taxes: z.boolean().nullish(),
});

export const OrderRewardSchema = z.looseObject({
	id: z.string().nullish(),
	reward_tier_id: z.string().nullish(),
});

export const OrderSchema = z.looseObject({
	id: z.string().nullish(),
	location_id: z.string().nullish(),
	reference_id: z.string().nullish(),
	source: OrderSourceSchema.nullish(),
	customer_id: z.string().nullish(),
	line_items: z.array(OrderLineItemSchema).nullish(),
	taxes: z.array(OrderLineItemTaxSchema).nullish(),
	discounts: z.array(OrderLineItemDiscountSchema).nullish(),
	service_charges: z.array(OrderServiceChargeSchema).nullish(),
	fulfillments: z.array(FulfillmentSchema).nullish(),
	returns: z.array(OrderReturnSchema).nullish(),
	return_amounts: OrderMoneyAmountsSchema.nullish(),
	net_amounts: OrderMoneyAmountsSchema.nullish(),
	rounding_adjustment: OrderRoundingAdjustmentSchema.nullish(),
	tenders: z.array(TenderSchema).nullish(),
	refunds: z.array(RefundSchema).nullish(),
	metadata: z.record(z.string(), z.string()).nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
	closed_at: z.string().nullish(),
	state: z.string().nullish(),
	version: z.number().int().nullish(),
	total_money: MoneySchema.nullish(),
	total_tax_money: MoneySchema.nullish(),
	total_discount_money: MoneySchema.nullish(),
	total_tip_money: MoneySchema.nullish(),
	total_service_charge_money: MoneySchema.nullish(),
	ticket_name: z.string().nullish(),
	pricing_options: OrderPricingOptionsSchema.nullish(),
	rewards: z.array(OrderRewardSchema).nullish(),
	net_amount_due_money: MoneySchema.nullish(),
});

export const CalculateOrderResponseSchema = z.looseObject({
	order: OrderSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const InvoiceRecipientTaxIdsSchema = z.looseObject({
	eu_vat: z.string().nullish(),
});

export const InvoiceRecipientSchema = z.looseObject({
	customer_id: z.string().nullish(),
	given_name: z.string().nullish(),
	family_name: z.string().nullish(),
	email_address: z.string().nullish(),
	address: AddressSchema.nullish(),
	phone_number: z.string().nullish(),
	company_name: z.string().nullish(),
	tax_ids: InvoiceRecipientTaxIdsSchema.nullish(),
});

export const InvoicePaymentReminderSchema = z.looseObject({
	uid: z.string().nullish(),
	relative_scheduled_days: z.number().int().nullish(),
	message: z.string().nullish(),
	status: z.string().nullish(),
	sent_at: z.string().nullish(),
});

export const InvoicePaymentRequestSchema = z.looseObject({
	uid: z.string().nullish(),
	request_method: z.string().nullish(),
	request_type: z.string().nullish(),
	due_date: z.string().nullish(),
	fixed_amount_requested_money: MoneySchema.nullish(),
	percentage_requested: z.string().nullish(),
	tipping_enabled: z.boolean().nullish(),
	automatic_payment_source: z.string().nullish(),
	card_id: z.string().nullish(),
	reminders: z.array(InvoicePaymentReminderSchema).nullish(),
	computed_amount_money: MoneySchema.nullish(),
	total_completed_amount_money: MoneySchema.nullish(),
	rounding_adjustment_included_money: MoneySchema.nullish(),
});

export const InvoiceAcceptedPaymentMethodsSchema = z.looseObject({
	card: z.boolean().nullish(),
	square_gift_card: z.boolean().nullish(),
	bank_account: z.boolean().nullish(),
	buy_now_pay_later: z.boolean().nullish(),
	cash_app_pay: z.boolean().nullish(),
});

export const InvoiceCustomFieldSchema = z.looseObject({
	label: z.string().nullish(),
	value: z.string().nullish(),
	placement: z.string().nullish(),
});

export const InvoiceAttachmentSchema = z.looseObject({
	id: z.string().nullish(),
	filename: z.string().nullish(),
	description: z.string().nullish(),
	filesize: z.number().int().nullish(),
	hash: z.string().nullish(),
	mime_type: z.string().nullish(),
	uploaded_at: z.string().nullish(),
});

export const InvoiceSchema = z.looseObject({
	id: z.string().nullish(),
	version: z.number().int().nullish(),
	location_id: z.string().nullish(),
	order_id: z.string().nullish(),
	primary_recipient: InvoiceRecipientSchema.nullish(),
	payment_requests: z.array(InvoicePaymentRequestSchema).nullish(),
	delivery_method: z.string().nullish(),
	invoice_number: z.string().nullish(),
	title: z.string().nullish(),
	description: z.string().nullish(),
	scheduled_at: z.string().nullish(),
	public_url: z.string().nullish(),
	next_payment_amount_money: MoneySchema.nullish(),
	status: z.string().nullish(),
	timezone: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
	accepted_payment_methods: InvoiceAcceptedPaymentMethodsSchema.nullish(),
	custom_fields: z.array(InvoiceCustomFieldSchema).nullish(),
	subscription_id: z.string().nullish(),
	sale_or_service_date: z.string().nullish(),
	payment_conditions: z.string().nullish(),
	store_payment_method_enabled: z.boolean().nullish(),
	attachments: z.array(InvoiceAttachmentSchema).nullish(),
	creator_team_member_id: z.string().nullish(),
});

export const CancelInvoiceResponseSchema = z.looseObject({
	invoice: InvoiceSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const ProcessingFeeSchema = z.looseObject({
	effective_at: z.string().nullish(),
	type: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
});

export const DeviceDetailsSchema = z.looseObject({
	device_id: z.string().nullish(),
	device_installation_id: z.string().nullish(),
	device_name: z.string().nullish(),
});

export const CardPaymentTimelineSchema = z.looseObject({
	authorized_at: z.string().nullish(),
	captured_at: z.string().nullish(),
	voided_at: z.string().nullish(),
});

export const CardSurchargeDetailsSchema = z.looseObject({
	card_surcharge_money: MoneySchema.nullish(),
});

export const CardPaymentDetailsSchema = z.looseObject({
	status: z.string().nullish(),
	card: CardSchema.nullish(),
	entry_method: z.string().nullish(),
	cvv_status: z.string().nullish(),
	avs_status: z.string().nullish(),
	auth_result_code: z.string().nullish(),
	application_identifier: z.string().nullish(),
	application_name: z.string().nullish(),
	application_cryptogram: z.string().nullish(),
	verification_method: z.string().nullish(),
	verification_results: z.string().nullish(),
	statement_description: z.string().nullish(),
	device_details: DeviceDetailsSchema.nullish(),
	card_payment_timeline: CardPaymentTimelineSchema.nullish(),
	refund_requires_card_presence: z.boolean().nullish(),
	errors: z.array(ErrorSchema).nullish(),
	applied_card_surcharge_details: CardSurchargeDetailsSchema.nullish(),
	wallet_type: z.string().nullish(),
});

export const CashPaymentDetailsSchema = z.looseObject({
	buyer_supplied_money: MoneySchema.nullish(),
	change_back_money: MoneySchema.nullish(),
});

export const ACHDetailsSchema = z.looseObject({
	routing_number: z.string().nullish(),
	account_number_suffix: z.string().nullish(),
	account_type: z.string().nullish(),
});

export const BankAccountPaymentDetailsSchema = z.looseObject({
	bank_name: z.string().nullish(),
	transfer_type: z.string().nullish(),
	account_ownership_type: z.string().nullish(),
	fingerprint: z.string().nullish(),
	country: z.string().nullish(),
	statement_description: z.string().nullish(),
	ach_details: ACHDetailsSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const FelicaDetailsSchema = z.looseObject({
	terminal_id: z.string().nullish(),
	felica_masked_card_number: z.string().nullish(),
	felica_brand: z.string().nullish(),
});

export const ElectronicMoneyDetailsSchema = z.looseObject({
	felica_details: FelicaDetailsSchema.nullish(),
});

export const ExternalPaymentDetailsSchema = z.looseObject({
	type: z.string().nullish(),
	source: z.string().nullish(),
	source_id: z.string().nullish(),
	source_fee_money: MoneySchema.nullish(),
});

export const CashAppDetailsSchema = z.looseObject({
	buyer_full_name: z.string().nullish(),
	buyer_country_code: z.string().nullish(),
	buyer_cashtag: z.string().nullish(),
});

export const LightningDetailsSchema = z.looseObject({
	payment_url: z.string().nullish(),
});

export const DigitalWalletDetailsSchema = z.looseObject({
	status: z.string().nullish(),
	brand: z.string().nullish(),
	cash_app_details: CashAppDetailsSchema.nullish(),
	lightning_details: LightningDetailsSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const AfterpayDetailsSchema = z.looseObject({
	email_address: z.string().nullish(),
});

export const ClearpayDetailsSchema = z.looseObject({
	email_address: z.string().nullish(),
});

export const BuyNowPayLaterDetailsSchema = z.looseObject({
	brand: z.string().nullish(),
	afterpay_details: AfterpayDetailsSchema.nullish(),
	clearpay_details: ClearpayDetailsSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const SquareAccountDetailsSchema = z.looseObject({
	payment_source_token: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const RiskEvaluationSchema = z.looseObject({
	created_at: z.string().nullish(),
	risk_level: z.string().nullish(),
});

export const ApplicationDetailsSchema = z.looseObject({
	square_product: z.string().nullish(),
	application_id: z.string().nullish(),
});

export const OfflinePaymentDetailsSchema = z.looseObject({
	client_created_at: z.string().nullish(),
});

export const PaymentSchema = z.looseObject({
	id: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	tip_money: MoneySchema.nullish(),
	total_money: MoneySchema.nullish(),
	app_fee_money: MoneySchema.nullish(),
	app_fee_allocations: z.array(UnspecifiedObject).nullish(),
	approved_money: MoneySchema.nullish(),
	processing_fee: z.array(ProcessingFeeSchema).nullish(),
	refunded_money: MoneySchema.nullish(),
	status: z.string().nullish(),
	delay_duration: z.string().nullish(),
	delay_action: z.string().nullish(),
	delayed_until: z.string().nullish(),
	source_type: z.string().nullish(),
	card_details: CardPaymentDetailsSchema.nullish(),
	cash_details: CashPaymentDetailsSchema.nullish(),
	bank_account_details: BankAccountPaymentDetailsSchema.nullish(),
	electronic_money_details: ElectronicMoneyDetailsSchema.nullish(),
	external_details: ExternalPaymentDetailsSchema.nullish(),
	wallet_details: DigitalWalletDetailsSchema.nullish(),
	buy_now_pay_later_details: BuyNowPayLaterDetailsSchema.nullish(),
	square_account_details: SquareAccountDetailsSchema.nullish(),
	location_id: z.string().nullish(),
	order_id: z.string().nullish(),
	reference_id: z.string().nullish(),
	customer_id: z.string().nullish(),
	employee_id: z.string().nullish(),
	team_member_id: z.string().nullish(),
	refund_ids: z.array(z.string()).nullish(),
	risk_evaluation: RiskEvaluationSchema.nullish(),
	terminal_checkout_id: z.string().nullish(),
	buyer_email_address: z.string().nullish(),
	billing_address: AddressSchema.nullish(),
	shipping_address: AddressSchema.nullish(),
	note: z.string().nullish(),
	statement_description_identifier: z.string().nullish(),
	capabilities: z.array(z.string()).nullish(),
	receipt_number: z.string().nullish(),
	receipt_url: z.string().nullish(),
	device_details: DeviceDetailsSchema.nullish(),
	application_details: ApplicationDetailsSchema.nullish(),
	buyer_currency_exchange: UnspecifiedObject.nullish(),
	is_offline_payment: z.boolean().nullish(),
	offline_payment_details: OfflinePaymentDetailsSchema.nullish(),
	version_token: z.string().nullish(),
});

export const CancelPaymentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment: PaymentSchema.nullish(),
});

export const CreateCustomerResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	customer: CustomerSchema.nullish(),
});

export const BulkCreateCustomersResponseSchema = z.looseObject({
	responses: z.record(z.string(), CreateCustomerResponseSchema).nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const CreateCardResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	card: CardSchema.nullish(),
});

export const CreateCustomerCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const CustomerGroupSchema = z.looseObject({
	id: z.string().nullish(),
	name: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
});

export const CreateCustomerGroupResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	group: CustomerGroupSchema.nullish(),
});

export const DisputeEvidenceFileSchema = z.looseObject({
	filename: z.string().nullish(),
	filetype: z.string().nullish(),
});

export const DisputeEvidenceSchema = z.looseObject({
	evidence_id: z.string().nullish(),
	id: z.string().nullish(),
	dispute_id: z.string().nullish(),
	evidence_file: DisputeEvidenceFileSchema.nullish(),
	evidence_text: z.string().nullish(),
	uploaded_at: z.string().nullish(),
	evidence_type: z.string().nullish(),
});

export const CreateDisputeEvidenceFileResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	evidence: DisputeEvidenceSchema.nullish(),
});

export const CreateDisputeEvidenceTextResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	evidence: DisputeEvidenceSchema.nullish(),
});

export const CreateInvoiceAttachmentResponseSchema = z.looseObject({
	attachment: InvoiceAttachmentSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const BusinessHoursPeriodSchema = z.looseObject({
	day_of_week: z.string().nullish(),
	start_local_time: z.string().nullish(),
	end_local_time: z.string().nullish(),
});

export const BusinessHoursSchema = z.looseObject({
	periods: z.array(BusinessHoursPeriodSchema).nullish(),
});

export const CoordinatesSchema = z.looseObject({
	latitude: z.number().nullish(),
	longitude: z.number().nullish(),
});

export const TaxIdsSchema = z.looseObject({
	eu_vat: z.string().nullish(),
	fr_siret: z.string().nullish(),
	fr_naf: z.string().nullish(),
	es_nif: z.string().nullish(),
	jp_qii: z.string().nullish(),
});

export const LocationSchema = z.looseObject({
	id: z.string().nullish(),
	name: z.string().nullish(),
	address: AddressSchema.nullish(),
	timezone: z.string().nullish(),
	capabilities: z.array(z.string()).nullish(),
	status: z.string().nullish(),
	created_at: z.string().nullish(),
	merchant_id: z.string().nullish(),
	country: z.string().nullish(),
	language_code: z.string().nullish(),
	currency: z.string().nullish(),
	phone_number: z.string().nullish(),
	business_name: z.string().nullish(),
	type: z.string().nullish(),
	website_url: z.string().nullish(),
	business_hours: BusinessHoursSchema.nullish(),
	business_email: z.string().nullish(),
	description: z.string().nullish(),
	twitter_username: z.string().nullish(),
	instagram_username: z.string().nullish(),
	facebook_url: z.string().nullish(),
	coordinates: CoordinatesSchema.nullish(),
	logo_url: z.string().nullish(),
	pos_background_url: z.string().nullish(),
	mcc: z.string().nullish(),
	full_format_logo_url: z.string().nullish(),
	tax_ids: TaxIdsSchema.nullish(),
	custom_receipt_text: z.string().nullish(),
	return_policy: z.string().nullish(),
});

export const CreateLocationResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	location: LocationSchema.nullish(),
});

export const CreateLocationCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const DeleteCustomerCustomAttributeResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteCustomerCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		errors: z.array(ErrorSchema).nullish(),
	});

export const DeleteCustomerGroupResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteDisputeEvidenceResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteInvoiceResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteInvoiceAttachmentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteLocationCustomAttributeResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteLocationCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		errors: z.array(ErrorSchema).nullish(),
	});

export const BulkDeleteLocationCustomAttributesResponseLocationCustomAttributeDeleteResponseSchema =
	z.looseObject({
		location_id: z.string().nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const BulkDeleteLocationCustomAttributesResponseSchema = z.looseObject({
	values: z
		.record(
			z.string(),
			BulkDeleteLocationCustomAttributesResponseLocationCustomAttributeDeleteResponseSchema,
		)
		.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteMerchantCustomAttributeResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteMerchantCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		errors: z.array(ErrorSchema).nullish(),
	});

export const BulkDeleteMerchantCustomAttributesResponseMerchantCustomAttributeDeleteResponseSchema =
	z.looseObject({
		errors: z.array(ErrorSchema).nullish(),
	});

export const BulkDeleteMerchantCustomAttributesResponseSchema = z.looseObject({
	values: z
		.record(
			z.string(),
			BulkDeleteMerchantCustomAttributesResponseMerchantCustomAttributeDeleteResponseSchema,
		)
		.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const DeleteWebhookSubscriptionResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const BusinessAppointmentSettingsSchema = z.looseObject({
	location_types: z.array(z.string()).nullish(),
	alignment_time: z.string().nullish(),
	min_booking_lead_time_seconds: z.number().int().nullish(),
	max_booking_lead_time_seconds: z.number().int().nullish(),
	any_team_member_booking_enabled: z.boolean().nullish(),
	multiple_service_booking_enabled: z.boolean().nullish(),
	max_appointments_per_day_limit_type: z.string().nullish(),
	max_appointments_per_day_limit: z.number().int().nullish(),
	cancellation_window_seconds: z.number().int().nullish(),
	cancellation_fee_money: MoneySchema.nullish(),
	cancellation_policy: z.string().nullish(),
	cancellation_policy_text: z.string().nullish(),
	skip_booking_flow_staff_selection: z.boolean().nullish(),
});

export const BusinessBookingProfileSchema = z.looseObject({
	seller_id: z.string().nullish(),
	created_at: z.string().nullish(),
	booking_enabled: z.boolean().nullish(),
	customer_timezone_choice: z.string().nullish(),
	booking_policy: z.string().nullish(),
	allow_user_cancel: z.boolean().nullish(),
	business_appointment_settings: BusinessAppointmentSettingsSchema.nullish(),
	support_seller_level_writes: z.boolean().nullish(),
});

export const RetrieveBusinessBookingProfileResponseSchema = z.looseObject({
	business_booking_profile: BusinessBookingProfileSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const MerchantSchema = z.looseObject({
	id: z.string().nullish(),
	business_name: z.string().nullish(),
	country: z.string().nullish(),
	language_code: z.string().nullish(),
	currency: z.string().nullish(),
	status: z.string().nullish(),
	main_location_id: z.string().nullish(),
	created_at: z.string().nullish(),
});

export const RetrieveMerchantResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	merchant: MerchantSchema.nullish(),
});

export const RetrieveCustomerCustomAttributeResponseSchema = z.looseObject({
	custom_attribute: CustomAttributeSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const RetrieveCustomerCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const RetrieveDisputeEvidenceResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	evidence: DisputeEvidenceSchema.nullish(),
});

export const GetInvoiceResponseSchema = z.looseObject({
	invoice: InvoiceSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const CheckoutLocationSettingsPolicySchema = z.looseObject({
	uid: z.string().nullish(),
	title: z.string().nullish(),
	description: z.string().nullish(),
});

export const CheckoutLocationSettingsBrandingSchema = z.looseObject({
	header_type: z.string().nullish(),
	button_color: z.string().nullish(),
	button_shape: z.string().nullish(),
});

export const CheckoutLocationSettingsTippingSchema = z.looseObject({
	percentages: z.array(z.number().int()).nullish(),
	smart_tipping_enabled: z.boolean().nullish(),
	default_percent: z.number().int().nullish(),
	smart_tips: z.array(MoneySchema).nullish(),
	default_smart_tip: MoneySchema.nullish(),
});

export const CheckoutLocationSettingsCouponsSchema = z.looseObject({
	enabled: z.boolean().nullish(),
});

export const CheckoutLocationSettingsSchema = z.looseObject({
	location_id: z.string().nullish(),
	customer_notes_enabled: z.boolean().nullish(),
	policies: z.array(CheckoutLocationSettingsPolicySchema).nullish(),
	branding: CheckoutLocationSettingsBrandingSchema.nullish(),
	tipping: CheckoutLocationSettingsTippingSchema.nullish(),
	coupons: CheckoutLocationSettingsCouponsSchema.nullish(),
	updated_at: z.string().nullish(),
});

export const RetrieveLocationSettingsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	location_settings: CheckoutLocationSettingsSchema.nullish(),
});

export const ListChannelsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	channels: z.array(ChannelSchema).nullish(),
	cursor: z.string().nullish(),
});

export const ListCustomerCustomAttributeDefinitionsResponseSchema =
	z.looseObject({
		custom_attribute_definitions: z
			.array(CustomAttributeDefinitionSchema)
			.nullish(),
		cursor: z.string().nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const ListCustomerCustomAttributesResponseSchema = z.looseObject({
	custom_attributes: z.array(CustomAttributeSchema).nullish(),
	cursor: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const ListCustomerGroupsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	groups: z.array(CustomerGroupSchema).nullish(),
	cursor: z.string().nullish(),
});

export const CustomerSegmentSchema = z.looseObject({
	id: z.string().nullish(),
	name: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
});

export const ListCustomerSegmentsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	segments: z.array(CustomerSegmentSchema).nullish(),
	cursor: z.string().nullish(),
});

export const ListCustomersResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	customers: z.array(CustomerSchema).nullish(),
	cursor: z.string().nullish(),
	count: z.number().int().nullish(),
});

export const ListDisputeEvidenceResponseSchema = z.looseObject({
	evidence: z.array(DisputeEvidenceSchema).nullish(),
	errors: z.array(ErrorSchema).nullish(),
	cursor: z.string().nullish(),
});

export const ListInvoicesResponseSchema = z.looseObject({
	invoices: z.array(InvoiceSchema).nullish(),
	cursor: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const ListLocationCustomAttributeDefinitionsResponseSchema =
	z.looseObject({
		custom_attribute_definitions: z
			.array(CustomAttributeDefinitionSchema)
			.nullish(),
		cursor: z.string().nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const ListLocationsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	locations: z.array(LocationSchema).nullish(),
});

export const ListLocationCustomAttributesResponseSchema = z.looseObject({
	custom_attributes: z.array(CustomAttributeSchema).nullish(),
	cursor: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const ListMerchantCustomAttributeDefinitionsResponseSchema =
	z.looseObject({
		custom_attribute_definitions: z
			.array(CustomAttributeDefinitionSchema)
			.nullish(),
		cursor: z.string().nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const ListMerchantsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	merchant: z.array(MerchantSchema).nullish(),
	cursor: z.number().int().nullish(),
});

export const ListMerchantCustomAttributesResponseSchema = z.looseObject({
	custom_attributes: z.array(CustomAttributeSchema).nullish(),
	cursor: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const ListPaymentsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payments: z.array(PaymentSchema).nullish(),
	cursor: z.string().nullish(),
});

export const EventTypeMetadataSchema = z.looseObject({
	event_type: z.string().nullish(),
	api_version_introduced: z.string().nullish(),
	release_status: z.string().nullish(),
});

export const ListWebhookEventTypesResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	event_types: z.array(z.string()).nullish(),
	metadata: z.array(EventTypeMetadataSchema).nullish(),
});

export const WebhookSubscriptionSchema = z.looseObject({
	id: z.string().nullish(),
	name: z.string().nullish(),
	enabled: z.boolean().nullish(),
	event_types: z.array(z.string()).nullish(),
	notification_url: z.string().nullish(),
	api_version: z.string().nullish(),
	signature_key: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
});

export const ListWebhookSubscriptionsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	subscriptions: z.array(WebhookSubscriptionSchema).nullish(),
	cursor: z.string().nullish(),
});

export const RemoveGroupFromCustomerResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const RetrieveCustomerResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	customer: CustomerSchema.nullish(),
});

export const BulkRetrieveCustomersResponseSchema = z.looseObject({
	responses: z.record(z.string(), RetrieveCustomerResponseSchema).nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const RetrieveCustomerGroupResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	group: CustomerGroupSchema.nullish(),
});

export const RetrieveCustomerSegmentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	segment: CustomerSegmentSchema.nullish(),
});

export const RetrieveDisputeResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	dispute: DisputeSchema.nullish(),
});

export const RetrieveLocationResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	location: LocationSchema.nullish(),
});

export const RetrieveLocationCustomAttributeResponseSchema = z.looseObject({
	custom_attribute: CustomAttributeSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const RetrieveLocationCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const RetrieveMerchantCustomAttributeResponseSchema = z.looseObject({
	custom_attribute: CustomAttributeSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const RetrieveMerchantCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const RetrieveOrderResponseSchema = z.looseObject({
	order: OrderSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const CustomFieldSchema = z.looseObject({
	title: z.string().nullish(),
});

export const AcceptedPaymentMethodsSchema = z.looseObject({
	apple_pay: z.boolean().nullish(),
	google_pay: z.boolean().nullish(),
	cash_app_pay: z.boolean().nullish(),
	afterpay_clearpay: z.boolean().nullish(),
});

export const ShippingFeeSchema = z.looseObject({
	name: z.string().nullish(),
	charge: MoneySchema.nullish(),
});

export const CheckoutOptionsSchema = z.looseObject({
	allow_tipping: z.boolean().nullish(),
	custom_fields: z.array(CustomFieldSchema).nullish(),
	subscription_plan_id: z.string().nullish(),
	redirect_url: z.string().nullish(),
	merchant_support_email: z.string().nullish(),
	ask_for_shipping_address: z.boolean().nullish(),
	accepted_payment_methods: AcceptedPaymentMethodsSchema.nullish(),
	app_fee_money: MoneySchema.nullish(),
	shipping_fee: ShippingFeeSchema.nullish(),
	enable_coupon: z.boolean().nullish(),
	enable_loyalty: z.boolean().nullish(),
});

export const PrePopulatedDataSchema = z.looseObject({
	buyer_email: z.string().nullish(),
	buyer_phone_number: z.string().nullish(),
	buyer_address: AddressSchema.nullish(),
});

export const PaymentLinkSchema = z.looseObject({
	id: z.string().nullish(),
	version: z.number().int().nullish(),
	description: z.string().nullish(),
	order_id: z.string().nullish(),
	checkout_options: CheckoutOptionsSchema.nullish(),
	pre_populated_data: PrePopulatedDataSchema.nullish(),
	url: z.string().nullish(),
	long_url: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
	payment_note: z.string().nullish(),
});

export const RetrievePaymentLinkResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment_link: PaymentLinkSchema.nullish(),
});

export const RetrieveTokenStatusResponseSchema = z.looseObject({
	scopes: z.array(z.string()).nullish(),
	expires_at: z.string().nullish(),
	client_id: z.string().nullish(),
	merchant_id: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const RetrieveWebhookSubscriptionResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	subscription: WebhookSubscriptionSchema.nullish(),
});

export const SearchCustomersResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	customers: z.array(CustomerSchema).nullish(),
	cursor: z.string().nullish(),
	count: z.number().int().nullish(),
});

export const OrderEntrySchema = z.looseObject({
	order_id: z.string().nullish(),
	version: z.number().int().nullish(),
	location_id: z.string().nullish(),
});

export const SearchOrdersResponseSchema = z.looseObject({
	order_entries: z.array(OrderEntrySchema).nullish(),
	orders: z.array(OrderSchema).nullish(),
	cursor: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const SubmitEvidenceResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	dispute: DisputeSchema.nullish(),
});

export const SubscriptionTestResultSchema = z.looseObject({
	id: z.string().nullish(),
	status_code: z.number().int().nullish(),
	payload: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
});

export const TestWebhookSubscriptionResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	subscription_test_result: SubscriptionTestResultSchema.nullish(),
});

export const UpdateCustomerCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const UpdateCustomerGroupResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	group: CustomerGroupSchema.nullish(),
});

export const UpdateLocationResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	location: LocationSchema.nullish(),
});

export const UpdateLocationCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const UpdateMerchantCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});

export const UpdateLocationSettingsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	location_settings: CheckoutLocationSettingsSchema.nullish(),
});

export const UpdateOrderResponseSchema = z.looseObject({
	order: OrderSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const UpdateWebhookSubscriptionResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	subscription: WebhookSubscriptionSchema.nullish(),
});

export const UpdateWebhookSubscriptionSignatureKeyResponseSchema =
	z.looseObject({
		errors: z.array(ErrorSchema).nullish(),
		signature_key: z.string().nullish(),
	});

export const UpsertCustomerCustomAttributeResponseSchema = z.looseObject({
	custom_attribute: CustomAttributeSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const UpsertLocationCustomAttributeResponseSchema = z.looseObject({
	custom_attribute: CustomAttributeSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const UpsertMerchantCustomAttributeResponseSchema = z.looseObject({
	custom_attribute: CustomAttributeSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const CreatePaymentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment: PaymentSchema.nullish(),
});

export const GetPaymentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment: PaymentSchema.nullish(),
});

export const UpdatePaymentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment: PaymentSchema.nullish(),
});

export const CompletePaymentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment: PaymentSchema.nullish(),
});

export const DestinationDetailsCardRefundDetailsSchema = z.looseObject({
	card: CardSchema.nullish(),
	entry_method: z.string().nullish(),
	auth_result_code: z.string().nullish(),
});

export const DestinationDetailsCashRefundDetailsSchema = z.looseObject({
	seller_supplied_money: MoneySchema.nullish(),
	change_back_money: MoneySchema.nullish(),
});

export const DestinationDetailsExternalRefundDetailsSchema = z.looseObject({
	type: z.string().nullish(),
	source: z.string().nullish(),
	source_id: z.string().nullish(),
});

export const DestinationDetailsSchema = z.looseObject({
	card_details: DestinationDetailsCardRefundDetailsSchema.nullish(),
	cash_details: DestinationDetailsCashRefundDetailsSchema.nullish(),
	external_details: DestinationDetailsExternalRefundDetailsSchema.nullish(),
});

export const PaymentRefundSchema = z.looseObject({
	id: z.string().nullish(),
	status: z.string().nullish(),
	location_id: z.string().nullish(),
	unlinked: z.boolean().nullish(),
	destination_type: z.string().nullish(),
	destination_details: DestinationDetailsSchema.nullish(),
	amount_money: MoneySchema.nullish(),
	app_fee_money: MoneySchema.nullish(),
	app_fee_allocations: z.array(UnspecifiedObject).nullish(),
	processing_fee: z.array(ProcessingFeeSchema).nullish(),
	payment_id: z.string().nullish(),
	order_id: z.string().nullish(),
	reason: z.string().nullish(),
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
	team_member_id: z.string().nullish(),
	terminal_refund_id: z.string().nullish(),
});

export const RefundPaymentResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	refund: PaymentRefundSchema.nullish(),
});

export const GetPaymentRefundResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	refund: PaymentRefundSchema.nullish(),
});

export const ListPaymentRefundsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	refunds: z.array(PaymentRefundSchema).nullish(),
	cursor: z.string().nullish(),
});

export const CreateOrderResponseSchema = z.looseObject({
	order: OrderSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const PayOrderResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	order: OrderSchema.nullish(),
});

export const CatalogCustomAttributeValueSchema = z.looseObject({
	name: z.string().nullish(),
	string_value: z.string().nullish(),
	custom_attribute_definition_id: z.string().nullish(),
	type: z.string().nullish(),
	number_value: z.string().nullish(),
	boolean_value: z.boolean().nullish(),
	selection_uid_values: z.array(z.string()).nullish(),
	key: z.string().nullish(),
});

export const CatalogV1IdSchema = z.looseObject({
	catalog_v1_id: z.string().nullish(),
	location_id: z.string().nullish(),
});

export const CatalogItemModifierListInfoSchema = z.looseObject({
	modifier_list_id: z.string().nullish(),
	modifier_overrides: z.array(OpenObject).nullish(),
	min_selected_modifiers: z.number().int().nullish(),
	max_selected_modifiers: z.number().int().nullish(),
	enabled: z.boolean().nullish(),
	ordinal: z.number().int().nullish(),
	allow_quantities: z.string().nullish(),
	is_conversational: z.string().nullish(),
	hidden_from_customer_override: z.string().nullish(),
});

export const CatalogItemOptionForItemSchema = z.looseObject({
	item_option_id: z.string().nullish(),
});

export const CatalogObjectCategorySchema = z.looseObject({
	id: z.string().nullish(),
	ordinal: z.number().int().nullish(),
});

export const CatalogEcomSeoDataSchema = z.looseObject({
	page_title: z.string().nullish(),
	page_description: z.string().nullish(),
	permalink: z.string().nullish(),
});

export const CatalogItemFoodAndBeverageDetailsSchema = z.looseObject({
	calorie_count: z.number().int().nullish(),
	dietary_preferences: z.array(OpenObject).nullish(),
	ingredients: z.array(OpenObject).nullish(),
});

export const CatalogItemSchema = z.looseObject({
	name: z.string().nullish(),
	description: z.string().nullish(),
	abbreviation: z.string().nullish(),
	label_color: z.string().nullish(),
	is_taxable: z.boolean().nullish(),
	category_id: z.string().nullish(),
	buyer_facing_name: z.string().nullish(),
	tax_ids: z.array(z.string()).nullish(),
	modifier_list_info: z.array(CatalogItemModifierListInfoSchema).nullish(),
	variations: z.array(OpenObject).nullish(),
	product_type: z.string().nullish(),
	skip_modifier_screen: z.boolean().nullish(),
	item_options: z.array(CatalogItemOptionForItemSchema).nullish(),
	ecom_uri: z.string().nullish(),
	ecom_image_uris: z.array(z.string()).nullish(),
	image_ids: z.array(z.string()).nullish(),
	sort_name: z.string().nullish(),
	categories: z.array(CatalogObjectCategorySchema).nullish(),
	description_html: z.string().nullish(),
	description_plaintext: z.string().nullish(),
	kitchen_name: z.string().nullish(),
	channels: z.array(z.string()).nullish(),
	is_archived: z.boolean().nullish(),
	ecom_seo_data: CatalogEcomSeoDataSchema.nullish(),
	food_and_beverage_details: CatalogItemFoodAndBeverageDetailsSchema.nullish(),
	reporting_category: CatalogObjectCategorySchema.nullish(),
	is_alcoholic: z.boolean().nullish(),
});

export const CategoryPathToRootNodeSchema = z.looseObject({
	category_id: z.string().nullish(),
	category_name: z.string().nullish(),
});

export const CatalogCategorySchema = z.looseObject({
	name: z.string().nullish(),
	image_ids: z.array(z.string()).nullish(),
	category_type: z.string().nullish(),
	parent_category: CatalogObjectCategorySchema.nullish(),
	is_top_level: z.boolean().nullish(),
	channels: z.array(z.string()).nullish(),
	availability_period_ids: z.array(z.string()).nullish(),
	online_visibility: z.boolean().nullish(),
	root_category: z.string().nullish(),
	ecom_seo_data: CatalogEcomSeoDataSchema.nullish(),
	path_to_root: z.array(CategoryPathToRootNodeSchema).nullish(),
});

export const ItemVariationLocationOverridesSchema = z.looseObject({
	location_id: z.string().nullish(),
	price_money: MoneySchema.nullish(),
	pricing_type: z.string().nullish(),
	track_inventory: z.boolean().nullish(),
	inventory_alert_type: z.string().nullish(),
	inventory_alert_threshold: z.number().int().nullish(),
	sold_out: z.boolean().nullish(),
	sold_out_valid_until: z.string().nullish(),
});

export const CatalogItemOptionValueForItemVariationSchema = z.looseObject({
	item_option_id: z.string().nullish(),
	item_option_value_id: z.string().nullish(),
});

export const CatalogStockConversionSchema = z.looseObject({
	stockable_item_variation_id: z.string().nullish(),
	stockable_quantity: z.string().nullish(),
	nonstockable_quantity: z.string().nullish(),
});

export const CatalogItemVariationVendorInformationSchema = z.looseObject({
	vendor_id: z.string().nullish(),
	vendor_code: z.string().nullish(),
	unit_cost_money: MoneySchema.nullish(),
});

export const CatalogItemVariationSchema = z.looseObject({
	item_id: z.string().nullish(),
	name: z.string().nullish(),
	sku: z.string().nullish(),
	upc: z.string().nullish(),
	ordinal: z.number().int().nullish(),
	pricing_type: z.string().nullish(),
	price_money: MoneySchema.nullish(),
	location_overrides: z.array(ItemVariationLocationOverridesSchema).nullish(),
	track_inventory: z.boolean().nullish(),
	inventory_alert_type: z.string().nullish(),
	inventory_alert_threshold: z.number().int().nullish(),
	user_data: z.string().nullish(),
	service_duration: z.number().int().nullish(),
	available_for_booking: z.boolean().nullish(),
	item_option_values: z
		.array(CatalogItemOptionValueForItemVariationSchema)
		.nullish(),
	measurement_unit_id: z.string().nullish(),
	sellable: z.boolean().nullish(),
	stockable: z.boolean().nullish(),
	image_ids: z.array(z.string()).nullish(),
	team_member_ids: z.array(z.string()).nullish(),
	stockable_conversion: CatalogStockConversionSchema.nullish(),
	kitchen_name: z.string().nullish(),
	vendor_information: z
		.array(CatalogItemVariationVendorInformationSchema)
		.nullish(),
});

export const CatalogTaxSchema = z.looseObject({
	name: z.string().nullish(),
	calculation_phase: z.string().nullish(),
	inclusion_type: z.string().nullish(),
	percentage: z.string().nullish(),
	applies_to_custom_amounts: z.boolean().nullish(),
	enabled: z.boolean().nullish(),
	applies_to_product_set_id: z.string().nullish(),
});

export const CatalogDiscountSchema = z.looseObject({
	name: z.string().nullish(),
	discount_type: z.string().nullish(),
	percentage: z.string().nullish(),
	amount_money: MoneySchema.nullish(),
	pin_required: z.boolean().nullish(),
	label_color: z.string().nullish(),
	modify_tax_basis: z.string().nullish(),
	maximum_amount_money: MoneySchema.nullish(),
});

export const CatalogModifierListSchema = z.looseObject({
	name: z.string().nullish(),
	ordinal: z.number().int().nullish(),
	selection_type: z.string().nullish(),
	modifiers: z.array(OpenObject).nullish(),
	image_ids: z.array(z.string()).nullish(),
	allow_quantities: z.boolean().nullish(),
	is_conversational: z.boolean().nullish(),
	modifier_type: z.string().nullish(),
	max_length: z.number().int().nullish(),
	text_required: z.boolean().nullish(),
	internal_name: z.string().nullish(),
	min_selected_modifiers: z.number().int().nullish(),
	max_selected_modifiers: z.number().int().nullish(),
	hidden_from_customer: z.boolean().nullish(),
});

export const ModifierLocationOverridesSchema = z.looseObject({
	location_id: z.string().nullish(),
	price_money: MoneySchema.nullish(),
	sold_out: z.boolean().nullish(),
});

export const CatalogModifierSchema = z.looseObject({
	name: z.string().nullish(),
	price_money: MoneySchema.nullish(),
	on_by_default: z.boolean().nullish(),
	ordinal: z.number().int().nullish(),
	modifier_list_id: z.string().nullish(),
	location_overrides: z.array(ModifierLocationOverridesSchema).nullish(),
	kitchen_name: z.string().nullish(),
	image_id: z.string().nullish(),
	hidden_online: z.boolean().nullish(),
	child_modifier_list_ids: z.array(z.string()).nullish(),
});

export const CatalogTimePeriodSchema = z.looseObject({
	event: z.string().nullish(),
});

export const CatalogProductSetSchema = z.looseObject({
	name: z.string().nullish(),
	product_ids_any: z.array(z.string()).nullish(),
	product_ids_all: z.array(z.string()).nullish(),
	quantity_exact: z.number().int().nullish(),
	quantity_min: z.number().int().nullish(),
	quantity_max: z.number().int().nullish(),
	all_products: z.boolean().nullish(),
});

export const CatalogPricingRuleSchema = z.looseObject({
	name: z.string().nullish(),
	time_period_ids: z.array(z.string()).nullish(),
	discount_id: z.string().nullish(),
	match_products_id: z.string().nullish(),
	apply_products_id: z.string().nullish(),
	exclude_products_id: z.string().nullish(),
	valid_from_date: z.string().nullish(),
	valid_from_local_time: z.string().nullish(),
	valid_until_date: z.string().nullish(),
	valid_until_local_time: z.string().nullish(),
	exclude_strategy: z.string().nullish(),
	minimum_order_subtotal_money: MoneySchema.nullish(),
	customer_group_ids_any: z.array(z.string()).nullish(),
});

export const CatalogImageSchema = z.looseObject({
	name: z.string().nullish(),
	url: z.string().nullish(),
	caption: z.string().nullish(),
	photo_studio_order_id: z.string().nullish(),
});

export const CatalogMeasurementUnitSchema = z.looseObject({
	measurement_unit: MeasurementUnitSchema.nullish(),
	precision: z.number().int().nullish(),
});

export const SubscriptionPhaseSchema = z.looseObject({
	uid: z.string().nullish(),
	cadence: z.string().nullish(),
	periods: z.number().int().nullish(),
	recurring_price_money: MoneySchema.nullish(),
	ordinal: z.number().int().nullish(),
	pricing: OpenObject.nullish(),
});

export const CatalogSubscriptionPlanSchema = z.looseObject({
	name: z.string().nullish(),
	phases: z.array(SubscriptionPhaseSchema).nullish(),
	subscription_plan_variations: z.array(OpenObject).nullish(),
	eligible_item_ids: z.array(z.string()).nullish(),
	eligible_category_ids: z.array(z.string()).nullish(),
	all_items: z.boolean().nullish(),
});

export const CatalogItemOptionSchema = z.looseObject({
	name: z.string().nullish(),
	display_name: z.string().nullish(),
	description: z.string().nullish(),
	show_colors: z.boolean().nullish(),
	values: z.array(OpenObject).nullish(),
});

export const CatalogItemOptionValueSchema = z.looseObject({
	item_option_id: z.string().nullish(),
	name: z.string().nullish(),
	description: z.string().nullish(),
	color: z.string().nullish(),
	ordinal: z.number().int().nullish(),
});

export const SourceApplicationSchema = z.looseObject({
	product: z.string().nullish(),
	application_id: z.string().nullish(),
	name: z.string().nullish(),
});

export const CatalogCustomAttributeDefinitionStringConfigSchema = z.looseObject(
	{
		enforce_uniqueness: z.boolean().nullish(),
	},
);

export const CatalogCustomAttributeDefinitionNumberConfigSchema = z.looseObject(
	{
		precision: z.number().int().nullish(),
	},
);

export const CatalogCustomAttributeDefinitionSelectionConfigSchema =
	z.looseObject({
		max_allowed_selections: z.number().int().nullish(),
		allowed_selections: z.array(OpenObject).nullish(),
	});

export const CatalogCustomAttributeDefinitionSchema = z.looseObject({
	type: z.string().nullish(),
	name: z.string().nullish(),
	description: z.string().nullish(),
	source_application: SourceApplicationSchema.nullish(),
	allowed_object_types: z.array(z.string()).nullish(),
	seller_visibility: z.string().nullish(),
	app_visibility: z.string().nullish(),
	string_config: CatalogCustomAttributeDefinitionStringConfigSchema.nullish(),
	number_config: CatalogCustomAttributeDefinitionNumberConfigSchema.nullish(),
	selection_config:
		CatalogCustomAttributeDefinitionSelectionConfigSchema.nullish(),
	custom_attribute_usage_count: z.number().int().nullish(),
	key: z.string().nullish(),
});

export const CatalogQuickAmountSchema = z.looseObject({
	type: z.string().nullish(),
	amount: MoneySchema.nullish(),
	score: z.number().int().nullish(),
	ordinal: z.number().int().nullish(),
});

export const CatalogQuickAmountsSettingsSchema = z.looseObject({
	option: z.string().nullish(),
	eligible_for_auto_amounts: z.boolean().nullish(),
	amounts: z.array(CatalogQuickAmountSchema).nullish(),
});

export const CatalogSubscriptionPlanVariationSchema = z.looseObject({
	name: z.string().nullish(),
	phases: z.array(SubscriptionPhaseSchema).nullish(),
	subscription_plan_id: z.string().nullish(),
	monthly_billing_anchor_date: z.number().int().nullish(),
	can_prorate: z.boolean().nullish(),
	successor_plan_variation_id: z.string().nullish(),
});

export const CatalogAvailabilityPeriodSchema = z.looseObject({
	start_local_time: z.string().nullish(),
	end_local_time: z.string().nullish(),
	day_of_week: z.string().nullish(),
});

export const CatalogObjectSchema = z.looseObject({
	type: z.string().nullish(),
	id: z.string().nullish(),
	updated_at: z.string().nullish(),
	version: z.number().int().nullish(),
	is_deleted: z.boolean().nullish(),
	custom_attribute_values: z
		.record(z.string(), CatalogCustomAttributeValueSchema)
		.nullish(),
	catalog_v1_ids: z.array(CatalogV1IdSchema).nullish(),
	present_at_all_locations: z.boolean().nullish(),
	present_at_location_ids: z.array(z.string()).nullish(),
	absent_at_location_ids: z.array(z.string()).nullish(),
	item_data: CatalogItemSchema.nullish(),
	category_data: CatalogCategorySchema.nullish(),
	item_variation_data: CatalogItemVariationSchema.nullish(),
	tax_data: CatalogTaxSchema.nullish(),
	discount_data: CatalogDiscountSchema.nullish(),
	modifier_list_data: CatalogModifierListSchema.nullish(),
	modifier_data: CatalogModifierSchema.nullish(),
	time_period_data: CatalogTimePeriodSchema.nullish(),
	product_set_data: CatalogProductSetSchema.nullish(),
	pricing_rule_data: CatalogPricingRuleSchema.nullish(),
	image_data: CatalogImageSchema.nullish(),
	measurement_unit_data: CatalogMeasurementUnitSchema.nullish(),
	subscription_plan_data: CatalogSubscriptionPlanSchema.nullish(),
	item_option_data: CatalogItemOptionSchema.nullish(),
	item_option_value_data: CatalogItemOptionValueSchema.nullish(),
	custom_attribute_definition_data:
		CatalogCustomAttributeDefinitionSchema.nullish(),
	quick_amounts_settings_data: CatalogQuickAmountsSettingsSchema.nullish(),
	subscription_plan_variation_data:
		CatalogSubscriptionPlanVariationSchema.nullish(),
	availability_period_data: CatalogAvailabilityPeriodSchema.nullish(),
});

export const PaymentLinkRelatedResourcesSchema = z.looseObject({
	orders: z.array(OrderSchema).nullish(),
	subscription_plans: z.array(CatalogObjectSchema).nullish(),
});

export const CreatePaymentLinkResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment_link: PaymentLinkSchema.nullish(),
	related_resources: PaymentLinkRelatedResourcesSchema.nullish(),
});

export const ListPaymentLinksResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment_links: z.array(PaymentLinkSchema).nullish(),
	cursor: z.string().nullish(),
});

export const DeletePaymentLinkResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	id: z.string().nullish(),
	cancelled_order_id: z.string().nullish(),
});

export const CreateInvoiceResponseSchema = z.looseObject({
	invoice: InvoiceSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const PublishInvoiceResponseSchema = z.looseObject({
	invoice: InvoiceSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const UpdateInvoiceResponseSchema = z.looseObject({
	invoice: InvoiceSchema.nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const SearchInvoicesResponseSchema = z.looseObject({
	invoices: z.array(InvoiceSchema).nullish(),
	cursor: z.string().nullish(),
	errors: z.array(ErrorSchema).nullish(),
});

export const ListDisputesResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	disputes: z.array(DisputeSchema).nullish(),
	cursor: z.string().nullish(),
});

export const ListCardsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	cards: z.array(CardSchema).nullish(),
	cursor: z.string().nullish(),
});

export const RetrieveCardResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	card: CardSchema.nullish(),
});

export const DisableCardResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	card: CardSchema.nullish(),
});

export const CreateWebhookSubscriptionResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	subscription: WebhookSubscriptionSchema.nullish(),
});

export const ListCatalogResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	cursor: z.string().nullish(),
	objects: z.array(CatalogObjectSchema).nullish(),
});

export const IncludedResourcesSchema = z.looseObject({
	nested_modifiers: z.array(CatalogObjectSchema).nullish(),
	ancestor_modifiers: z.array(CatalogObjectSchema).nullish(),
});

export const SearchCatalogObjectsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	cursor: z.string().nullish(),
	objects: z.array(CatalogObjectSchema).nullish(),
	related_objects: z.array(CatalogObjectSchema).nullish(),
	latest_time: z.string().nullish(),
	included_resources: IncludedResourcesSchema.nullish(),
});

export const RetrieveCatalogObjectResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	object: CatalogObjectSchema.nullish(),
	related_objects: z.array(CatalogObjectSchema).nullish(),
});

export const CatalogIdMappingSchema = z.looseObject({
	client_object_id: z.string().nullish(),
	object_id: z.string().nullish(),
});

export const UpsertCatalogObjectResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	catalog_object: CatalogObjectSchema.nullish(),
	id_mappings: z.array(CatalogIdMappingSchema).nullish(),
});

export const DeleteCatalogObjectResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	deleted_object_ids: z.array(z.string()).nullish(),
	deleted_at: z.string().nullish(),
});

export const InventoryCountSchema = z.looseObject({
	catalog_object_id: z.string().nullish(),
	catalog_object_type: z.string().nullish(),
	state: z.string().nullish(),
	location_id: z.string().nullish(),
	quantity: z.string().nullish(),
	calculated_at: z.string().nullish(),
	is_estimated: z.boolean().nullish(),
});

export const BatchRetrieveInventoryCountsResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	counts: z.array(InventoryCountSchema).nullish(),
	cursor: z.string().nullish(),
});

export const RetrieveInventoryCountResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	counts: z.array(InventoryCountSchema).nullish(),
	cursor: z.string().nullish(),
});

export const CancelPaymentByIdempotencyKeyResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
});

export const UpdatePaymentLinkResponseSchema = z.looseObject({
	errors: z.array(ErrorSchema).nullish(),
	payment_link: PaymentLinkSchema.nullish(),
});

export const CreateMerchantCustomAttributeDefinitionResponseSchema =
	z.looseObject({
		custom_attribute_definition: CustomAttributeDefinitionSchema.nullish(),
		errors: z.array(ErrorSchema).nullish(),
	});
