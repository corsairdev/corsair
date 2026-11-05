import { z } from 'zod';

// Source: response of Retrieve a video generation task,
// https://docs.byteplus.com/en/docs/ModelArk/1521309
export const BytedanceVideoTask = z.object({
	id: z.string(),
	model: z.string().optional(),
	status: z.string(),
	videoUrl: z.string().optional(),
	lastFrameUrl: z.string().optional(),
	resolution: z.string().optional(),
	ratio: z.string().optional(),
	duration: z.number().optional(),
	totalTokens: z.number().optional(),
	errorCode: z.string().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date(),
});

export type BytedanceVideoTask = z.infer<typeof BytedanceVideoTask>;
