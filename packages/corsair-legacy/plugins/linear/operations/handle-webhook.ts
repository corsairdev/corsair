import * as crypto from 'crypto';
import {
	createErrorResponse,
	createSuccessResponse,
	type BaseOperationParams,
} from '../../base';
import type {
	LinearClient,
	LinearPlugin,
	LinearPluginContext,
} from '../types';

export interface LinearWebhookEvent {
	type: string;
	action: string;
	[key: string]: unknown;
}

export interface LinearWebhookHeaders {
	'linear-signature'?: string;
	'linear-delivery'?: string;
	[key: string]: string | undefined;
}

export interface HandleLinearWebhookParams extends BaseOperationParams<LinearPlugin, LinearClient, LinearPluginContext> {
	headers: LinearWebhookHeaders;
	payload: string | LinearWebhookEvent;
	webhookSecret?: string;
}

export interface HandleLinearWebhookResult {
	success: boolean;
	eventType?: string;
	action?: string;
	error?: string;
}

function verifySignature(
	payload: string,
	signature: string,
	webhookSecret: string,
): boolean {
	if (!signature) {
		return false;
	}

	const expectedSignature = crypto
		.createHmac('sha256', webhookSecret)
		.update(payload)
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

export async function handleLinearWebhook(
	params: HandleLinearWebhookParams,
): Promise<HandleLinearWebhookResult> {
	const { headers, payload, webhookSecret } = params;
	const payloadString =
		typeof payload === 'string' ? payload : JSON.stringify(payload);

	const parsedPayload: LinearWebhookEvent =
		typeof payload === 'string' ? JSON.parse(payload) : payload;

	if (webhookSecret) {
		const signature = headers['linear-signature'];

		if (!signature) {
			return createErrorResponse(
				new Error('Missing linear-signature header'),
				'Missing linear-signature header',
			) as HandleLinearWebhookResult;
		}

		const isValid = verifySignature(payloadString, signature, webhookSecret);
		if (!isValid) {
			return createErrorResponse(
				new Error('Invalid signature'),
				'Invalid signature',
			) as HandleLinearWebhookResult;
		}
	}

	const eventType = parsedPayload.type;
	const action = parsedPayload.action;

	return createSuccessResponse({
		eventType,
		action,
		payload: parsedPayload,
	}) as HandleLinearWebhookResult;
}

