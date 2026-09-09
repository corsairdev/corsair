import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export const CodeInterpreterWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type CodeInterpreterWebhookPayload = z.infer<
	typeof CodeInterpreterWebhookPayloadSchema
>;

export const ExecutionCompletedEventSchema = CodeInterpreterWebhookPayloadSchema.extend({
	type: z.literal('execution.completed'),
	data: z.object({
		session_id: z.string(),
		execution_id: z.string().optional(),
		exit_code: z.number(),
		stdout: z.string().optional(),
		stderr: z.string().optional(),
		output_files: z
			.array(
				z.object({
					id: z.string(),
					name: z.string(),
				}),
			)
			.optional(),
	}),
});
export type ExecutionCompletedEvent = z.infer<typeof ExecutionCompletedEventSchema>;

export const ExecutionFailedEventSchema = CodeInterpreterWebhookPayloadSchema.extend({
	type: z.literal('execution.failed'),
	data: z.object({
		session_id: z.string(),
		execution_id: z.string().optional(),
		error: z.string(),
		exit_code: z.number().optional(),
	}),
});
export type ExecutionFailedEvent = z.infer<typeof ExecutionFailedEventSchema>;

export const FileReadyEventSchema = CodeInterpreterWebhookPayloadSchema.extend({
	type: z.literal('file.ready'),
	data: z.object({
		session_id: z.string(),
		file_id: z.string(),
		filename: z.string(),
		size: z.number().optional(),
		mime_type: z.string().optional(),
	}),
});
export type FileReadyEvent = z.infer<typeof FileReadyEventSchema>;

export type CodeInterpreterWebhookOutputs = {
	executionCompleted: ExecutionCompletedEvent;
	executionFailed: ExecutionFailedEvent;
	fileReady: FileReadyEvent;
};

export const CodeInterpreterWebhookEventSchemas = {
	executionCompleted: ExecutionCompletedEventSchema,
	executionFailed: ExecutionFailedEventSchema,
	fileReady: FileReadyEventSchema,
} as const;

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createCodeInterpreterMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyCodeInterpreterWebhookSignature(
	request: WebhookRequest<CodeInterpreterWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const headers = request.headers || {};
	const signature =
		(headers['x-webhook-signature'] as string | undefined) ||
		(headers['x-signature'] as string | undefined);

	if (!signature) {
		return { valid: false, error: 'Missing webhook signature header' };
	}

	const rawBody =
		typeof request.rawBody === 'string'
			? request.rawBody
			: JSON.stringify(request.payload);

	const expectedSignature = createHmac('sha256', secret).update(rawBody).digest('hex');

	const sigBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expectedSignature);

	if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
