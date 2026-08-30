import { z } from 'zod';

const PredictionSchema = z.object({
	id: z.string(),
	model: z.string().optional(),
	version: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	output: z.unknown().nullable().optional(),
	error: z.unknown().nullable().optional(),
	status: z.string(),
	created_at: z.string().optional(),
	started_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
	logs: z.string().nullable().optional(),
	source: z.string().optional(),
	data_removed: z.boolean().optional(),
	urls: z
		.object({
			web: z.string().optional(),
			get: z.string().optional(),
			cancel: z.string().optional(),
			stream: z.string().optional(),
		})
		.optional(),
	metrics: z.record(z.string(), z.unknown()).optional(),
});

export type Prediction = z.infer<typeof PredictionSchema>;

const PaginationSchema = z.object({
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	results: z.array(PredictionSchema),
});

export type PredictionList = z.infer<typeof PaginationSchema>;

const CreatePredictionInputSchema = z.object({
	version: z.string(),
	input: z.record(z.string(), z.unknown()).default({}),
	webhook: z.string().url().optional(),
	webhook_events_filter: z.array(z.string()).optional(),
});

export type CreatePredictionInput = z.infer<
	typeof CreatePredictionInputSchema
>;

const GetPredictionInputSchema = z.object({
	predictionId: z.string().min(1),
});

export type GetPredictionInput = z.infer<typeof GetPredictionInputSchema>;

const ListPredictionsInputSchema = z.object({
	createdAfter: z.string().optional(),
	createdBefore: z.string().optional(),
	source: z.string().optional(),
});

export type ListPredictionsInput = z.infer<
	typeof ListPredictionsInputSchema
>;

const CancelPredictionInputSchema = z.object({
	predictionId: z.string().min(1),
});

export type CancelPredictionInput = z.infer<
	typeof CancelPredictionInputSchema
>;

export type ReplicateEndpointInputs = {
	createPrediction: CreatePredictionInput;
	getPrediction: GetPredictionInput;
	listPredictions: ListPredictionsInput;
	cancelPrediction: CancelPredictionInput;
};

export type ReplicateEndpointOutputs = {
	createPrediction: Prediction;
	getPrediction: Prediction;
	listPredictions: PredictionList;
	cancelPrediction: Prediction;
};

export const ReplicateEndpointInputSchemas = {
	createPrediction: CreatePredictionInputSchema,
	getPrediction: GetPredictionInputSchema,
	listPredictions: ListPredictionsInputSchema,
	cancelPrediction: CancelPredictionInputSchema,
} as const;

export const ReplicateEndpointOutputSchemas = {
	createPrediction: PredictionSchema,
	getPrediction: PredictionSchema,
	listPredictions: PaginationSchema,
	cancelPrediction: PredictionSchema,
} as const;