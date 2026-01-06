import {
	createErrorResponse,
	createSuccessResponse,
	type BaseOperationParams,
} from '../../base';
import type {
	GmailClient,
	GmailPlugin,
	GmailPluginContext,
} from '../types';

export type GmailWebhookEventName =
	| 'history'
	| 'messageReceived'
	| 'messageDeleted'
	| 'messageLabelChanged';

export interface PubSubNotification {
	message?: {
		data?: string;
		messageId?: string;
		publishTime?: string;
	};
	subscription?: string;
}

export interface GmailPushNotification {
	emailAddress: string;
	historyId: string;
}

export interface HandleGmailWebhookParams extends BaseOperationParams<GmailPlugin, GmailClient, GmailPluginContext> {
	payload: string | PubSubNotification;
	userId?: string;
}

export interface HandleGmailWebhookResult {
	success: boolean;
	eventType?: GmailWebhookEventName;
	historyId?: string;
	error?: string;
}

export async function handleGmailWebhook(
	params: HandleGmailWebhookParams,
): Promise<HandleGmailWebhookResult> {
	const { payload } = params;

	try {
		let notification: PubSubNotification;
		if (typeof payload === 'string') {
			notification = JSON.parse(payload);
		} else {
			notification = payload;
		}

		if (!notification.message?.data) {
			return createErrorResponse(
				new Error('No message data in notification'),
				'No message data in notification',
			) as HandleGmailWebhookResult;
		}

		const decodedData = Buffer.from(
			notification.message.data,
			'base64',
		).toString('utf-8');
		const pushNotification: GmailPushNotification = JSON.parse(decodedData);

		if (!pushNotification.historyId || !pushNotification.emailAddress) {
			return createErrorResponse(
				new Error('Invalid push notification format'),
				'Invalid push notification format',
			) as HandleGmailWebhookResult;
		}

		return createSuccessResponse({
			eventType: 'history',
			historyId: pushNotification.historyId,
			emailAddress: pushNotification.emailAddress,
		}) as HandleGmailWebhookResult;
	} catch (error) {
		return createErrorResponse(
			error,
			error instanceof Error ? error.message : 'Unknown error',
		) as HandleGmailWebhookResult;
	}
}

