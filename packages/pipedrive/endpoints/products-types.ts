import { z } from 'zod';

const uniqueValues = <T>(values: T[]) => new Set(values).size === values.length;

const ProductIdInputSchema = z.object({ id: z.number().int() }).strict();
const ProductVariationIdInputSchema = z
	.object({ id: z.number().int(), product_variation_id: z.number().int() })
	.strict();

const ProductVisibilitySchema = z.union([
	z.literal(1),
	z.literal(3),
	z.literal(5),
	z.literal(7),
]);
const ProductBillingFrequencySchema = z.enum([
	'one-time',
	'annually',
	'semi-annually',
	'quarterly',
	'monthly',
	'weekly',
]);

const ProductPriceInputSchema = z
	.object({
		price: z.number(),
		currency: z.string(),
		cost: z.number().optional(),
		direct_cost: z.number().optional(),
		notes: z.string().optional(),
	})
	.strict();

// `unknown` is necessary because Pipedrive custom-field values are account-defined JSON.
const ProductCustomFieldsSchema = z.record(z.string(), z.unknown());

const ProductWriteFields = {
	code: z.string().optional(),
	description: z.string().optional(),
	unit: z.string().optional(),
	tax: z.number().optional(),
	category: z.number().optional(),
	owner_id: z.number().int().optional(),
	is_linkable: z.boolean().optional(),
	visible_to: ProductVisibilitySchema.optional(),
	prices: z.array(ProductPriceInputSchema).optional(),
	custom_fields: ProductCustomFieldsSchema.optional(),
	billing_frequency: ProductBillingFrequencySchema.optional(),
	billing_frequency_cycles: z
		.number()
		.int()
		.min(1)
		.max(208)
		.nullable()
		.optional(),
} as const;

const ProductListInputSchema = z
	.object({
		owner_id: z.number().int().optional(),
		ids: z.array(z.number().int()).max(100).refine(uniqueValues).optional(),
		custom_fields: z.array(z.string()).max(15).refine(uniqueValues).optional(),
		filter_id: z.number().int().optional(),
		cursor: z.string().optional(),
		limit: z.number().int().max(500).optional(),
		sort_by: z.enum(['id', 'name', 'add_time', 'update_time']).optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		updated_since: z.string().optional(),
	})
	.strict();

const ProductCreateInputSchema = z
	.object({ name: z.string().min(1), ...ProductWriteFields })
	.strict();
const ProductUpdateInputSchema = ProductIdInputSchema.extend({
	name: z.string().min(1).optional(),
	...ProductWriteFields,
}).strict();

const ProductSearchInputSchema = z
	.object({
		term: z.string().min(1).max(100),
		fields: z
			.array(z.enum(['code', 'custom_fields', 'name']))
			.refine(uniqueValues)
			.optional(),
		exact_match: z.boolean().optional(),
		include_fields: z
			.array(z.literal('product.price'))
			.refine(uniqueValues)
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		cursor: z.string().optional(),
	})
	.strict()
	.superRefine((input, context) => {
		if (input.term.length < 2 && input.exact_match !== true) {
			context.addIssue({
				code: 'custom',
				message:
					'term must have at least 2 characters unless exact_match is true',
				path: ['term'],
			});
		}
	});

const ProductVariationPriceInputSchema = z
	.object({
		price: z.number(),
		currency: z.string(),
		cost: z.number().optional(),
		direct_cost: z.number().optional(),
		notes: z.string().optional(),
	})
	.strict();
const ProductVariationCreateInputSchema = z
	.object({
		id: z.number().int(),
		name: z.string().max(255),
		prices: z.array(ProductVariationPriceInputSchema).optional(),
	})
	.strict();
const ProductVariationUpdateInputSchema = ProductIdInputSchema.extend({
	product_variation_id: z.number().int(),
	name: z.string().max(255).optional(),
	prices: z.array(ProductVariationPriceInputSchema).optional(),
}).strict();

const ProductImageInputSchema = ProductIdInputSchema.extend({
	// Pipedrive documents this multipart field as binary; Blob preserves binary data without string encoding.
	data: z.instanceof(Blob),
}).strict();
const ProductFollowerListInputSchema = ProductIdInputSchema.extend({
	limit: z.number().int().min(1).max(500).optional(),
	cursor: z.string().optional(),
}).strict();
const ProductFollowerCreateInputSchema = ProductIdInputSchema.extend({
	user_id: z.number().int(),
}).strict();
const ProductFollowerDeleteInputSchema = z
	.object({ id: z.number().int(), follower_id: z.number().int() })
	.strict();

// Pipedrive's OpenAPI response objects do not set additionalProperties: false, so response extensions are retained.
const ProductPriceResponseSchema = z
	.object({
		price: z.number().optional(),
		cost: z.number().optional(),
		product_id: z.number().int().nullable().optional(),
		product_variation_id: z.number().int().optional(),
		currency: z.string().nullable().optional(),
		direct_cost: z.number().nullable().optional(),
		notes: z.string().optional(),
	})
	.passthrough();

// Response custom-field values remain arbitrary account-defined JSON until runtime-checked here.
const ProductResponseSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		code: z.string().optional(),
		unit: z.string().optional(),
		tax: z.number().optional(),
		is_deleted: z.boolean().optional(),
		is_linkable: z.boolean().optional(),
		visible_to: ProductVisibilitySchema.optional(),
		owner_id: z.number().int().optional(),
		add_time: z.string().optional(),
		update_time: z.string().optional(),
		description: z.string().optional(),
		category: z.string().nullable().optional(),
		custom_fields: ProductCustomFieldsSchema.optional(),
		billing_frequency: ProductBillingFrequencySchema.optional(),
		billing_frequency_cycles: z
			.number()
			.int()
			.min(1)
			.max(208)
			.nullable()
			.optional(),
		prices: z.array(ProductPriceResponseSchema).optional(),
	})
	.passthrough();

