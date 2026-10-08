import { z } from 'zod';

/**
 * Browserless REST cookie from POST /unblock.
 * Official: https://docs.browserless.io/rest-apis/unblock
 */
export const BrowserlessCookie = z.object({
	name: z.string(),
	value: z.string(),
	domain: z.string().optional(),
	path: z.string().optional(),
	secure: z.boolean().optional(),
	httpOnly: z.boolean().optional(),
	expires: z.number().optional(),
	sameSite: z.enum(['Strict', 'Lax', 'None']).optional(),
	url: z.string().optional(),
});

export type BrowserlessCookie = z.infer<typeof BrowserlessCookie>;

/**
 * One CSS-selector match from POST /scrape.
 * Official: https://docs.browserless.io/rest-apis/scrape
 */
export const BrowserlessScrapeMatch = z.object({
	attributes: z
		.array(z.object({ name: z.string(), value: z.string() }))
		.optional(),
	height: z.number().optional(),
	html: z.string().optional(),
	left: z.number().optional(),
	text: z.string().optional(),
	top: z.number().optional(),
	width: z.number().optional(),
});

export type BrowserlessScrapeMatch = z.infer<typeof BrowserlessScrapeMatch>;

/**
 * Selector group from POST /scrape `data[]`.
 * Official: https://docs.browserless.io/rest-apis/scrape
 */
export const BrowserlessScrapeGroup = z.object({
	selector: z.string(),
	results: z.array(BrowserlessScrapeMatch),
});

export type BrowserlessScrapeGroup = z.infer<typeof BrowserlessScrapeGroup>;

/**
 * POST /scrape JSON body.
 * Official: https://docs.browserless.io/rest-apis/scrape
 */
export const BrowserlessScrapeResult = z.object({
	data: z.array(BrowserlessScrapeGroup),
});

export type BrowserlessScrapeResult = z.infer<typeof BrowserlessScrapeResult>;

/**
 * POST /unblock JSON body.
 * Official: https://docs.browserless.io/rest-apis/unblock
 */
export const BrowserlessUnblockResult = z.object({
	content: z.string().nullable().optional(),
	cookies: z.array(BrowserlessCookie).nullable().optional(),
	screenshot: z.string().nullable().optional(),
	browserWSEndpoint: z.string().nullable().optional(),
});

export type BrowserlessUnblockResult = z.infer<typeof BrowserlessUnblockResult>;

/**
 * POST /content returns `text/html`.
 * Official: https://docs.browserless.io/rest-apis/content
 */
export const BrowserlessHtml = z.object({
	html: z.string(),
	contentType: z.string(),
});

export type BrowserlessHtml = z.infer<typeof BrowserlessHtml>;

/**
 * Binary REST payloads (/screenshot, /pdf, /download, and non-JSON /function).
 * Official: https://docs.browserless.io/rest-apis/intro
 */
export const BrowserlessFile = z.object({
	base64: z.string(),
	contentType: z.string(),
	filename: z.string().optional(),
});

export type BrowserlessFile = z.infer<typeof BrowserlessFile>;
