import { processOAuthCallback } from '../oauth';
import type { ProcessCorsairRequest } from '../tunnel';
import {
	applyPermissionDecision,
	isAuthCredentialsBrowserDelivery,
	isByoOAuthBrowserDelivery,
	isConnectStatusBrowserDelivery,
	isManagedBrowserDelivery,
	isPermissionBrowserDelivery,
	processCorsair,
	verifyBrowserDeliveryToken,
} from '../tunnel';
import { getHubConfig, HubNotConfiguredError } from './config';
import { processAuthCredentialsDelivery } from './credentials-delivery';
import { getConnectStatusForTenant } from './connect-status';
import { buildClientBridgePostMessageHtml } from './browser-delivery-html';
import {
	BROWSER_DELIVERY_TTL_MS,
} from './contracts/tunnel';
import {
	applyHubBrowserDeliveryCors,
	resolveHubBrowserDeliveryCorsHeaders,
} from './delivery-browser-cors';
import {
	consumeDeliveryReplayKey,
} from './internal/delivery-replay-guard';
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

export type HubDeliveryRequest = {
	method: 'GET' | 'POST';
	url: string;
	headers: ProcessCorsairRequest['headers'];
	body?: string;
};

function buildBrowserDeliveryReturnUrl(
	hubSuccessUrl: string,
	input: { status?: unknown; error?: string; connectedPlugin?: string },
): string {
	const url = new URL(hubSuccessUrl);
	if (input.error) {
		url.searchParams.set('error', input.error);
		return url.toString();
	}
	if (input.connectedPlugin) {
		url.searchParams.set('connected', input.connectedPlugin);
		return url.toString();
	}
	if (input.status !== undefined) {
		url.searchParams.set(
			'status',
			Buffer.from(JSON.stringify(input.status)).toString('base64url'),
		);
	}
	return url.toString();
}

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

	const replayCheck = consumeDeliveryReplayKey(
		`browser:${payload.jti}`,
		BROWSER_DELIVERY_TTL_MS,
	);
	if (!replayCheck.ok) {
		return {
			type: 'json',
			status: 400,
			body: { error: replayCheck.error },
		};
	}

	try {
		if (isConnectStatusBrowserDelivery(payload)) {
			if (!payload.hubSuccessUrl) {
				return {
					type: 'json',
					status: 400,
					body: { error: 'Connect status delivery missing hubSuccessUrl' },
				};
			}

			const tenantId = payload.tenantId?.trim() || 'default';
			const status = await getConnectStatusForTenant(corsair, tenantId, {
				pluginIds: payload.statusPlugins,
			});

			return {
				type: 'redirect',
				url: buildBrowserDeliveryReturnUrl(payload.hubSuccessUrl, {
					status,
				}),
			};
		}

		if (isAuthCredentialsBrowserDelivery(payload)) {
			if (!payload.hubSuccessUrl) {
				return {
					type: 'json',
					status: 400,
					body: { error: 'Credential delivery missing hubSuccessUrl' },
				};
			}

			if (!payload.credentials) {
				return {
					type: 'redirect',
					url: buildBrowserDeliveryReturnUrl(payload.hubSuccessUrl, {
						error: 'Credential delivery missing credentials',
					}),
				};
			}

			await processAuthCredentialsDelivery(corsair, {
				plugin: payload.plugin,
				tenantId: payload.tenantId,
				credentials: payload.credentials,
			});

			return {
				type: 'redirect',
				url: buildBrowserDeliveryReturnUrl(payload.hubSuccessUrl, {
					connectedPlugin: payload.plugin,
				}),
			};
		}

		if (isPermissionBrowserDelivery(payload)) {
			if (!payload.permissionToken) {
				return {
					type: 'json',
					status: 400,
					body: { error: 'Permission delivery missing permission token' },
				};
			}
			await applyPermissionDecision(
				corsair,
				payload.permissionToken,
				payload.deliveryMode === 'permission.approve' ? 'approved' : 'denied',
			);
		} else if (isManagedBrowserDelivery(payload)) {
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
			if (
				!isByoOAuthBrowserDelivery(payload) ||
				!payload.code ||
				!payload.state ||
				!payload.redirectUri
			) {
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
			error instanceof Error ? error.message : 'Hub delivery failed';

		if (
			(isConnectStatusBrowserDelivery(payload) ||
				isAuthCredentialsBrowserDelivery(payload)) &&
			payload.hubSuccessUrl
		) {
			return {
				type: 'redirect',
				url: buildBrowserDeliveryReturnUrl(payload.hubSuccessUrl, {
					error: message,
				}),
			};
		}

		if (
			(isConnectStatusBrowserDelivery(payload) ||
				isAuthCredentialsBrowserDelivery(payload)) &&
			payload.hubOrigin &&
			payload.requestId
		) {
			return {
				type: 'text',
				status: 400,
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
				body: buildClientBridgePostMessageHtml({
					hubOrigin: payload.hubOrigin,
					requestId: payload.requestId,
					ok: false,
					error: message,
				}),
			};
		}

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

export function hubDeliveryToResponse(result: HubDeliveryResult): Response {
	if (result.type === 'redirect') {
		return Response.redirect(result.url, 302);
	}

	const headers = new Headers();
	for (const [key, value] of Object.entries(result.headers ?? {})) {
		if (typeof value === 'string') {
			headers.set(key, value);
		}
	}

	if (result.type === 'json') {
		return Response.json(result.body, {
			status: result.status,
			headers,
		});
	}

	return new Response(result.body, {
		status: result.status,
		headers,
	});
}

export async function handleHubDeliveryRequest(
	corsair: unknown,
	request: HubDeliveryRequest,
): Promise<HubDeliveryResult> {
	if (request.method === 'GET') {
		return handleHubDeliveryGet(corsair, request.url);
	}

	return handleHubDeliveryPost(corsair, {
		headers: request.headers,
		body: request.body ?? '',
	});
}

export async function respondToHubDelivery(
	corsair: unknown,
	request: HubDeliveryRequest,
): Promise<Response> {
	try {
		const result = await handleHubDeliveryRequest(corsair, request);
		return hubDeliveryToResponse(result);
	} catch (error) {
		if (error instanceof HubNotConfiguredError) {
			return Response.json({ error: error.message }, { status: 503 });
		}
		throw error;
	}
}

export async function respondToHubDeliveryFromRequest(
	corsair: unknown,
	request: Request,
): Promise<Response> {
	const method = request.method.toUpperCase();
	const corsHeaders = resolveHubBrowserDeliveryCorsHeaders(
		request.headers.get('origin'),
	);

	if (method === 'OPTIONS') {
		if (!corsHeaders) {
			return Response.json({ error: 'Method not allowed' }, { status: 405 });
		}
		return new Response(null, { status: 204, headers: corsHeaders });
	}

	if (method !== 'GET' && method !== 'POST') {
		return Response.json({ error: 'Method not allowed' }, { status: 405 });
	}

	const response = await respondToHubDelivery(corsair, {
		method,
		url: request.url,
		headers: request.headers,
		body: method === 'POST' ? await request.text() : undefined,
	});

	return applyHubBrowserDeliveryCors(response, corsHeaders);
}