const ProductCursorResponseSchema = z
	.object({ next_cursor: z.string().nullable().optional() })
	.passthrough();
const ProductListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(ProductResponseSchema).optional(),
		additional_data: ProductCursorResponseSchema.optional(),
	})
	.passthrough();
const ProductResponseEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: ProductResponseSchema.optional(),
	})
	.passthrough();
const ProductDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({ id: z.number().int().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const ProductSearchResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({
				items: z
					.array(
						z
							.object({
								result_score: z.number().optional(),
								item: z
									.object({
										id: z.number().int().optional(),
										type: z.string().optional(),
										name: z.string().optional(),
										code: z.string().nullable().optional(),
										visible_to: z.number().int().optional(),
										owner: z
											.object({ id: z.number().int().optional() })
											.passthrough()
											.optional(),
										custom_fields: z.array(z.string()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		additional_data: ProductCursorResponseSchema.optional(),
	})
	.passthrough();

const ProductVariationResponseSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		product_id: z.number().int().optional(),
		prices: z.array(ProductPriceResponseSchema).optional(),
	})
	.passthrough();
const ProductVariationListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(ProductVariationResponseSchema).optional(),
		additional_data: ProductCursorResponseSchema.optional(),
	})
	.passthrough();
const ProductVariationResponseEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: ProductVariationResponseSchema.optional(),
	})
	.passthrough();
const ProductVariationDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({ id: z.number().int().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const ProductImageResponseSchema = z
	.object({
		id: z.number().int().optional(),
		product_id: z.number().int().optional(),
		company_id: z.string().optional(),
		public_url: z.string().optional(),
		add_time: z.string().optional(),
		mime_type: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();
const ProductImageEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: ProductImageResponseSchema.optional(),
	})
	.passthrough();
const ProductImageDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({ id: z.number().int().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const ProductFollowerResponseSchema = z
	.object({
		user_id: z.number().int().optional(),
		add_time: z.string().optional(),
	})
	.passthrough();
const ProductFollowerListResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(ProductFollowerResponseSchema).optional(),
		additional_data: ProductCursorResponseSchema.optional(),
	})
	.passthrough();
const ProductFollowerEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		data: ProductFollowerResponseSchema.optional(),
	})
	.passthrough();
const ProductFollowerDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z
			.object({ user_id: z.number().int().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
const ProductFollowerChangelogItemSchema = z
	.object({
		action: z.string().optional(),
		actor_user_id: z.number().int().optional(),
		follower_user_id: z.number().int().optional(),
		time: z.string().optional(),
	})
	.passthrough();
const ProductFollowerChangelogResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: z.array(ProductFollowerChangelogItemSchema).optional(),
		additional_data: ProductCursorResponseSchema.optional(),
	})
	.passthrough();

export const ProductEndpointInputSchemas = {
	productList: ProductListInputSchema,
	productCreate: ProductCreateInputSchema,
	productSearch: ProductSearchInputSchema,
	productGet: ProductIdInputSchema,
	productUpdate: ProductUpdateInputSchema,
	productDelete: ProductIdInputSchema,
	productDuplicate: ProductIdInputSchema,
	productVariationList: ProductIdInputSchema.extend({
		limit: z.number().int().max(500).optional(),
		cursor: z.string().optional(),
	}).strict(),
	productVariationCreate: ProductVariationCreateInputSchema,
	productVariationUpdate: ProductVariationUpdateInputSchema,
	productVariationDelete: ProductVariationIdInputSchema,
	productImageGet: ProductIdInputSchema,
	productImageUpload: ProductImageInputSchema,
	productImageUpdate: ProductImageInputSchema,
	productImageDelete: ProductIdInputSchema,
	productFollowerList: ProductFollowerListInputSchema,
	productFollowerCreate: ProductFollowerCreateInputSchema,
	productFollowerChangelog: ProductFollowerListInputSchema,
	productFollowerDelete: ProductFollowerDeleteInputSchema,
} as const;

export const ProductEndpointOutputSchemas = {
	productList: ProductListResponseSchema,
	productCreate: ProductResponseEnvelopeSchema,
	productSearch: ProductSearchResponseSchema,
	productGet: ProductResponseEnvelopeSchema,
	productUpdate: ProductResponseEnvelopeSchema,
	productDelete: ProductDeleteResponseSchema,
	productDuplicate: ProductResponseEnvelopeSchema,
	productVariationList: ProductVariationListResponseSchema,
	productVariationCreate: ProductVariationResponseEnvelopeSchema,
	productVariationUpdate: ProductVariationResponseEnvelopeSchema,
	productVariationDelete: ProductVariationDeleteResponseSchema,
	productImageGet: ProductImageEnvelopeSchema,
	productImageUpload: ProductImageEnvelopeSchema,
	productImageUpdate: ProductImageEnvelopeSchema,
	productImageDelete: ProductImageDeleteResponseSchema,
	productFollowerList: ProductFollowerListResponseSchema,
	productFollowerCreate: ProductFollowerEnvelopeSchema,
	productFollowerChangelog: ProductFollowerChangelogResponseSchema,
	productFollowerDelete: ProductFollowerDeleteResponseSchema,
} as const;

export type ProductEndpointInputs = {
	[K in keyof typeof ProductEndpointInputSchemas]: z.infer<
		(typeof ProductEndpointInputSchemas)[K]
	>;
};
export type ProductEndpointOutputs = {
	[K in keyof typeof ProductEndpointOutputSchemas]: z.infer<
		(typeof ProductEndpointOutputSchemas)[K]
	>;
};
