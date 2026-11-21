import { z } from 'zod';

// Schemas are registered by defineMailerLiteOperation as each endpoint module
// initializes; z.ZodType uses its default unknown boundary for this heterogeneous
// registry because individual operation inputs and outputs have distinct shapes.
export const MailerLiteEndpointInputSchemas: Record<string, z.ZodType> = {};
export const MailerLiteEndpointOutputSchemas: Record<string, z.ZodType> = {};

export function registerMailerLiteEndpointSchemas<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
>(operation: string, input: InputSchema, output: OutputSchema): void {
	MailerLiteEndpointInputSchemas[operation] = input;
	MailerLiteEndpointOutputSchemas[operation] = output;
}

export const MailerLiteIdSchema = z.union([
	z.string().min(1),
	z.number().int().positive(),
]);
export const MailerLiteFieldsSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

export type MailerLiteJsonValue =
	| string
	| number
	| boolean
	| null
	| MailerLiteJsonValue[]
	| { [key: string]: MailerLiteJsonValue };
export const MailerLiteJsonValueSchema: z.ZodType<MailerLiteJsonValue> = z.lazy(
	() =>
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.null(),
			z.array(MailerLiteJsonValueSchema),
			z.record(z.string(), MailerLiteJsonValueSchema),
		]),
);
export const MailerLiteJsonObjectSchema = z.record(
	z.string(),
	MailerLiteJsonValueSchema,
);
export const MailerLiteJsonArraySchema = z.array(MailerLiteJsonValueSchema);

// MailerLite's resource objects have documented resource-specific fields, but
// several fields are plan-, status- or include-dependent. Require the stable
// documented identifier and preserve the provider's additional response data.
export const MailerLiteEntitySchema = z
	.object({ id: MailerLiteIdSchema })
	.passthrough();

const PaginationLinksSchema = z
	.object({
		first: z.string().nullable().optional(),
		last: z.string().nullable().optional(),
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
	})
	.passthrough();

const PaginationMetaSchema = z
	.object({
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number().optional(),
		next_cursor: z.string().nullable().optional(),
		prev_cursor: z.string().nullable().optional(),
	})
	.passthrough();

export const MailerLiteEntityResponseSchema = z
	.object({ data: MailerLiteEntitySchema })
	.passthrough();

export const MailerLiteListResponseSchema = z
	.object({
		data: z.array(MailerLiteEntitySchema),
		links: PaginationLinksSchema.optional(),
		meta: PaginationMetaSchema.optional(),
	})
	.passthrough();

const OptionalString = z.string().nullable().optional();
const OptionalNumber = z.number().nullable().optional();
const OptionalBoolean = z.boolean().nullable().optional();
const OptionalDateTime = z.string().nullable().optional();
const MetricSchema = z
	.object({ float: z.number().optional(), string: z.string() })
	.passthrough();
const OptionalMetric = z
	.union([z.number(), MetricSchema])
	.nullable()
	.optional();

function entityResponseSchema<Entity extends z.ZodType>(entity: Entity) {
	return z.object({ data: entity }).passthrough();
}

function entityListResponseSchema<Entity extends z.ZodType>(entity: Entity) {
	return MailerLiteListResponseSchema.extend({ data: z.array(entity) });
}

const MailerLiteGroupEntitySchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	active_count: OptionalNumber,
	sent_count: OptionalNumber,
	opens_count: OptionalNumber,
	clicks_count: OptionalNumber,
	open_rate: OptionalMetric,
	click_rate: OptionalMetric,
	total: OptionalNumber,
	unsubscribed_count: OptionalNumber,
	unconfirmed_count: OptionalNumber,
	bounced_count: OptionalNumber,
	junk_count: OptionalNumber,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();

