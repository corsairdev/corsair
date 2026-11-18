import { z } from 'zod';

// ── Shared ──────────────────────────────────────────────────────────────────

/**
 * Every API response carries `metadata.request_id`. `resolution`, `pending`
 * (on a 202 "still indexing" answer) and `subscription` come and go by route.
 */
const MetadataSchema = z
	.object({
		request_id: z.string().optional(),
		resolution: z
			.object({
				type: z.string().optional(),
				value: z.string().optional(),
				method: z.string().optional(),
			})
			.passthrough()
			.optional(),
		pending: z
			.object({
				reason: z.string().optional(),
				message: z.string().optional(),
				retry_after_seconds: z.number().optional(),
			})
			.passthrough()
			.optional(),
		subscription: z
			.object({ status: z.string().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const IDENTIFIER_KEYS = ['domain', 'ticker', 'isin', 'crypto', 'name'] as const;

/** Send exactly one identifier, as the API asks. */
const BrandIdentifierShape = {
	domain: z
		.string()
		.min(1)
		.optional()
		.describe('Company domain, such as stripe.com.'),
	ticker: z.string().min(1).optional().describe('Stock ticker, such as AAPL.'),
	isin: z.string().min(1).optional().describe('ISIN, such as US0378331005.'),
	crypto: z.string().min(1).optional().describe('Crypto symbol, such as BTC.'),
	name: z
		.string()
		.min(1)
		.optional()
		.describe('Brand name. Logo.dev uses the top search match.'),
};

// `unknown` values: the refine runs on the parsed object, and only presence matters here.
function exactlyOneIdentifier(value: Record<string, unknown>): boolean {
	return IDENTIFIER_KEYS.filter((key) => value[key] !== undefined).length === 1;
}

const ONE_IDENTIFIER_MESSAGE =
	'Send exactly one of domain, ticker, isin, crypto or name.';

/** Image fields shared by a brand's logo, its brandmark and the logo endpoints. */
const ImageSchema = z
	.object({
		object: z.string().optional(),
		kind: z.string().optional(),
		brand_id: z.string().optional(),
		status: z.string().optional(),
		/** Temporary download URL; it stops working at `expires_at`. */
		url: z.string().optional(),
		etag: z.string().optional(),
		blurhash: z.string().nullable().optional(),
		source: z
			.object({
				width: z.number().optional(),
				height: z.number().optional(),
				format: z.string().optional(),
				has_transparency: z.boolean().optional(),
				is_vector: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		last_updated_at: z.string().optional(),
		expires_at: z.string().optional(),
	})
	.passthrough();

// ── brands.search ───────────────────────────────────────────────────────────

export const SearchBrandsInputSchema = z.object({
	q: z.string().min(1).describe('Brand name to search for.'),
	method: z
		.enum(['match', 'typeahead'])
		.optional()
		.describe('match for full names, typeahead for a prefix. Default match.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(25)
		.optional()
		.describe('How many brands to return, from 1 to 25. Default 10.'),
});

export const SearchBrandSchema = z
	.object({
		object: z.string().optional(),
		name: z.string(),
		domain: z.string(),
		logo_url: z.string().optional(),
	})
	.passthrough();

export const SearchBrandsResponseSchema = z
	.object({
		data: z.array(SearchBrandSchema),
		metadata: MetadataSchema,
	})
	.passthrough();

// ── brands.lookup / brands.get ──────────────────────────────────────────────

export const LookupBrandInputSchema = z
	.object({
		...BrandIdentifierShape,
		noSubscribe: z
			.boolean()
			.optional()
			.describe(
				'true skips the automatic subscription to this brand. Only matters when webhooks are on for the account.',
			),
	})
	.refine(exactlyOneIdentifier, { message: ONE_IDENTIFIER_MESSAGE });

export const GetBrandInputSchema = z.object({
	id: z.string().min(1).describe('Brand id, as returned in data.id.'),
	noSubscribe: z
		.boolean()
		.optional()
		.describe(
			'true skips the automatic subscription to this brand. Only matters when webhooks are on for the account.',
		),
});

/**
 * A brand profile. A 202 answer (brand still indexing) carries only `object`
 * and `status` plus `metadata.pending`, so everything else is optional.
 */
export const BrandSchema = z
	.object({
		object: z.string().optional(),
		id: z.string().optional(),
		slug: z.string().optional(),
		domain: z.string().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		indexed_at: z.string().nullable().optional(),
		is_profane: z.boolean().optional(),
		socials: z.record(z.string(), z.string().nullable()).optional(),
		colors: z
			.array(
				z
					.object({
						r: z.number().optional(),
						g: z.number().optional(),
						b: z.number().optional(),
						hex: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		logo: ImageSchema.nullable().optional(),
		brandmark: ImageSchema.nullable().optional(),
		// `unknown`: banner objects are not described field by field in the reference.
		social_banners: z.array(z.unknown()).optional(),
	})
	.passthrough();

export const BrandResponseSchema = z
	.object({ data: BrandSchema, metadata: MetadataSchema })
	.passthrough();

// ── logos.fetch / logos.getBrandmark ────────────────────────────────────────

export const FetchLogoInputSchema = z
	.object(BrandIdentifierShape)
	.refine(exactlyOneIdentifier, { message: ONE_IDENTIFIER_MESSAGE });

export const ImageResponseSchema = z
	.object({ data: ImageSchema, metadata: MetadataSchema })
	.passthrough();

// ── account.get ─────────────────────────────────────────────────────────────

export const GetAccountInputSchema = z.object({});

export const AccountResponseSchema = z
	.object({
		data: z
			.object({
				object: z.string().optional(),
				plan: z.string().optional(),
				credits: z
					.object({
						remaining: z.number().optional(),
						monthly_allowance: z.number().optional(),
						purchased: z.number().optional(),
						renews_at: z.string().nullable().optional(),
						can_buy_credits: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
		metadata: MetadataSchema,
	})
	.passthrough();

// ── subscriptions ───────────────────────────────────────────────────────────

export const BrandIdInputSchema = z.object({
	brandId: z.string().min(1).describe('Brand id, as returned in data.id.'),
});

export const SubscriptionResponseSchema = z
	.object({
		data: z
			.object({
				object: z.string().optional(),
				id: z.string().optional(),
				brand_id: z.string().optional(),
				created_at: z.string().optional(),
			})
			.passthrough(),
		metadata: MetadataSchema,
	})
	.passthrough();

export const UnsubscribeResponseSchema = z.object({
	brandId: z.string(),
	unsubscribed: z.literal(true),
});

// ── webhookEndpoints ────────────────────────────────────────────────────────

const FilterTypesSchema = z
	.array(z.enum(['brand.updated', 'brand.indexed']))
	.describe('Event types to send. Omit or send [] for all of them.');

export const WebhookEndpointSchema = z
	.object({
		object: z.string().optional(),
		id: z.string(),
		url: z.string().optional(),
		description: z.string().nullable().optional(),
		disabled: z.boolean().optional(),
		// Strings, so an event type added later still parses.
		filter_types: z.array(z.string()).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const ListWebhookEndpointsInputSchema = z.object({});

export const ListWebhookEndpointsResponseSchema = z
	.object({ data: z.array(WebhookEndpointSchema), metadata: MetadataSchema })
	.passthrough();

export const WebhookEndpointResponseSchema = z
	.object({ data: WebhookEndpointSchema, metadata: MetadataSchema })
	.passthrough();

export const WebhookEndpointIdInputSchema = z.object({
	id: z.string().min(1).describe('Webhook endpoint id, such as ep_….'),
});

export const CreateWebhookEndpointInputSchema = z.object({
	url: z.string().url().describe('HTTPS URL that receives the events.'),
	description: z.string().optional(),
	filter_types: FilterTypesSchema.optional(),
	disabled: z
		.boolean()
		.optional()
		.describe('true creates the endpoint switched off.'),
});

export const UpdateWebhookEndpointInputSchema = z.object({
	id: z.string().min(1).describe('Webhook endpoint id, such as ep_….'),
	url: z.string().url().optional(),
	description: z.string().optional(),
	filter_types: FilterTypesSchema.optional(),
	disabled: z.boolean().optional(),
});

export const DeleteWebhookEndpointResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

// ── Types ───────────────────────────────────────────────────────────────────

export type SearchBrandsInput = z.infer<typeof SearchBrandsInputSchema>;
export type SearchBrandsResponse = z.infer<typeof SearchBrandsResponseSchema>;
export type LookupBrandInput = z.infer<typeof LookupBrandInputSchema>;
export type GetBrandInput = z.infer<typeof GetBrandInputSchema>;
export type BrandResponse = z.infer<typeof BrandResponseSchema>;
export type FetchLogoInput = z.infer<typeof FetchLogoInputSchema>;
export type ImageResponse = z.infer<typeof ImageResponseSchema>;
export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;
export type AccountResponse = z.infer<typeof AccountResponseSchema>;
export type BrandIdInput = z.infer<typeof BrandIdInputSchema>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;
export type UnsubscribeResponse = z.infer<typeof UnsubscribeResponseSchema>;
export type ListWebhookEndpointsInput = z.infer<
	typeof ListWebhookEndpointsInputSchema
>;
export type ListWebhookEndpointsResponse = z.infer<
	typeof ListWebhookEndpointsResponseSchema
>;
export type WebhookEndpointResponse = z.infer<
	typeof WebhookEndpointResponseSchema
>;
export type WebhookEndpointIdInput = z.infer<
	typeof WebhookEndpointIdInputSchema
>;
export type CreateWebhookEndpointInput = z.infer<
	typeof CreateWebhookEndpointInputSchema
>;
export type UpdateWebhookEndpointInput = z.infer<
	typeof UpdateWebhookEndpointInputSchema
>;
export type DeleteWebhookEndpointResponse = z.infer<
	typeof DeleteWebhookEndpointResponseSchema
>;

/** Turns the plugin's identifier input into the API's query parameters. */
export function identifierQuery(
	input: Partial<Record<(typeof IDENTIFIER_KEYS)[number], string>>,
): Record<string, string | undefined> {
	return {
		domain: input.domain,
		ticker: input.ticker,
		isin: input.isin,
		crypto: input.crypto,
		name: input.name,
	};
}

export const LogoDevEndpointInputSchemas = {
	searchBrands: SearchBrandsInputSchema,
	lookupBrand: LookupBrandInputSchema,
	getBrand: GetBrandInputSchema,
	fetchLogo: FetchLogoInputSchema,
	getBrandmark: FetchLogoInputSchema,
	getAccount: GetAccountInputSchema,
	getSubscription: BrandIdInputSchema,
	subscribe: BrandIdInputSchema,
	unsubscribe: BrandIdInputSchema,
	listWebhookEndpoints: ListWebhookEndpointsInputSchema,
	getWebhookEndpoint: WebhookEndpointIdInputSchema,
	createWebhookEndpoint: CreateWebhookEndpointInputSchema,
	updateWebhookEndpoint: UpdateWebhookEndpointInputSchema,
	deleteWebhookEndpoint: WebhookEndpointIdInputSchema,
} as const;

export const LogoDevEndpointOutputSchemas = {
	searchBrands: SearchBrandsResponseSchema,
	lookupBrand: BrandResponseSchema,
	getBrand: BrandResponseSchema,
	fetchLogo: ImageResponseSchema,
	getBrandmark: ImageResponseSchema,
	getAccount: AccountResponseSchema,
	getSubscription: SubscriptionResponseSchema,
	subscribe: SubscriptionResponseSchema,
	unsubscribe: UnsubscribeResponseSchema,
	listWebhookEndpoints: ListWebhookEndpointsResponseSchema,
	getWebhookEndpoint: WebhookEndpointResponseSchema,
	createWebhookEndpoint: WebhookEndpointResponseSchema,
	updateWebhookEndpoint: WebhookEndpointResponseSchema,
	deleteWebhookEndpoint: DeleteWebhookEndpointResponseSchema,
} as const;
