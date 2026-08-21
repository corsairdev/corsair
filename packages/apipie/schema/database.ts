import { z } from 'zod';

/**
 * Local mirror of a catalogue entry from `GET /v1/models`.
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
 * Local mirror of one generated image.
 *
 * `POST /v1/images/generations` returns no identifier for the images it
 * produces, so rows are keyed by a composite of the generation timestamp and
 * the image's index within the batch — see `cacheImage`.
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
export type ApipieImageEntity = z.infer<typeof ApipieImageEntity>;
