import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GoogleAppsScriptWebhookPayloadSchema = z.object({
	spreadsheetId: z.string().optional(),
	sheetName: z.string().optional(),
	range: z.string().optional(),
	values: z
		.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))
		.optional(),
	eventType: z.literal('rangeUpdated').optional(),
	timestamp: z.string().optional(),
	event: z.unknown().optional(),
});
export type GoogleAppsScriptWebhookPayload<TEvent = unknown> = Omit<
	z.infer<typeof GoogleAppsScriptWebhookPayloadSchema>,
	'event'
> & { event?: TEvent };

export const RangeUpdatedEventSchema = z.object({
	eventType: z.literal('rangeUpdated'),
	spreadsheetId: z.string(),
	sheetName: z.string(),
	range: z.string(),
	values: z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
	timestamp: z.string(),
});
export type RangeUpdatedEvent = z.infer<typeof RangeUpdatedEventSchema>;

export type GoogleSheetsWebhookEvent = RangeUpdatedEvent;

export type GoogleSheetsEventName = 'rangeUpdated';

export interface GoogleSheetsEventMap {
	rangeUpdated: RangeUpdatedEvent;
}

export type GoogleSheetsWebhookPayload<TEvent = unknown> =
	GoogleAppsScriptWebhookPayload<TEvent>;

export type GoogleSheetsWebhookOutputs = {
	rangeUpdated: RangeUpdatedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createGoogleSheetsWebhookMatcher(
	eventType: GoogleSheetsEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = parseBody(request.body) as Record<string, unknown>;
		return body.eventType === eventType;
	};
}
