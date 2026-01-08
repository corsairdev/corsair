import * as crypto from 'crypto';
import {
	createErrorResponse,
	createSuccessResponse,
	type BaseOperationParams,
} from '../../base';
import type {
	SlackClient,
	SlackPlugin,
	SlackPluginContext,
} from '../types';

export type SlackWebhookEventName =
	| 'message'
	| 'app_mention'
	| 'file_shared'
	| 'file_created'
	| 'file_public'
	| 'channel_created'
	| 'reaction_added'
	| 'reaction_removed'
	| 'team_join'
	| 'user_change';

export interface SlackWebhookHeaders {
	'x-slack-signature'?: string;
	'x-slack-request-timestamp'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface SlackWebhookPayload {
	token?: string;
	team_id?: string;
	api_app_id?: string;
	event?: {
		type: string;
		[key: string]: any;
	};
	type: string;
	event_id?: string;
	event_time?: number;
	challenge?: string;
}

export interface HandleSlackWebhookParams extends BaseOperationParams<SlackPlugin, SlackClient, SlackPluginContext> {
	headers: SlackWebhookHeaders;
	payload: string | SlackWebhookPayload;
	signingSecret?: string;
}

export interface HandleSlackWebhookResult {
	success: boolean;
	eventType?: SlackWebhookEventName;
	error?: string;
	challenge?: string;
}

function verifySignature(
	payload: string,
	timestamp: string,
	signature: string,
	signingSecret: string,
): boolean {
	if (!signature || !timestamp) {
		return false;
	}

	const currentTime = Math.floor(Date.now() / 1000);
	const requestTime = parseInt(timestamp, 10);

	if (Math.abs(currentTime - requestTime) > 60 * 5) {
		return false;
	}

	const sigBasestring = `v0:${timestamp}:${payload}`;
	const expectedSignature =
		'v0=' +
		crypto
			.createHmac('sha256', signingSecret)
			.update(sigBasestring)
			.digest('hex');

	try {
		return crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
	} catch {
		return false;
	}
}

export async function handleSlackWebhook(
	params: HandleSlackWebhookParams,
): Promise<HandleSlackWebhookResult> {
	const { headers, payload, signingSecret } = params;
	const payloadString =
		typeof payload === 'string' ? payload : JSON.stringify(payload);

	const parsedPayload: SlackWebhookPayload =
		typeof payload === 'string' ? JSON.parse(payload) : payload;

	if (parsedPayload.type === 'url_verification') {
		return createSuccessResponse({
			challenge: parsedPayload.challenge,
		}) as HandleSlackWebhookResult;
	}

	if (signingSecret) {
		const signature = headers['x-slack-signature'];
		const timestamp = headers['x-slack-request-timestamp'];

		if (!signature || !timestamp) {
			return createErrorResponse(
				new Error('Missing signature or timestamp header'),
				'Missing signature or timestamp header',
			) as HandleSlackWebhookResult;
		}

		const isValid = verifySignature(payloadString, timestamp, signature, signingSecret);
		if (!isValid) {
			return createErrorResponse(
				new Error('Invalid signature'),
				'Invalid signature',
			) as HandleSlackWebhookResult;
		}
	}

	if (parsedPayload.type !== 'event_callback' || !parsedPayload.event) {
		return createErrorResponse(
			new Error('Invalid event payload'),
			'Invalid event payload',
		) as HandleSlackWebhookResult;
	}

	const event = parsedPayload.event;
	const eventType = event.type as SlackWebhookEventName;

	return createSuccessResponse({
		eventType: eventType,
		payload: parsedPayload,
	}) as HandleSlackWebhookResult;
}

