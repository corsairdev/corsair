import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import { DocumentSchema } from '../endpoints/types';

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return isRecord(parsed) ? parsed : null;
		} catch {
			return null;
		}
	}
	return isRecord(body) ? body : null;
}

export const DocumentProcessedEventSchema = z
	.object({
		event: z.string().optional(),
		document: DocumentSchema.optional(),
		result: z.record(z.string(), z.unknown()).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export type DocumentProcessedEvent = z.infer<
	typeof DocumentProcessedEventSchema
>;

export const TableItemProcessedEventSchema = z
	.object({
		event: z.string().optional(),
		table_item: z.record(z.string(), z.unknown()).optional(),
		document: DocumentSchema.optional(),
	})
	.passthrough();

export type TableItemProcessedEvent = z.infer<
	typeof TableItemProcessedEventSchema
>;

export const ProcessFailedEventSchema = z
	.object({
		event: z.string().optional(),
		document: DocumentSchema.optional(),
		error: z.string().optional(),
	})
	.passthrough();

export type ProcessFailedEvent = z.infer<typeof ProcessFailedEventSchema>;

export type ParseurWebhookOutputs = {
	documentProcessed: DocumentProcessedEvent;
	tableItemProcessed: TableItemProcessedEvent;
	processFailed: ProcessFailedEvent;
};

export const ParseurWebhookOutputSchemas = {
	documentProcessed: DocumentProcessedEventSchema,
	tableItemProcessed: TableItemProcessedEventSchema,
	processFailed: ProcessFailedEventSchema,
};

export function createParseurMatch(
	eventPattern: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		if (typeof parsedBody.event === 'string') {
			return parsedBody.event.includes(eventPattern);
		}
		if (
			eventPattern === 'document.processed' &&
			(parsedBody.result || parsedBody.document)
		) {
			return true;
		}
		return false;
	};
}

export function matchParseurPluginWebhook(request: RawWebhookRequest): boolean {
	const parsedBody = parseBody(request.body);
	if (!parsedBody) return false;
	return (
		typeof parsedBody.event === 'string' ||
		Boolean(parsedBody.document) ||
		Boolean(parsedBody.result) ||
		Boolean(parsedBody.table_item)
	);
}

export function verifyParseurWebhookSignature(
	_request: WebhookRequest<unknown>,
	_secret?: string,
): { valid: boolean; error?: string } {
	return { valid: true };
}
