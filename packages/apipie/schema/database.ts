import { z } from 'zod';

/**
 * Local mirror of a catalogue entry from `GET /v1/models`.
 *
 * `GET /v1/models/detailed` returns a different field set and is mirrored
 * separately by `ApipieModelDetailEntity`. Sharing one row between the two
 * would make each refresh erase the other's columns, because the entity store
 * replaces the stored payload wholesale rather than merging it.
 *
 * Fields and nullability were taken from a live response covering all 1217
 * catalogue entries, so this table matches what APIpie actually returns rather
 * than a guess at it. The cost, `latency` and `query_count` columns are
 * strings because the API returns numeric strings for them.
 *
 * The nested `img_json` blob is deliberately not mirrored: it is only present
 * on image models and belongs to the response, not to a flat cache row.
 */
export const ApipieModelEntity = z
	.object({
		id: z.string(),
		/** Provider-qualified name, e.g. `openai/gpt-4o`. */
		model: z.string().nullish(),
		provider: z.string().nullish(),
		type: z.string().nullish(),
		subtype: z.string().nullish(),
		route: z.string().nullish(),
		description: z.string().nullish(),
		/** APIpie returns 0/1 flags rather than booleans. */
		enabled: z.union([z.boolean(), z.number()]).nullish(),
		available: z.union([z.boolean(), z.number()]).nullish(),
		avg_cost: z.string().nullish(),
		input_cost: z.string().nullish(),
		output_cost: z.string().nullish(),
		price_type: z.string().nullish(),
		latency: z.string().nullish(),
		query_count: z.string().nullish(),
		max_tokens: z.number().nullish(),
		max_response_tokens: z.number().nullish(),
	})
	.loose();

/**
 * Local mirror of a catalogue entry from `GET /v1/models/detailed`.
 *
 * Kept apart from `ApipieModelEntity` on purpose: the detailed response omits
 * the plain list's cost columns and adds modality and capacity fields, so the
 * two cannot share a row without one refresh erasing the other's data. Fields
 * and nullability were taken from a live response covering all 1217 entries.
 */
export const ApipieModelDetailEntity = z
	.object({
		id: z.string(),
		model: z.string().nullish(),
		provider: z.string().nullish(),
		type: z.string().nullish(),
		subtype: z.string().nullish(),
		route: z.string().nullish(),
		description: z.string().nullish(),
		/** APIpie returns 0/1 flags rather than booleans. */
		enabled: z.union([z.boolean(), z.number()]).nullish(),
		available: z.union([z.boolean(), z.number()]).nullish(),
		abortable: z.boolean().nullish(),
		moderationRequired: z.boolean().nullish(),
		supports_multipart: z.boolean().nullish(),
		input_modalities: z.array(z.string()).nullish(),
		output_modalities: z.array(z.string()).nullish(),
		instruct_type: z.string().nullish(),
		quantization: z.string().nullish(),
		pool: z.string().nullish(),
		mmlu: z.number().nullish(),
		output_vector_size: z.number().nullish(),
		max_tokens: z.number().nullish(),
		max_response_tokens: z.number().nullish(),
		max_images_per_prompt: z.number().nullish(),
		max_audio_per_prompt: z.number().nullish(),
		max_audio_length_hours: z.number().nullish(),
		max_videos_per_prompt: z.number().nullish(),
		max_video_length: z.number().nullish(),
		max_pdf_size_mb: z.number().nullish(),
		/** Numeric strings, not numbers. */
		latency: z.string().nullish(),
		query_count: z.string().nullish(),
		pricing: z.record(z.string(), z.unknown()).nullish(),
		supported_input_parameters: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

/**
 * Local mirror of one generated image.
 *
 * `POST /v1/images/generations` returns no identifier for the images it
 * produces, so rows are keyed by a per-request generation id combined with the
 * image's index within the batch — see `cacheImage`. A timestamp is not enough:
 * two generations completing in the same second would collide.
 *
 * Only `url` is mirrored. When the caller asks for `b64_json` the payload is
 * the image itself, which does not belong in a cache row.
 */
export const ApipieImageEntity = z
	.object({
		id: z.string(),
		prompt: z.string().nullish(),
		model: z.string().nullish(),
		url: z.string().nullish(),
		revised_prompt: z.string().nullish(),
		/** Unix seconds, as returned by the API. */
		created: z.number().nullish(),
	})
	.loose();

export type ApipieModelEntity = z.infer<typeof ApipieModelEntity>;
export type ApipieModelDetailEntity = z.infer<typeof ApipieModelDetailEntity>;
export type ApipieImageEntity = z.infer<typeof ApipieImageEntity>;
