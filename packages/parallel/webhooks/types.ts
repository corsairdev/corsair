import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import {
	FINDALL_WEBHOOK_EVENTS,
	FindAllCandidate,
	FindAllRunOutput,
	TaskRunOutput,
} from '../endpoints/types';

// Parallel signs every webhook the Standard Webhooks way, with the account's
// webhook secret (Settings → Webhooks in the Parallel console):
// docs.parallel.ai/resources/webhook-setup

export const TASK_WEBHOOK_EVENTS = ['task_run.status'] as const;
export const MONITOR_WEBHOOK_EVENTS = [
	'monitor.event.detected',
	'monitor.execution.completed',
	'monitor.execution.failed',
] as const;
export const PARALLEL_WEBHOOK_EVENTS = [
	...TASK_WEBHOOK_EVENTS,
	...FINDALL_WEBHOOK_EVENTS,
	...MONITOR_WEBHOOK_EVENTS,
] as const;
export type ParallelWebhookEventType = (typeof PARALLEL_WEBHOOK_EVENTS)[number];

function envelope<T extends string, D extends z.ZodType>(type: T, data: D) {
	return z
		.object({ type: z.literal(type), timestamp: z.string(), data })
		.passthrough();
}

/** The full Task Run object, as tasks.getRun returns it. */
export const TaskRunStatusEvent = envelope('task_run.status', TaskRunOutput);

const candidateEvent = <T extends string>(type: T) =>
	envelope(type, FindAllCandidate.extend({ findall_id: z.string() }));
export const FindAllCandidateGeneratedEvent = candidateEvent(
	'findall.candidate.generated',
);
export const FindAllCandidateMatchedEvent = candidateEvent(
	'findall.candidate.matched',
);
export const FindAllCandidateEnrichedEvent = candidateEvent(
	'findall.candidate.enriched',
);
export const FindAllRunCompletedEvent = envelope(
	'findall.run.completed',
	FindAllRunOutput,
);
export const FindAllRunCancelledEvent = envelope(
	'findall.run.cancelled',
	FindAllRunOutput,
);
export const FindAllRunFailedEvent = envelope(
	'findall.run.failed',
	FindAllRunOutput,
);

// Monitor events name the run; monitors.events with the event_group_id
// returns what was found.
const monitorMetadata = z
	.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
	.nullable()
	.optional();
const monitorData = <E extends z.ZodType>(event: E) =>
	z
		.object({ monitor_id: z.string(), event, metadata: monitorMetadata })
		.passthrough();
export const MonitorEventDetectedEvent = envelope(
	'monitor.event.detected',
	monitorData(z.object({ event_group_id: z.string() }).passthrough()),
);
export const MonitorExecutionCompletedEvent = envelope(
	'monitor.execution.completed',
	monitorData(
		z
			.object({
				type: z.string().optional(),
				monitor_ts: z.string().nullable().optional(),
			})
			.passthrough(),
	),
);
export const MonitorExecutionFailedEvent = envelope(
	'monitor.execution.failed',
	monitorData(
		z
			.object({
				type: z.string().optional(),
				error: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				date: z.string().nullable().optional(),
			})
			.passthrough(),
	),
);

export type ParallelWebhookOutputs = {
	taskRunStatus: z.infer<typeof TaskRunStatusEvent>;
	findallCandidateGenerated: z.infer<typeof FindAllCandidateGeneratedEvent>;
	findallCandidateMatched: z.infer<typeof FindAllCandidateMatchedEvent>;
	findallCandidateEnriched: z.infer<typeof FindAllCandidateEnrichedEvent>;
	findallRunCompleted: z.infer<typeof FindAllRunCompletedEvent>;
	findallRunCancelled: z.infer<typeof FindAllRunCancelledEvent>;
	findallRunFailed: z.infer<typeof FindAllRunFailedEvent>;
	monitorEventDetected: z.infer<typeof MonitorEventDetectedEvent>;
	monitorExecutionCompleted: z.infer<typeof MonitorExecutionCompletedEvent>;
	monitorExecutionFailed: z.infer<typeof MonitorExecutionFailedEvent>;
};

/** The JSON object a webhook body holds, or null. The body arrives either as
 * the raw string or already parsed, depending on the HTTP adapter. */
export function parseBody(body: unknown): Record<string, unknown> | null {
	let value = body;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return null;
		}
	}
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}
	// Narrowed to a plain object by the checks above.
	return value as Record<string, unknown>;
}

function header(
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
}

const KNOWN = new Set<string>(PARALLEL_WEBHOOK_EVENTS);

/** A Standard Webhooks delivery whose type is one of Parallel's events. */
export function matchParallelWebhook(request: RawWebhookRequest): boolean {
	if (!header(request.headers, 'webhook-signature')) return false;
	const type = parseBody(request.body)?.type;
	return typeof type === 'string' && KNOWN.has(type);
}

export function matchParallelEvent(
	type: ParallelWebhookEventType,
): CorsairWebhookMatcher {
	return (request) => parseBody(request.body)?.type === type;
}

/** Deliveries older or newer than this are refused, so a captured request
 * can't be replayed later. Standard Webhooks suggests five minutes. */
const TOLERANCE_SECONDS = 5 * 60;

/**
 * Checks the webhook-signature header: HMAC-SHA256 over
 * `<webhook-id>.<webhook-timestamp>.<raw body>`, keyed with the secret
 * (its `whsec_` prefix stripped, the rest Base64-decoded), standard Base64.
 * The header may carry several space-separated `v1,<sig>` entries while a
 * secret is being rotated; any one matching is enough.
 */
export function verifyParallelWebhook(
	// unknown: the payload is parsed by the handler's schema after this check.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	now: number = Date.now(),
): { valid: true } | { valid: false; error: string } {
	if (request.hubVerified) return { valid: true };
	if (!secret?.trim()) {
		return {
			valid: false,
			error:
				'No Parallel webhook secret is configured: set webhookSecret or store it as the webhook signature',
		};
	}
	const rawBody = request.rawBody;
	if (!rawBody) {
		return { valid: false, error: 'Missing raw body for signature check' };
	}
	const id = header(request.headers, 'webhook-id');
	const timestamp = header(request.headers, 'webhook-timestamp');
	const signatures = header(request.headers, 'webhook-signature');
	if (!id || !timestamp || !signatures) {
		return { valid: false, error: 'Missing Standard Webhooks headers' };
	}
	if (!/^\d+$/.test(timestamp)) {
		return { valid: false, error: 'Invalid webhook-timestamp' };
	}
	if (Math.abs(now / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) {
		return { valid: false, error: 'Webhook timestamp is too old or too new' };
	}
	const trimmed = secret.trim();
	const key = Buffer.from(
		trimmed.startsWith('whsec_') ? trimmed.slice('whsec_'.length) : trimmed,
		'base64',
	);
	if (key.length === 0) {
		return { valid: false, error: 'Malformed webhook secret' };
	}
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${rawBody}`)
		.digest();
	const matched = signatures
		.split(' ')
		.map((part) => part.trim())
		.some((part) => {
			const [version, signature] = part.split(',', 2);
			if (version !== 'v1' || !signature) return false;
			const received = Buffer.from(signature, 'base64');
			return (
				received.length === expected.length &&
				timingSafeEqual(received, expected)
			);
		});
	return matched
		? { valid: true }
		: { valid: false, error: 'Invalid signature' };
}
