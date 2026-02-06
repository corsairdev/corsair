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
	eventCaptured: EventCapturedEvent;
};

import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';
import { verifyHmacSignature, verifyHmacSignatureWithPrefix } from '../../../async-core/webhook-utils';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifyPostHogWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature =
		Array.isArray(headers['x-posthog-signature'])
			? headers['x-posthog-signature'][0]
			: headers['x-posthog-signature'] ||
				(Array.isArray(headers['x-signature'])
					? headers['x-signature'][0]
					: headers['x-signature']);

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-posthog-signature or x-signature header',
		};
	}

	const signatureWithoutPrefix = signature.replace(/^sha256=/, '');
	const isValid =
		signature.startsWith('sha256=') || signatureWithoutPrefix !== signature
			? verifyHmacSignatureWithPrefix(
					rawBody,
					webhookSecret,
					signature,
					'sha256=',
				)
			: verifyHmacSignature(rawBody, webhookSecret, signature);

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function createPostHogEventMatch(): CorsairWebhookMatcher {
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

export const createPostHogMatch = createPostHogEventMatch;
