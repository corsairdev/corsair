import { z } from 'zod';

// Source: task query response (GET /api/v1/tasks/{task_id}),
// https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference
export const AlibabaVideoTask = z.object({
	taskId: z.string(),
	model: z.string().optional(),
	status: z.string(),
	videoUrl: z.string().optional(),
	submitTime: z.string().optional(),
	endTime: z.string().optional(),
	durationSeconds: z.number().optional(),
	errorCode: z.string().optional(),
	updatedAt: z.coerce.date(),
});

export type AlibabaVideoTask = z.infer<typeof AlibabaVideoTask>;

// Source: multimodal-generation response,
// https://www.alibabacloud.com/help/en/model-studio/qwen-image-generation-and-editing-api-reference
export const AlibabaImage = z.object({
	url: z.string(),
	requestId: z.string(),
	model: z.string(),
	prompt: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
	createdAt: z.coerce.date(),
});

export type AlibabaImage = z.infer<typeof AlibabaImage>;