export const MailerLiteSubscriberSchema = MailerLiteEntitySchema.extend({
	email: z.string().email().optional(),
	status: z
		.enum(['active', 'unsubscribed', 'unconfirmed', 'bounced', 'junk'])
		.optional(),
	source: OptionalString,
	sent: OptionalNumber,
	opens_count: OptionalNumber,
	clicks_count: OptionalNumber,
	open_rate: OptionalNumber,
	click_rate: OptionalNumber,
	ip_address: OptionalString,
	subscribed_at: OptionalDateTime,
	unsubscribed_at: OptionalDateTime,
	opted_in_at: OptionalDateTime,
	optin_ip: OptionalString,
	deleted_at: OptionalDateTime,
	forget_at: OptionalDateTime,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
	fields: MailerLiteFieldsSchema.optional(),
	groups: z.array(MailerLiteGroupEntitySchema).nullable().optional(),
}).passthrough();
export const MailerLiteSubscriberResponseSchema = entityResponseSchema(
	MailerLiteSubscriberSchema,
);
export const MailerLiteSubscriberListResponseSchema = entityListResponseSchema(
	MailerLiteSubscriberSchema,
);

export const MailerLiteGroupResponseSchema = entityResponseSchema(
	MailerLiteGroupEntitySchema,
);
export const MailerLiteGroupListResponseSchema = entityListResponseSchema(
	MailerLiteGroupEntitySchema,
);

export const MailerLiteFieldSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	key: OptionalString,
	type: z.enum(['text', 'number', 'date']).nullable().optional(),
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteFieldResponseSchema = entityResponseSchema(
	MailerLiteFieldSchema,
);
export const MailerLiteFieldListResponseSchema = entityListResponseSchema(
	MailerLiteFieldSchema,
);

export const MailerLiteSegmentSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	total: OptionalNumber,
	open_rate: OptionalMetric,
	click_rate: OptionalMetric,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteSegmentResponseSchema = entityResponseSchema(
	MailerLiteSegmentSchema,
);
export const MailerLiteSegmentListResponseSchema = entityListResponseSchema(
	MailerLiteSegmentSchema,
);

export const MailerLiteCampaignSchema = MailerLiteEntitySchema.extend({
	account_id: MailerLiteIdSchema.nullable().optional(),
	name: OptionalString,
	type: OptionalString,
	status: OptionalString,
	missing_data: z.array(z.string()).nullable().optional(),
	settings: z
		.object({
			track_opens: OptionalBoolean,
			use_google_analytics: OptionalBoolean,
			ecommerce_tracking: OptionalBoolean,
		})
		.passthrough()
		.nullable()
		.optional(),
	delivery_schedule: OptionalString,
	language_id: MailerLiteIdSchema.nullable().optional(),
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
	scheduled_for: OptionalDateTime,
	queued_at: OptionalDateTime,
	started_at: OptionalDateTime,
	scheduled_at: OptionalDateTime,
	stopped_at: OptionalDateTime,
	finished_at: OptionalDateTime,
	default_email_id: MailerLiteIdSchema.nullable().optional(),
	emails: z
		.array(
			z
				.object({
					id: MailerLiteIdSchema.optional(),
					account_id: MailerLiteIdSchema.optional(),
					emailable_id: MailerLiteIdSchema.optional(),
					emailable_type: OptionalString,
					type: OptionalString,
					name: OptionalString,
					subject: OptionalString,
					from_name: OptionalString,
					from: OptionalString,
					reply_to: OptionalString,
					content: OptionalString,
					plain_text: OptionalString,
					screenshot_url: OptionalString,
					preview_url: OptionalString,
					created_at: OptionalDateTime,
					updated_at: OptionalDateTime,
					is_designed: OptionalBoolean,
					language_id: MailerLiteIdSchema.nullable().optional(),
					is_winner: OptionalBoolean,
					stats: z.record(z.string(), MailerLiteJsonValueSchema).optional(),
					send_after: OptionalDateTime,
					track_opens: OptionalBoolean,
				})
				.passthrough(),
		)
		.nullable()
		.optional(),
	groups: z.array(MailerLiteIdSchema).nullable().optional(),
	segments: z.array(MailerLiteIdSchema).nullable().optional(),
	stats: z
		.object({
			sent: OptionalNumber,
			opens_count: OptionalNumber,
			unique_opens_count: OptionalNumber,
			open_rate: OptionalMetric,
			clicks_count: OptionalNumber,
			unique_clicks_count: OptionalNumber,
			click_rate: OptionalMetric,
			unsubscribes_count: OptionalNumber,
			unsubscribe_rate: OptionalMetric,
			spam_count: OptionalNumber,
			spam_rate: OptionalMetric,
			hard_bounces_count: OptionalNumber,
			hard_bounce_rate: OptionalMetric,
			soft_bounces_count: OptionalNumber,
			soft_bounce_rate: OptionalMetric,
			forwards_count: OptionalNumber,
			forward_rate: OptionalMetric,
			click_to_open_rate: OptionalMetric,
		})
		.passthrough()
		.nullable()
		.optional(),
	is_stopped: OptionalBoolean,
	has_winner: z.boolean().nullable().optional(),
	uses_ecommerce: OptionalBoolean,
	uses_survey: OptionalBoolean,
	can_be_scheduled: OptionalBoolean,
	warnings: z.array(z.string()).nullable().optional(),
	initial_created_at: OptionalDateTime,
	is_currently_sending_out: OptionalBoolean,
}).passthrough();
export const MailerLiteCampaignResponseSchema = entityResponseSchema(
	MailerLiteCampaignSchema,
);
export const MailerLiteCampaignListResponseSchema = entityListResponseSchema(
	MailerLiteCampaignSchema,
);

