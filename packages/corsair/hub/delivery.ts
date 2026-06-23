import { processOAuthCallback } from '../oauth';
import type { ProcessCorsairRequest } from '../tunnel';
import {
	isManagedBrowserDelivery,
	processCorsair,
	verifyBrowserDeliveryToken,
} from '../tunnel';
import { getHubConfig } from './config';
import { processManagedOAuthDelivery } from './managed-oauth';

export type HubDeliveryResult =
	| { type: 'redirect'; url: string }
	| {
			type: 'json';
			body: unknown;
			status: number;
			headers?: Record<string, string>;
	  }
	| {
			type: 'text';
			body: string | null;
			status: number;
			headers?: Record<string, string>;
	  };

export async function handleHubDeliveryGet(
	corsair: unknown,
	requestUrl: string,
): Promise<HubDeliveryResult> {
	const hub = getHubConfig(corsair);
	const url = new URL(requestUrl);
	const token = url.searchParams.get('d');

	if (!token) {
		return {
			type: 'json',
			status: 200,
			body: {
				status: 'ok',
				message: 'Corsair tunnel endpoint is active',
				timestamp: new Date().toISOString(),
			},
		};
	}

	const payload = verifyBrowserDeliveryToken(token, hub.signingSecret);
	if (!payload) {
		return {
			type: 'json',
			status: 400,
			body: { error: 'Invalid or expired delivery token' },
		};
	}

	try {
		if (isManagedBrowserDelivery(payload)) {
			if (!payload.accessToken) {
				return {
					type: 'json',
					status: 400,
					body: { error: 'Managed OAuth delivery missing access_token' },
				};
			}
			await processManagedOAuthDelivery(corsair, {
				plugin: payload.plugin,
				tenantId: payload.tenantId,
				accessToken: payload.accessToken,
				refreshToken: payload.refreshToken,
				expiresIn: payload.expiresIn,
				scope: payload.scope,
			});
		} else {
			if (!payload.code || !payload.state || !payload.redirectUri) {
				return {
					type: 'json',
					status: 400,
					body: { error: 'Invalid BYO OAuth delivery token' },
				};
			}
			await processOAuthCallback(corsair, {
				code: payload.code,
				state: payload.state,
				redirectUri: payload.redirectUri,
			});
		}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'OAuth callback failed';
		return {
			type: 'json',
			status: 400,
			body: { error: message },
		};
	}

	return { type: 'redirect', url: payload.hubSuccessUrl };
}

export async function handleHubDeliveryPost(
	corsair: unknown,
	request: ProcessCorsairRequest,
): Promise<HubDeliveryResult> {
	const hub = getHubConfig(corsair);
	const ack = await processCorsair(corsair, request, {
		signingSecret: hub.signingSecret,
	});

	if (ack.status !== 'ok') {
		return {
			type: 'json',
			status: ack.retryable === false ? 400 : 502,
			body: { error: ack.error ?? 'Tunnel processing failed' },
		};
	}

	const webhookResponse = ack.webhookResponse;
	if (!webhookResponse) {
		return {
			type: 'json',
			status: 200,
			body: { status: 'ok' },
		};
	}

	const status = webhookResponse.status ?? 200;
	const headers = webhookResponse.headers;

	if (
		webhookResponse.body &&
		typeof webhookResponse.body === 'object' &&
		!(webhookResponse.body instanceof ArrayBuffer)
	) {
		return {
			type: 'json',
			status,
			body: webhookResponse.body,
			headers,
		};
	}

	return {
		type: 'text',
		status,
		body:
			typeof webhookResponse.body === 'string'
				? webhookResponse.body
				: webhookResponse.body
					? JSON.stringify(webhookResponse.body)
					: null,
		headers,
	};
}
