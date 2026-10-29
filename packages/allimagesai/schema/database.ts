import { z } from 'zod';

/**
 * Entity shapes for the All-Images.ai records worth persisting.
 *
 * Fields are transcribed from the live OpenAPI document at
 * https://api.all-images.ai/doc-json. Nested objects are flattened into
 * queryable columns because `upsertByEntityId` replaces the stored `data` blob
 * wholesale rather than merging into it.
 *
 * `api-keys/check` and `credit` are account state that changes on every call,
 * so they are returned to the caller and never cached.
 */

/**
 * `GET /v1/image-generations` — one row per generation batch ("print").
 */
export const AllimagesaiImageGeneration = z.object({
	id: z.string(),
	name: z.string(),
	prompt: z.string(),
	/** 0 = Create, 1 = Pending, 2 = Processing, 3 = Done, 4 = Error. */
	status: z.number(),
	process_mode: z.string().nullable().optional(),
	nb_images: z.number().nullable().optional(),
	tags: z.array(z.string()).nullable().optional(),
	/** Preview URLs of the images produced by this batch. */
	image_urls: z.array(z.string()).nullable().optional(),
	/** `params[]` flattened to a name→value map. */
	params: z.record(z.string(), z.string()).nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type AllimagesaiImageGeneration = z.infer<
	typeof AllimagesaiImageGeneration
>;

/**
 * `POST /v1/images/downladed` — one row per previously downloaded image.
 */
export const AllimagesaiDownloadedImage = z.object({
	id: z.string(),
	/** Preview-resolution link. */
	url: z.string(),
	url_full: z.string().nullable().optional(),
	url_upscale: z.string().nullable().optional(),
	url_upscale_uhd: z.string().nullable().optional(),
	downloaded_at: z.coerce.date().nullable().optional(),
});
export type AllimagesaiDownloadedImage = z.infer<
	typeof AllimagesaiDownloadedImage
>;

/**
 * Webhook endpoints registered against the API key.
 *
 * `apiKeyId` is deliberately absent: the provider returns the API key itself in
 * that field, and persisting a live credential is never worth the convenience.
 * See `redactApiKeyId` in `../client`.
 */
export const AllimagesaiWebhook = z.object({
	id: z.string(),
	url: z.string().nullable().optional(),
	/**
	 * Recorded from the subscribe request. The provider's read endpoint does not
	 * return the event list, so this is the only place it can be observed.
	 */
	events: z.array(z.string()).nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type AllimagesaiWebhook = z.infer<typeof AllimagesaiWebhook>;
