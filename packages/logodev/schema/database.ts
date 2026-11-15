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
});

export type LogoDevBrandEntity = z.infer<typeof LogoDevBrandEntity>;

/**
 * Local record of a logo fetch. The CDN returns image bytes, so the row
 * keeps the hostname and the content-type header. The token query is not stored.
 */
export const LogoDevImageEntity = z.object({
	domain: z.string().min(1),
	contentType: z.string().min(1),
});

export type LogoDevImageEntity = z.infer<typeof LogoDevImageEntity>;
