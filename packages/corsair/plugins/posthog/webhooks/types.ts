export interface PostHogWebhookPayload {
	event: string;
	distinct_id: string;
	timestamp?: string;
	uuid?: string;
	properties?: Record<string, any>;
	person?: {
		distinct_id: string;
		properties?: Record<string, any>;
	};
	groups?: Record<string, any>;
	$set?: Record<string, any>;
	$set_once?: Record<string, any>;
	$unset?: string[];
}

export interface EventCapturedEvent extends PostHogWebhookPayload {
	event: string;
	distinct_id: string;
	properties?: Record<string, any>;
}

export type PostHogWebhookEvent = EventCapturedEvent;

export type PostHogEventName = 'event.captured';

export interface PostHogEventMap {
	'event.captured': EventCapturedEvent;
}

export type PostHogWebhookOutputs = {
	eventCaptured: Record<string, unknown>;
};

import type { CorsairWebhookMatcher, RawWebhookRequest } from '../../../core';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createPostHogMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return (
			typeof parsedBody === 'object' &&
			parsedBody !== null &&
			'event' in parsedBody &&
			'distinct_id' in parsedBody
		);
	};
}
