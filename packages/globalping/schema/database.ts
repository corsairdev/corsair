import { z } from 'zod';

/** Rate limit row. https://api.globalping.io/v1/limits */
export const GlobalpingLimitEntity = z.object({
	id: z.string().min(1),
	type: z.string().optional(),
	limit: z.number().optional(),
	remaining: z.number().optional(),
	reset: z.number().optional(),
});

/** Measurement. https://api.globalping.io/v1/spec.yaml CreateMeasurementResponse */
export const GlobalpingMeasurementEntity = z.object({
	id: z.string().min(1),
	probesCount: z.number().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
});

export const GlobalpingHealthEntity = z.object({
	id: z.string().min(1),
	status: z.string().min(1),
});

export type GlobalpingLimitEntity = z.infer<typeof GlobalpingLimitEntity>;
export type GlobalpingMeasurementEntity = z.infer<
	typeof GlobalpingMeasurementEntity
>;
export type GlobalpingHealthEntity = z.infer<typeof GlobalpingHealthEntity>;
