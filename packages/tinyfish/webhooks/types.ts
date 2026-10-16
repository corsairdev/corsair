import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

/**
 * The only events TinyFish delivers, all announced when a run reaches a
 * terminal state. Deliveries are plain JSON with no signature header, so
 * plugin matching happens on the payload itself and the docs' advice applies:
 * confirm anything sensitive with `GET /v1/runs/{id}` before acting on it.
 */
export const TINYFISH_RUN_EVENTS = [
	'run.completed',
	'run.failed',
	'run.cancelled',
] as const;

export type TinyFishRunEvent = (typeof TINYFISH_RUN_EVENTS)[number];

const WebhookRunErrorSchema = z.looseObject({
	code: z.string().nullable().optional(),
	message: z.string().optional(),
	category: z.string().optional(),
});

const WebhookRunStepSchema = z.looseObject({
	id: z.string(),
	timestamp: z.string(),
	status: z.string(),
	action: z.string().nullable().optional(),
	screenshot: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	duration: z.string().nullable().optional(),
});

/** The run snapshot inside `data`; loosened where docs examples differ. */
const WebhookRunDataSchema = z.looseObject({
	run_id: z.string().optional(),
	status: z.string().optional(),
	goal: z.string().optional(),
	created_at: z.string().optional(),
	started_at: z.string().nullable().optional(),
	finished_at: z.string().nullable().optional(),
	num_of_steps: z.number().nullable().optional(),
	// Result shape is goal-dependent; the docs fix keys only by example.
	result: z.record(z.string(), z.unknown()).nullable().optional(),
	error: WebhookRunErrorSchema.nullable().optional(),
	streaming_url: z.string().nullable().optional(),
	steps: z.array(WebhookRunStepSchema).optional(),
});

export const TinyFishWebhookPayloadSchema = z.looseObject({
	event: z.enum(TINYFISH_RUN_EVENTS),
	run_id: z.string(),
	status: z.string(),
	data: WebhookRunDataSchema.optional(),
});

export type TinyFishWebhookPayload = z.infer<
	typeof TinyFishWebhookPayloadSchema
>;

export const RunCompletedEventSchema = TinyFishWebhookPayloadSchema.extend({
	event: z.literal('run.completed'),
});

export const RunFailedEventSchema = TinyFishWebhookPayloadSchema.extend({
	event: z.literal('run.failed'),
});

export const RunCancelledEventSchema = TinyFishWebhookPayloadSchema.extend({
	event: z.literal('run.cancelled'),
});

export type RunCompletedEvent = z.infer<typeof RunCompletedEventSchema>;
export type RunFailedEvent = z.infer<typeof RunFailedEventSchema>;
export type RunCancelledEvent = z.infer<typeof RunCancelledEventSchema>;

export type TinyFishWebhookOutputs = {
	runCompleted: RunCompletedEvent;
	runFailed: RunFailedEvent;
	runCancelled: RunCancelledEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
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

export const matchTinyFishPluginWebhook: CorsairWebhookMatcher = (
	request: RawWebhookRequest,
) => {
	const body = parseBody(request.body);
	if (!body) return false;
	const event = body.event;
	return (
		typeof event === 'string' &&
		(TINYFISH_RUN_EVENTS as readonly string[]).includes(event)
	);
};

export const createTinyFishMatch =
	(event: TinyFishRunEvent): CorsairWebhookMatcher =>
	(request: RawWebhookRequest) => {
		const body = parseBody(request.body);
		return body?.event === event;
	};

/** There is no provider signature to verify, so the payload is the check. */
export function parseTinyFishRunEvent<T>(
	schema: z.ZodType<T>,
	payload: unknown,
): { valid: true; event: T } | { valid: false; error: string } {
	const result = schema.safeParse(payload);
	if (!result.success) {
		return { valid: false, error: 'Invalid TinyFish run webhook payload' };
	}
	return { valid: true, event: result.data };
}
