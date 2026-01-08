import * as crypto from 'crypto';
import {
	createErrorResponse,
	createSuccessResponse,
	type BaseOperationParams,
} from '../../base';
import type {
	PostHogClient,
	PostHogPlugin,
	PostHogPluginContext,
} from '../types';

export type PostHogWebhookEventName = 'event.captured';

export interface PostHogWebhookPayload {
	[key: string]: unknown;
}

export interface PostHogWebhookHeaders {
	'x-posthog-signature'?: string;
	'x-posthog-timestamp'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface HandlePostHogWebhookParams extends BaseOperationParams<PostHogPlugin, PostHogClient, PostHogPluginContext> {
	headers: PostHogWebhookHeaders;
	payload: string | PostHogWebhookPayload | PostHogWebhookPayload[];
	secret?: string;
}

export interface HandlePostHogWebhookResult {
	success: boolean;
	eventType?: PostHogWebhookEventName;
	error?: string;
}

function verifySignature(
	payload: string,
	signature: string,
	secret: string,
): boolean {
	if (!signature) {
		return false;
	}

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(payload)
		.digest('hex');

	const receivedHash = signature.replace(/^sha256=/, '');

	try {
		return crypto.timingSafeEqual(
			Buffer.from(expectedSignature),
			Buffer.from(receivedHash),
		);
	} catch {
		return false;
	}
}

export async function handlePostHogWebhook(
	params: HandlePostHogWebhookParams,
): Promise<HandlePostHogWebhookResult> {
	const { headers, payload, secret } = params;
	const payloadString =
		typeof payload === 'string' ? payload : JSON.stringify(payload);

	let events: PostHogWebhookPayload[];
	if (typeof payload === 'string') {
		try {
			const parsed = JSON.parse(payload);
			events = Array.isArray(parsed) ? parsed : [parsed];
		} catch {
			return createErrorResponse(
				new Error('Invalid JSON payload'),
				'Invalid JSON payload',
			) as HandlePostHogWebhookResult;
		}
	} else if (Array.isArray(payload)) {
		events = payload;
	} else {
		events = [payload];
	}

	if (secret) {
		const signature = headers['x-posthog-signature'];
		const timestamp = headers['x-posthog-timestamp'];

		if (!signature) {
			return createErrorResponse(
				new Error('Missing signature header'),
				'Missing signature header',
			) as HandlePostHogWebhookResult;
		}

		const isValid = verifySignature(payloadString, signature, secret);
		if (!isValid) {
			return createErrorResponse(
				new Error('Invalid signature'),
				'Invalid signature',
			) as HandlePostHogWebhookResult;
		}
	}

	return createSuccessResponse({
		eventType: 'event.captured',
		payload: events,
	}) as HandlePostHogWebhookResult;
}