export const MailerLiteFormSchema = MailerLiteEntitySchema.extend({
	slug: OptionalString,
	name: OptionalString,
	type: z.enum(['popup', 'embedded', 'promotion']).nullable().optional(),
	conversions_count: OptionalNumber,
	opens_count: OptionalNumber,
	visitors: OptionalNumber,
	conversion_rate: OptionalMetric,
	last_registration_at: OptionalDateTime,
	settings: z
		.union([MailerLiteJsonObjectSchema, MailerLiteJsonArraySchema])
		.nullable()
		.optional(),
	active: OptionalBoolean,
	is_broken: OptionalBoolean,
	has_content: OptionalBoolean,
	can: z.object({ update: z.boolean().optional() }).passthrough().optional(),
	used_in_automations: OptionalBoolean,
	warnings: z.array(z.string()).nullable().optional(),
	double_optin: OptionalBoolean,
	screenshot_url: OptionalString,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteFormResponseSchema =
	entityResponseSchema(MailerLiteFormSchema);
export const MailerLiteFormListResponseSchema =
	entityListResponseSchema(MailerLiteFormSchema);

export const MailerLiteWebhookSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	events: z.array(z.string()).nullable().optional(),
	url: OptionalString,
	enabled: OptionalBoolean,
	batchable: OptionalBoolean,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteWebhookResponseSchema = entityResponseSchema(
	MailerLiteWebhookSchema,
);
export const MailerLiteWebhookListResponseSchema = entityListResponseSchema(
	MailerLiteWebhookSchema,
);

export const MailerLiteFileSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	type: z.enum(['image', 'pdf', 'epub']).nullable().optional(),
	url: OptionalString,
	size: OptionalNumber,
	created_at: OptionalDateTime,
}).passthrough();
export const MailerLiteFileListResponseSchema =
	entityListResponseSchema(MailerLiteFileSchema);

export const MailerLiteEmailSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	subject: OptionalString,
	from_name: OptionalString,
	from: OptionalString,
	reply_to: OptionalString,
	status: OptionalString,
	editor: OptionalString,
	plain_text: OptionalString,
	screenshot_url: OptionalString,
	preview_url: OptionalString,
	is_designed: OptionalBoolean,
	language_id: MailerLiteIdSchema.nullable().optional(),
	is_winner: OptionalBoolean,
	stats: z
		.object({
			sent: OptionalNumber,
			opens_count: OptionalNumber,
			unique_opens_count: OptionalNumber,
			open_rate: OptionalMetric,
			clicks_count: OptionalNumber,
			unique_clicks_count: OptionalNumber,
			click_rate: OptionalMetric,
			unsubscribes_count: OptionalNumber,
			unsubscribe_rate: OptionalMetric,
			spam_count: OptionalNumber,
			spam_rate: OptionalMetric,
			hard_bounces_count: OptionalNumber,
			hard_bounce_rate: OptionalMetric,
			soft_bounces_count: OptionalNumber,
			soft_bounce_rate: OptionalMetric,
			forwards_count: OptionalNumber,
			forward_rate: OptionalMetric,
			deliveries_count: OptionalNumber,
			delivery_rate: OptionalMetric,
			social_interactions_count: OptionalNumber,
			social_interaction_rate: OptionalMetric,
			click_to_open_rate: OptionalMetric,
		})
		.passthrough()
		.nullable()
		.optional(),
	send_after: OptionalDateTime,
	track_opens: OptionalBoolean,
	uses_survey: OptionalBoolean,
	uses_quiz: OptionalBoolean,
	preheader: OptionalString,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteEmailResponseSchema = entityResponseSchema(
	MailerLiteEmailSchema,
);
export const MailerLiteEmailListResponseSchema = entityListResponseSchema(
	MailerLiteEmailSchema,
);

