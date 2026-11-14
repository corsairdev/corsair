import { z } from 'zod';

/**
 * Genderize names a prediction by the name that was sent and scores it with a
 * probability between 0 and 1 plus the number of records behind it. `gender` is
 * `null` when nothing in the data set matched, which is a result rather than an
 * error: the name still counts against the monthly quota.
 */
const PredictionSchema = z.object({
	/** The name from the request, echoed exactly as sent. */
	name: z.string(),
	/** `male`, `female`, or null when no prediction can be made. */
	gender: z.string().nullable(),
	/** Confidence between 0 and 1. */
	probability: z.number(),
	/** Data points behind the prediction. */
	count: z.number(),
	/** Present only when the request was scoped to a country. */
	country_id: z.string().optional(),
});

const CountryCodeSchema = z
	.string()
	// Genderize does not validate the code: `1!` answers 200, echoed back, with
	// `gender: null`, which reads as an unknown name rather than a bad input.
	.regex(
		/^[A-Za-z]{2}$/,
		'Use a two-letter ISO 3166-1 alpha-2 country code, such as US',
	)
	.describe('Two-letter ISO 3166-1 alpha-2 country code, such as US or DK');

const PredictInputSchema = z.object({
	name: z
		.string()
		.min(1, 'A name is required')
		.describe(
			'A first name or a full name. A full name is more accurate, because every part of it carries signal',
		),
	country_id: CountryCodeSchema.optional().describe(
		'Scope the prediction to one country, which matters for names such as Kim or Andrea',
	),
});

const BatchInputSchema = z.object({
	names: z
		.array(z.string().min(1, 'A name cannot be empty'))
		.min(1, 'Send at least one name')
		.max(100, 'Genderize takes at most 100 names per request')
		.describe(
			'Up to 100 names to predict, answered in the same order. A batch counts each name against the monthly quota',
		),
	country_id: CountryCodeSchema.optional().describe(
		'Applies to every name in the batch, not one of them',
	),
});

const PredictResponseSchema = PredictionSchema;

const BatchResponseSchema = z.array(PredictionSchema);

export type GenderizePredictInput = z.infer<typeof PredictInputSchema>;
export type GenderizePredictResponse = z.infer<typeof PredictResponseSchema>;
export type GenderizeBatchInput = z.infer<typeof BatchInputSchema>;
export type GenderizeBatchResponse = z.infer<typeof BatchResponseSchema>;
export type GenderizePrediction = z.infer<typeof PredictionSchema>;

export type GenderizeEndpointInputs = {
	predict: GenderizePredictInput;
	batch: GenderizeBatchInput;
};

export type GenderizeEndpointOutputs = {
	predict: GenderizePredictResponse;
	batch: GenderizeBatchResponse;
};

export const GenderizeEndpointInputSchemas = {
	predict: PredictInputSchema,
	batch: BatchInputSchema,
} as const;

export const GenderizeEndpointOutputSchemas = {
	predict: PredictResponseSchema,
	batch: BatchResponseSchema,
} as const;
