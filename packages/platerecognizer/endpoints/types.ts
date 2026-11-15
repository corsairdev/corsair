import { z } from 'zod';

export const GetStatisticsInputSchema = z.object({});

export const GetStatisticsResponseSchema = z
	.object({
		usage: z
			.object({
				month: z.number().optional(),
				calls: z.number().optional(),
				year: z.number().optional(),
				resets_on: z.string().optional(),
			})
			.loose()
			.optional(),
		total_calls: z.number().optional(),
	})
	.loose();

const PlateResultSchema = z
	.object({
		plate: z.string().optional(),
		score: z.number().optional(),
		dscore: z.number().optional(),
		region: z
			.object({
				code: z.string().optional(),
				score: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const ReadPlateInputSchema = z.object({
	upload: z
		.string()
		.min(1)
		.describe('Base64 image. Sent as the upload form field.'),
	regions: z.array(z.string().min(1)).optional(),
	cameraId: z.string().min(1).optional(),
	mmc: z.boolean().optional(),
});

export const ReadPlateResponseSchema = z
	.object({
		results: z.array(PlateResultSchema),
		processing_time: z.number().optional(),
		filename: z.string().optional(),
		camera_id: z.string().nullable().optional(),
		timestamp: z.string().optional(),
		version: z.number().optional(),
	})
	.loose();

export type GetStatisticsInput = z.infer<typeof GetStatisticsInputSchema>;
export type GetStatisticsResponse = z.infer<typeof GetStatisticsResponseSchema>;
export type ReadPlateInput = z.infer<typeof ReadPlateInputSchema>;
export type ReadPlateResponse = z.infer<typeof ReadPlateResponseSchema>;

export const PlateRecognizerEndpointInputSchemas = {
	'usage.get': GetStatisticsInputSchema,
	'plates.read': ReadPlateInputSchema,
};

export const PlateRecognizerEndpointOutputSchemas = {
	'usage.get': GetStatisticsResponseSchema,
	'plates.read': ReadPlateResponseSchema,
};
