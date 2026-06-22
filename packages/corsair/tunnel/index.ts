import { createHmac, timingSafeEqual } from 'node:crypto';
import type { CorsairInternalConfig } from '../core';
import { CORSAIR_INTERNAL } from '../core';
import { processOAuthCallback } from '../oauth';
import { processWebhook } from '../webhooks';
import {
	resolveAccountFromWebhookLink,
	resolveTenantFromWebhookLink,
	resolveTenantIdFromWebhookLink,
	setWebhookTenantLink,
} from '../webhooks/tenant-links';

export {
	resolveAccountFromWebhookLink,
	resolveTenantFromWebhookLink,
	resolveTenantIdFromWebhookLink,
	setWebhookTenantLink,
};

export {
	type BrowserDeliveryPayload,
	verifyBrowserDeliveryToken,
} from './browser-delivery';

export type TunnelType =
	| 'oauth.callback'
	| 'webhook'
	| 'permission.approve'
	| 'permission.deny'
	| 'auth.credentials'
	| 'run';

export type TunnelEnvelope<TPayload = unknown> = {
	type: TunnelType;
	payload: TPayload;
};

export type TunnelAck = {
	status: 'ok' | 'failed';
	retryable?: boolean;
	error?: string;
	webhookResponse?: {
		status?: number;
		body?: unknown;
		headers?: Record<string, string>;
	};
};

export type WebhookTunnelPayload = {
	headers: Record<string, string>;
	body: string;
	bodyBase64?: string;
	bodyEncoding?: string;
	query?: Record<string, string | string[] | undefined>;
	plugin?: string;
	linkType?: string;
	externalId?: string;
	tenantId?: string;
};

export type OAuthCallbackTunnelPayload = {
	code: string;
	state: string;
	redirectUri: string;
};

export type ProcessCorsairRequest = {
	headers: Headers | Record<string, string | string[] | undefined>;
	body: string;
};

function getInternal(corsair: unknown): CorsairInternalConfig {
	const internal = (corsair as Record<symbol, unknown>)[CORSAIR_INTERNAL] as
		| CorsairInternalConfig
		| undefined;
	if (!internal) {
		throw new Error('Invalid corsair instance');
	}
	return internal;
}

function normalizeHeader(
	headers: ProcessCorsairRequest['headers'],
	name: string,
): string | undefined {
	if (headers instanceof Headers) {
		return headers.get(name) ?? undefined;
	}
	const value = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(value)) return value[0];
	return typeof value === 'string' ? value : undefined;
}

function parseSignatureHeader(value: string | undefined): string | undefined {
	if (!value) return undefined;
	return value.startsWith('sha256=') ? value.slice('sha256='.length) : value;
}

function verifyTunnelSignature(
	body: string,
	signature: string | undefined,
	signingSecret: string,
): boolean {
	if (!signingSecret.trim() || !signature) return false;

	const expected = createHmac('sha256', signingSecret.trim())
		.update(body)
		.digest('hex');

	try {
		return timingSafeEqual(
			Buffer.from(expected, 'utf8'),
			Buffer.from(signature, 'utf8'),
		);
	} catch {
		return false;
	}
}

async function resolveWebhookTenantId(
	corsair: unknown,
	internal: CorsairInternalConfig,
	payload: WebhookTunnelPayload,
): Promise<string | undefined> {
	const explicitTenantId =
		typeof payload.tenantId === 'string'
			? payload.tenantId
			: typeof payload.query?.tenantId === 'string'
				? payload.query.tenantId
				: undefined;

	if (explicitTenantId) return explicitTenantId;

	if (
		!internal.database ||
		!payload.plugin ||
		!payload.linkType ||
		!payload.externalId
	) {
		return undefined;
	}

	const resolved = await resolveTenantIdFromWebhookLink({
		database: internal.database,
		kek: internal.kek,
		pluginId: payload.plugin,
		linkType: payload.linkType,
		externalId: payload.externalId,
	});

	return resolved ?? undefined;
}

async function handleWebhookTunnel(
	corsair: unknown,
	internal: CorsairInternalConfig,
	payload: WebhookTunnelPayload,
): Promise<TunnelAck> {
	const tenantId = await resolveWebhookTenantId(corsair, internal, payload);
	const query = {
		...(payload.query ?? {}),
		...(tenantId ? { tenantId } : {}),
	};

	const result = await processWebhook(
		corsair as Parameters<typeof processWebhook>[0],
		payload.headers,
		payload.body,
		query,
	);

	if (!result.plugin) {
		return {
			status: 'failed',
			retryable: false,
			error: 'No matching webhook handler found',
		};
	}

	if (result.response && result.response.success === false) {
		return {
			status: 'failed',
			retryable: false,
			error:
				typeof result.response.error === 'string'
					? result.response.error
					: 'Webhook handler failed',
		};
	}

	const returnToSender = result.response?.returnToSender;
	const responseBody =
		returnToSender &&
		typeof returnToSender === 'object' &&
		typeof returnToSender.validationToken === 'string' &&
		Object.keys(returnToSender).length === 1
			? returnToSender.validationToken
			: returnToSender
				? returnToSender
				: (result.response?.data ?? result.response);

	return {
		status: 'ok',
		webhookResponse: {
			status: result.response?.statusCode ?? 200,
			body: responseBody,
			headers: result.responseHeaders,
		},
	};
}

async function handleOAuthCallbackTunnel(
	corsair: unknown,
	payload: OAuthCallbackTunnelPayload,
): Promise<TunnelAck> {
	await processOAuthCallback(corsair, payload);
	return { status: 'ok' };
}

export type ProcessCorsairOptions = {
	/** HMAC signing secret shared with the tunnel relay. Required unless allowUnsignedTunnel is true. */
	signingSecret?: string;
	/** Local development only. Skips signature verification when signingSecret is omitted. */
	allowUnsignedTunnel?: boolean;
};

export async function processCorsair(
	corsair: unknown,
	request: ProcessCorsairRequest,
	options: ProcessCorsairOptions = {},
): Promise<TunnelAck> {
	const internal = getInternal(corsair);
	const signature = parseSignatureHeader(
		normalizeHeader(request.headers, 'x-corsair-signature'),
	);

	if (!options.signingSecret?.trim()) {
		if (!options.allowUnsignedTunnel) {
			return {
				status: 'failed',
				retryable: false,
				error: 'Tunnel signing secret is required',
			};
		}
	} else {
		const valid = verifyTunnelSignature(
			request.body,
			signature,
			options.signingSecret,
		);
		if (!valid) {
			return {
				status: 'failed',
				retryable: false,
				error: 'Invalid tunnel signature',
			};
		}
	}

	let envelope: TunnelEnvelope;
	try {
		envelope = JSON.parse(request.body) as TunnelEnvelope;
	} catch {
		return {
			status: 'failed',
			retryable: false,
			error: 'Invalid tunnel envelope JSON',
		};
	}

	switch (envelope.type) {
		case 'webhook':
			return handleWebhookTunnel(
				corsair,
				internal,
				envelope.payload as WebhookTunnelPayload,
			);
		case 'oauth.callback':
			return handleOAuthCallbackTunnel(
				corsair,
				envelope.payload as OAuthCallbackTunnelPayload,
			);
		default:
			return {
				status: 'failed',
				retryable: false,
				error: `Unsupported tunnel type: ${envelope.type}`,
			};
	}
}
