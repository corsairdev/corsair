import type { RawWebhookRequest } from 'corsair/core';
import { asRecord } from 'corsair/core';
import { z } from 'zod';

export const CapsuleCrmRestHookPayloadSchema = z.object({
	event: z.string(),
	payload: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const CapsuleCrmWebhookResponseSchema = z.object({
	success: z.boolean(),
});

const CAPSULE_EVENT_PREFIXES = [
	'party/',
	'kase/',
	'opportunity/',
	'task/',
	'user/',
] as const;

export function capsuleCrmEvent(body: unknown): string | undefined {
	const event = asRecord(body)?.event;
	return typeof event === 'string' ? event : undefined;
}

export function isCapsuleCrmWebhookRequest(
	request: RawWebhookRequest,
): boolean {
	const event = capsuleCrmEvent(request.body);
	if (!event) return false;
	return CAPSULE_EVENT_PREFIXES.some((prefix) => event.startsWith(prefix));
}

export function matchCapsuleCrmEvent(
	eventName: string,
): (request: RawWebhookRequest) => boolean {
	return (request) => capsuleCrmEvent(request.body) === eventName;
}
