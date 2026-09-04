import { z } from 'zod';

/**
 * Local cache of Brandfetch entities.
 *
 * Field names match the official Brand API and GraphQL schema.
 * Official Brand API: https://docs.brandfetch.com/reference/brand-api
 * Official GraphQL: https://docs.brandfetch.com/delivery-methods/graphql
 *
 * Nested logo/image blobs are not mirrored: CDN URLs expire and the arrays
 * are large. Firmographic brand + company rows are the lookup surface.
 */

/**
 * Brand profile from GET /v2/brands/{type}/{identifier}.
 * Official: BrandResponse.
 */
export const BrandfetchBrand = z.object({
	/** Unique identifier for the brand. Official: `id`. */
	id: z.string(),
	/** Brand name. Official: `name`. */
	name: z.string().nullable().optional(),
	/** Brand website URL. Official: `domain`. */
	domain: z.string(),
	/** True if the owner claimed the Brandfetch profile. Official: `claimed`. */
	claimed: z.boolean().optional(),
	/** Brand description. Official: `description`. */
	description: z.string().nullable().optional(),
	/** Brand long description. Official: `longDescription`. */
	longDescription: z.string().nullable().optional(),
	/** Quality score 0–1. Official: `qualityScore`. */
	qualityScore: z.number().optional(),
	/** True when the brand is NSFW. Official: `isNsfw`. */
	isNsfw: z.boolean().optional(),
	/** Uniform Resource Name for the brand. Official: `urn`. */
	urn: z.string().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Firmographic company object from BrandResponse.company.
 * Official: BrandResponse.company.
 */
export const BrandfetchCompany = z.object({
	/** Brand id this company record belongs to. */
	brandId: z.string(),
	/**
	 * Employee-count bucket. Official: `employees`.
	 * 1, 2, 11, 51, 201, 501, 1001, 5001, 10001.
	 */
	employees: z.number().nullable().optional(),
	/** Year the brand was founded. Official: `foundedYear`. */
	foundedYear: z.number().nullable().optional(),
	/**
	 * Organizational structure. Official: `kind`.
	 * EDUCATIONAL, GOVERNMENT_AGENCY, NON_PROFIT, PARTNERSHIP,
	 * PRIVATELY_HELD, PUBLIC_COMPANY, SELF_EMPLOYED, SELF_OWNED.
	 */
	kind: z.string().nullable().optional(),
	/** Headquarter city. Official: `company.location.city`. */
	city: z.string().nullable().optional(),
	/** Headquarter country. Official: `company.location.country`. */
	country: z.string().nullable().optional(),
	/** ISO 3166-1 alpha-2. Official: `company.location.countryCode`. */
	countryCode: z.string().nullable().optional(),
	/** Headquarter region. Official: `company.location.region`. */
	region: z.string().nullable().optional(),
	/** Headquarter state. Official: `company.location.state`. */
	state: z.string().nullable().optional(),
	/** Headquarter subregion. Official: `company.location.subregion`. */
	subregion: z.string().nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Webhook endpoint from GraphQL `webhooks`. Secret is not stored.
 * Official: type Webhook. https://docs.brandfetch.com/delivery-methods/webhooks/setup
 */
export const BrandfetchWebhook = z.object({
	/** Webhook URN. Official: `urn`. */
	urn: z.string(),
	/** HTTPS delivery URL. Official: `url`. */
	url: z.string(),
	/** Short name/description. Official: `description`. */
	description: z.string().nullable().optional(),
	/** Whether the webhook delivers events. Official: `enabled`. */
	enabled: z.boolean().optional(),
	/** Event types this webhook listens for. Official: `events`. */
	events: z.array(z.string()).optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

export type BrandfetchBrand = z.infer<typeof BrandfetchBrand>;
export type BrandfetchCompany = z.infer<typeof BrandfetchCompany>;
export type BrandfetchWebhook = z.infer<typeof BrandfetchWebhook>;