export const MailerLiteEmailBlockSchema = MailerLiteEntitySchema.extend({
	type: OptionalString,
	editor_content: MailerLiteJsonObjectSchema.nullable().optional(),
	placement: z
		.object({
			after: MailerLiteIdSchema.nullable().optional(),
			before: MailerLiteIdSchema.nullable().optional(),
		})
		.passthrough()
		.optional(),
}).passthrough();
export const MailerLiteEmailBlockResponseSchema = z
	.object({ data: MailerLiteEmailBlockSchema, etag: z.string() })
	.passthrough();

export const MailerLiteEmailVersionSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	type: OptionalString,
	created_at: OptionalDateTime,
	current: OptionalBoolean,
}).passthrough();
export const MailerLiteEmailVersionListResponseSchema =
	entityListResponseSchema(MailerLiteEmailVersionSchema);
export const MailerLiteEmailVersionResponseSchema = entityResponseSchema(
	MailerLiteEmailVersionSchema,
);

export const MailerLiteShopSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	url: OptionalString,
	currency: OptionalString,
	platform: OptionalString,
	group_id: MailerLiteIdSchema.nullable().optional(),
	group: MailerLiteGroupEntitySchema.nullable().optional(),
	enable_popups: OptionalBoolean,
	enabled: OptionalBoolean,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteShopResponseSchema =
	entityResponseSchema(MailerLiteShopSchema);
export const MailerLiteShopListResponseSchema =
	entityListResponseSchema(MailerLiteShopSchema);

