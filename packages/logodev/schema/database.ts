import { z } from 'zod';

/**
 * One brand from Logo.dev search.
 * https://www.logo.dev/docs/api-reference/search/search-brands
 * A result is a name and a domain. `logo_url` is stored only after the
 * publishable `token` query is removed.
 */
export const LogoDevBrandEntity = z.object({
	domain: z.string().min(1),
	name: z.string().min(1),
	object: z.string().optional(),
	logoUrl: z.string().optional(),
	/** Set when the row came from brands.lookup or brands.get. */
	brandId: z.string().optional(),
});

export type LogoDevBrandEntity = z.infer<typeof LogoDevBrandEntity>;

/**
 * Local record of a logo fetch, keyed by the domain it was looked up by.
 * The temporary download URL expires, so it is not stored.
 */
export const LogoDevImageEntity = z.object({
	domain: z.string().min(1),
	brandId: z.string().optional(),
	format: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	etag: z.string().optional(),
});

export type LogoDevImageEntity = z.infer<typeof LogoDevImageEntity>;
