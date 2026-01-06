import * as crypto from 'crypto';
import {
	createErrorResponse,
	createSuccessResponse,
	type BaseOperationParams,
} from '../../base';
import type {
	HubSpotClient,
	HubSpotPlugin,
	HubSpotPluginContext,
} from '../types';

export interface HubSpotWebhookPayload {
	subscriptionType: string;
	[key: string]: unknown;
}

export interface HubSpotWebhookHeaders {
	'x-hubspot-signature-v2'?: string;
	'x-hubspot-signature-v3'?: string;
	'x-hubspot-request-timestamp'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface HandleHubSpotWebhookParams extends BaseOperationParams<HubSpotPlugin, HubSpotClient, HubSpotPluginContext> {
	headers: HubSpotWebhookHeaders;
	payload: string | HubSpotWebhookPayload | HubSpotWebhookPayload[];
	secret?: string;
}

export interface HandleHubSpotWebhookResult {
	success: boolean;
	eventType?: string;
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

	const receivedHash = signature.replace('sha256=', '');

	try {
		return crypto.timingSafeEqual(
			Buffer.from(expectedSignature),
			Buffer.from(receivedHash),
		);
	} catch {
		return false;
	}
}

export async function handleHubSpotWebhook(
	params: HandleHubSpotWebhookParams,
): Promise<HandleHubSpotWebhookResult> {
	const { headers, payload, secret } = params;
	const payloadString =
		typeof payload === 'string' ? payload : JSON.stringify(payload);

	let events: HubSpotWebhookPayload[];
	if (typeof payload === 'string') {
		try {
			const parsed = JSON.parse(payload);
			events = Array.isArray(parsed) ? parsed : [parsed];
		} catch {
			return createErrorResponse(
				new Error('Invalid JSON payload'),
				'Invalid JSON payload',
			) as HandleHubSpotWebhookResult;
		}
	} else if (Array.isArray(payload)) {
		events = payload;
	} else {
		events = [payload];
	}

	if (secret) {
		const signature =
			headers['x-hubspot-signature-v3'] ||
			headers['x-hubspot-signature-v2'];
		const timestamp = headers['x-hubspot-request-timestamp'];

		if (!signature) {
			return createErrorResponse(
				new Error('Missing signature header'),
				'Missing signature header',
			) as HandleHubSpotWebhookResult;
		}

		const isValid = verifySignature(payloadString, signature, secret);
		if (!isValid) {
			return createErrorResponse(
				new Error('Invalid signature'),
				'Invalid signature',
			) as HandleHubSpotWebhookResult;
		}
	}

	const eventType = events[0]?.subscriptionType;

	return createSuccessResponse({
		eventType,
		payload: events,
	}) as HandleHubSpotWebhookResult;
}