export const MailerLiteCartSchema = MailerLiteEntitySchema.extend({
	resource_id: OptionalString,
	checkout_url: OptionalString,
	cart_total: OptionalNumber,
	ecommerce_customer_id: MailerLiteIdSchema.nullable().optional(),
	items: z
		.array(
			z
				.object({
					id: MailerLiteIdSchema.optional(),
					resource_id: OptionalString,
					ecommerce_product_id: MailerLiteIdSchema.optional(),
					ecommerce_product_variant_id:
						MailerLiteIdSchema.nullable().optional(),
					variant: OptionalString,
					product: z
						.object({
							id: MailerLiteIdSchema,
							name: OptionalString,
							price: OptionalNumber,
							url: OptionalString,
							image: OptionalString,
						})
						.passthrough()
						.optional(),
					quantity: OptionalNumber,
					price: OptionalNumber,
				})
				.passthrough(),
		)
		.nullable()
		.optional(),
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteCartResponseSchema =
	entityResponseSchema(MailerLiteCartSchema);
export const MailerLiteCartListResponseSchema =
	entityListResponseSchema(MailerLiteCartSchema);

export const MailerLiteCartItemSchema = MailerLiteEntitySchema.extend({
	resource_id: OptionalString,
	ecommerce_product_id: MailerLiteIdSchema.nullable().optional(),
	ecommerce_product_variant_id: MailerLiteIdSchema.nullable().optional(),
	product: z
		.object({
			id: MailerLiteIdSchema,
			name: OptionalString,
			price: OptionalNumber,
			url: OptionalString,
			image: OptionalString,
			exclude_from_automations: OptionalBoolean,
			enabled: OptionalBoolean,
			categories: z
				.array(
					z
						.object({
							id: MailerLiteIdSchema,
							name: OptionalString,
							exclude_from_automations: OptionalBoolean,
							created_at: OptionalDateTime,
							updated_at: OptionalDateTime,
						})
						.passthrough(),
				)
				.nullable()
				.optional(),
		})
		.passthrough()
		.nullable()
		.optional(),
	variant: OptionalString,
	quantity: OptionalNumber,
	price: OptionalNumber,
}).passthrough();
export const MailerLiteCartItemResponseSchema = entityResponseSchema(
	MailerLiteCartItemSchema,
);
export const MailerLiteCartItemListResponseSchema = entityListResponseSchema(
	MailerLiteCartItemSchema,
);

export const MailerLiteCategorySchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	exclude_from_automations: OptionalBoolean,
	products_count: OptionalNumber,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteCategoryResponseSchema = entityResponseSchema(
	MailerLiteCategorySchema,
);
export const MailerLiteCategoryListResponseSchema = entityListResponseSchema(
	MailerLiteCategorySchema,
);

export const MailerLiteCustomerSchema = MailerLiteEntitySchema.extend({
	email: z.string().email().nullable().optional(),
	resource_id: OptionalString,
	accepts_marketing: OptionalBoolean,
	total_spent: OptionalNumber,
	orders_count: OptionalNumber,
	name: OptionalString,
	last_name: OptionalString,
	subscriber: MailerLiteSubscriberSchema.nullable().optional(),
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteCustomerResponseSchema = entityResponseSchema(
	MailerLiteCustomerSchema,
);
export const MailerLiteCustomerListResponseSchema = entityListResponseSchema(
	MailerLiteCustomerSchema,
);

export const MailerLiteOrderSchema = MailerLiteEntitySchema.extend({
	status: z.enum(['pending', 'complete']).nullable().optional(),
	total: OptionalNumber,
	total_price: OptionalNumber,
	shop: MailerLiteShopSchema.nullable().optional(),
	customer: MailerLiteCustomerSchema.nullable().optional(),
	cart: z
		.object({
			items: z
				.array(
					z
						.object({
							id: MailerLiteIdSchema.optional(),
							ecommerce_product_id: MailerLiteIdSchema.optional(),
							ecommerce_product_variant_id:
								MailerLiteIdSchema.nullable().optional(),
							product: z
								.object({
									id: MailerLiteIdSchema,
									name: OptionalString,
									price: OptionalNumber,
									url: OptionalString,
									image: OptionalString,
									exclude_from_automations: OptionalBoolean,
									enabled: OptionalBoolean,
									categories: z
										.array(MailerLiteCategorySchema)
										.nullable()
										.optional(),
								})
								.passthrough()
								.nullable()
								.optional(),
							variant: OptionalString,
							quantity: OptionalNumber,
							price: OptionalNumber,
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough()
		.nullable()
		.optional(),
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
	completed_at: OptionalDateTime,
	attribution: z
		.object({ email_id: MailerLiteIdSchema, type: z.string() })
		.nullable()
		.optional(),
}).passthrough();
export const MailerLiteOrderResponseSchema = entityResponseSchema(
	MailerLiteOrderSchema,
);
export const MailerLiteOrderListResponseSchema = entityListResponseSchema(
	MailerLiteOrderSchema,
);

export const MailerLiteProductSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	price: OptionalNumber,
	currency: OptionalString,
	exclude_from_automations: OptionalBoolean,
	enabled: OptionalBoolean,
	url: OptionalString,
	image: OptionalString,
	short_description: OptionalString,
	description: OptionalString,
	variants: z
		.array(
			z
				.object({
					id: MailerLiteIdSchema,
					name: OptionalString,
					attributes: z.record(z.string(), z.string()).nullable().optional(),
					price: OptionalNumber,
					resource_id: OptionalString,
					price_type: z.enum(['fixed', 'increment']).nullable().optional(),
					image_url: OptionalString,
				})
				.passthrough(),
		)
		.nullable()
		.optional(),
	categories: z.array(MailerLiteCategorySchema).nullable().optional(),
	currency_symbol: OptionalString,
	checkout_url: OptionalString,
	stripe_minimum: OptionalBoolean,
	has_checkout: OptionalBoolean,
	order_stats: z.record(z.string(), z.number()).nullable().optional(),
	type: z.enum(['one-time', 'subscription', 'booking']).nullable().optional(),
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
}).passthrough();
export const MailerLiteProductResponseSchema = entityResponseSchema(
	MailerLiteProductSchema,
);
export const MailerLiteProductListResponseSchema = entityListResponseSchema(
	MailerLiteProductSchema,
);

export const MailerLiteProductVariantSchema = MailerLiteEntitySchema.extend({
	ecommerce_product_id: MailerLiteIdSchema.nullable().optional(),
	name: OptionalString,
	attributes: z.record(z.string(), z.string()).nullable().optional(),
	price_type: z.enum(['fixed', 'increment']).nullable().optional(),
	price: OptionalNumber,
	resource_id: OptionalString,
	image_url: OptionalString,
}).passthrough();
export const MailerLiteProductVariantResponseSchema = entityResponseSchema(
	MailerLiteProductVariantSchema,
);
export const MailerLiteProductVariantListResponseSchema =
	entityListResponseSchema(MailerLiteProductVariantSchema);

export const MailerLiteAutomationSchema = MailerLiteEntitySchema.extend({
	name: OptionalString,
	enabled: OptionalBoolean,
	status: OptionalString,
	complete: OptionalBoolean,
	broken: OptionalBoolean,
	warnings: z.array(z.string()).nullable().optional(),
	emails_count: OptionalNumber,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
	trigger_data: MailerLiteJsonObjectSchema.nullable().optional(),
	steps: z
		.array(
			z
				.object({
					id: MailerLiteIdSchema,
					type: OptionalString,
					parent_id: MailerLiteIdSchema.nullable().optional(),
					name: OptionalString,
					subject: OptionalString,
					from: OptionalString,
					from_name: OptionalString,
					reply_to: OptionalString,
					email_id: MailerLiteIdSchema.nullable().optional(),
					email: MailerLiteEmailSchema.nullable().optional(),
					unit: OptionalString,
					value: z.union([z.string(), z.number()]).nullable().optional(),
					complete: OptionalBoolean,
					broken: OptionalBoolean,
					created_at: OptionalDateTime,
					updated_at: OptionalDateTime,
					description: OptionalString,
				})
				.passthrough(),
		)
		.nullable()
		.optional(),
	stats: z
		.object({
			completed_subscribers_count: OptionalNumber,
			subscribers_in_queue_count: OptionalNumber,
			bounce_rate: OptionalMetric,
			click_to_open_rate: OptionalMetric,
			sent: OptionalNumber,
			opens_count: OptionalNumber,
			unique_opens_count: OptionalNumber,
			open_rate: OptionalMetric,
			clicks_count: OptionalNumber,
			unique_clicks_count: OptionalNumber,
			click_rate: OptionalMetric,
			unsubscribes_count: OptionalNumber,
			unsubscribe_rate: OptionalMetric,
			spam_count: OptionalNumber,
			spam_rate: OptionalMetric,
			hard_bounces_count: OptionalNumber,
			hard_bounce_rate: OptionalMetric,
			soft_bounces_count: OptionalNumber,
			soft_bounce_rate: OptionalMetric,
			forward_rate: OptionalMetric,
			social_interactions_count: OptionalNumber,
			social_interaction_rate: OptionalMetric,
		})
		.passthrough()
		.nullable()
		.optional(),
	triggers: z
		.array(
			z
				.object({
					id: MailerLiteIdSchema,
					type: OptionalString,
					group_ids: z.array(MailerLiteIdSchema).nullable().optional(),
					exclude_group_ids: z.array(MailerLiteIdSchema).nullable().optional(),
					ecommerce_shop_id: MailerLiteIdSchema.nullable().optional(),
					ecommerce_category_id: MailerLiteIdSchema.nullable().optional(),
					ecommerce_product_id: MailerLiteIdSchema.nullable().optional(),
					broken: OptionalBoolean,
					complete: OptionalBoolean,
					data: MailerLiteJsonObjectSchema.nullable().optional(),
				})
				.passthrough(),
		)
		.nullable()
		.optional(),
}).passthrough();
export const MailerLiteAutomationResponseSchema = entityResponseSchema(
	MailerLiteAutomationSchema,
);
export const MailerLiteAutomationListResponseSchema = entityListResponseSchema(
	MailerLiteAutomationSchema,
);

export const MailerLiteAutomationStepSchema = MailerLiteEntitySchema.extend({
	parent_id: MailerLiteIdSchema.nullable().optional(),
	type: OptionalString,
	position: OptionalNumber,
	name: OptionalString,
	subject: OptionalString,
	from: OptionalString,
	from_name: OptionalString,
	reply_to: OptionalString,
	email_id: MailerLiteIdSchema.nullable().optional(),
	unit: OptionalString,
	value: z.union([z.string(), z.number()]).nullable().optional(),
	complete: OptionalBoolean,
	broken: OptionalBoolean,
	created_at: OptionalDateTime,
	updated_at: OptionalDateTime,
	description: OptionalString,
	email: MailerLiteEmailSchema.nullable().optional(),
	data: MailerLiteJsonObjectSchema.nullable().optional(),
}).passthrough();
export const MailerLiteAutomationStepResponseSchema = entityResponseSchema(
	MailerLiteAutomationStepSchema,
);
export const MailerLiteAutomationStepListResponseSchema =
	entityListResponseSchema(MailerLiteAutomationStepSchema);

export const MailerLiteAutomationTriggerSchema = MailerLiteEntitySchema.extend({
	automation_id: MailerLiteIdSchema.nullable().optional(),
	type: OptionalString,
	group_ids: z.array(MailerLiteIdSchema).nullable().optional(),
	exclude_group_ids: z.array(MailerLiteIdSchema).nullable().optional(),
	ecommerce_shop_id: MailerLiteIdSchema.nullable().optional(),
	ecommerce_category_id: MailerLiteIdSchema.nullable().optional(),
	ecommerce_product_id: MailerLiteIdSchema.nullable().optional(),
	broken: OptionalBoolean,
	complete: OptionalBoolean,
	data: MailerLiteJsonObjectSchema.nullable().optional(),
}).passthrough();
export const MailerLiteAutomationTriggerResponseSchema = entityResponseSchema(
	MailerLiteAutomationTriggerSchema,
);
export const MailerLiteAutomationTriggerListResponseSchema =
	entityListResponseSchema(MailerLiteAutomationTriggerSchema);

export const MailerLiteAutomationTemplateSchema = MailerLiteEntitySchema.extend(
	{
		name: OptionalString,
		type: OptionalString,
		category: OptionalString,
		created_at: OptionalDateTime,
	},
).passthrough();
export const MailerLiteAutomationTemplateResponseSchema = entityResponseSchema(
	MailerLiteAutomationTemplateSchema,
);
export const MailerLiteAutomationTemplateListResponseSchema =
	entityListResponseSchema(MailerLiteAutomationTemplateSchema);

export const MailerLiteCountResponseSchema = z
	.object({ total: z.number() })
	.strict();
export const MailerLiteNoContentSchema = z.undefined();

export const MailerLiteImportProgressResponseSchema = z
	.object({
		data: z
			.object({
				id: MailerLiteIdSchema,
				total: z.number(),
				processed: z.number(),
				imported: z.number(),
				updated: z.number(),
				errored: z.number(),
				percent: z.number(),
				done: z.boolean(),
			})
			.passthrough(),
	})
	.passthrough();

export const MailerLiteImportAcceptedSchema = z
	.object({ import_progress_url: z.string().url() })
	.strict();

export const MailerLitePaginationQuerySchema = z
	.object({
		limit: z.number().int().min(0).optional(),
		page: z.number().int().min(1).optional(),
		cursor: z.string().optional(),
		sort: z.string().optional(),
		include: z.string().optional(),
	})
	.strict();

export type MailerLiteResource = z.infer<typeof MailerLiteEntitySchema>;
export type MailerLiteResourceResponse = z.infer<
	typeof MailerLiteEntityResponseSchema
>;
export type MailerLiteListResponse = z.infer<
	typeof MailerLiteListResponseSchema
>;
