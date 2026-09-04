import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const UploadcareWebhookPayloadSchema = z.object({
	event: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type UploadcareWebhookPayload = z.infer<typeof UploadcareWebhookPayloadSchema>;

export const FileUploadedEventSchema = UploadcareWebhookPayloadSchema.extend({
	event: z.literal('file.uploaded'),
	data: z
		.object({
			uuid: z.string(),
			original_filename: z.string().optional().nullable(),
		})
		.loose(),
});

export type FileUploadedEvent = z.infer<typeof FileUploadedEventSchema>;

export type UploadcareWebhookOutputs = {
	fileUploaded: FileUploadedEvent;
};

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

export function createUploadcareMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.event === eventType;
	};
}

export function verifyUploadcareWebhookSignature(
	request: WebhookRequest<UploadcareWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	return { valid: true };
}
