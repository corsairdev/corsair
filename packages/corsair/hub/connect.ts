import { CORSAIR_INTERNAL } from '../core';
import { encodeOAuthState, signState } from '../core/auth/state';
import { formatProviderDisplayName } from '../core/constants';
import { generateOAuthUrl } from '../oauth';
import { getHubConfig, resolveHubOAuthCallbackUrl } from './config';
import type { HubConnectSessionInput, HubConnectSessionResult } from './types';

type HubCreateSessionErrorResponse = {
	error?: string;
	message?: string;
};

type ByoCreateSessionPayload = {
	plugin: string;
	tenantId: string;
	providerName: string;
	oauthUrl: string;
	state: string;
	deliveryUrl: string;
	source: HubConnectSessionInput['source'];
	oauthMode: 'byo';
};

type ManagedCreateSessionPayload = {
	plugin: string;
	tenantId: string;
	providerName?: string;
	state: string;
	deliveryUrl: string;
	source: HubConnectSessionInput['source'];
	oauthMode: 'managed';
};

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0;
}

function parseHubSessionPayload(payload: unknown): HubConnectSessionResult {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Hub API returned an empty connect session');
	}

	const session = payload as Record<string, unknown>;

	if (
		!isNonEmptyString(session.connectUrl) ||
		!isNonEmptyString(session.token) ||
		!isNonEmptyString(session.projectId)
	) {
		throw new Error(
			'Hub API returned an incomplete connect session (expected connectUrl, token, and projectId)',
		);
	}

	const result: HubConnectSessionResult = {
		connectUrl: session.connectUrl,
		token: session.token,
		projectId: session.projectId,
	};

	if (isNonEmptyString(session.expiresAt)) {
		result.expiresAt = session.expiresAt;
	}

	return result;
}

function parseHubSessionError(payload: unknown, status: number): string {
	if (status === 404) {
		return 'Hub REST API not found at /connect/sessions. Check HUB_API_URL and ensure the Hub API is deployed.';
	}

	if (payload && typeof payload === 'object') {
		const direct = payload as HubCreateSessionErrorResponse;
		if (direct.error) return direct.error;
		if (direct.message) return direct.message;
	}

	return `Hub API returned HTTP ${status}`;
}

async function readHubJsonResponse(response: Response): Promise<unknown> {
	const contentType = response.headers.get('content-type') ?? '';
	const bodyText = await response.text();

	if (!bodyText) {
		return null;
	}

	if (
		!contentType.includes('application/json') &&
		bodyText.trimStart().startsWith('<')
	) {
		throw new Error(
			`Hub API returned HTML instead of JSON (HTTP ${response.status}). Check HUB_API_URL and deploy the latest hub API.`,
		);
	}

	try {
		return JSON.parse(bodyText) as unknown;
	} catch {
		throw new Error(`Hub API returned invalid JSON (HTTP ${response.status})`);
	}
}

function getInternalKek(corsair: unknown): string {
	const internal = (corsair as Record<symbol, unknown>)[CORSAIR_INTERNAL] as
		| { kek?: string }
		| undefined;
	if (!internal?.kek) {
		throw new Error(
			'Corsair KEK is required to create a managed connect session',
		);
	}
	return internal.kek;
}

export async function createHubConnectSession(
	corsair: unknown,
	input: HubConnectSessionInput,
): Promise<HubConnectSessionResult> {
	const hub = getHubConfig(corsair);
	const apiUrl = hub.apiUrl.replace(/\/$/, '');
	const oauthMode = input.oauthMode ?? 'byo';
	const providerName =
		input.providerName ?? formatProviderDisplayName(input.plugin);

	let payload: ByoCreateSessionPayload | ManagedCreateSessionPayload;

	if (oauthMode === 'managed') {
		const kek = getInternalKek(corsair);
		const state = signState(
			encodeOAuthState(input.plugin, input.tenantId),
			kek,
		);

		payload = {
			plugin: input.plugin,
			tenantId: input.tenantId,
			providerName,
			state,
			deliveryUrl: hub.deliveryUrl,
			source: input.source,
			oauthMode: 'managed',
		};
	} else {
		const oauthCallbackUrl = resolveHubOAuthCallbackUrl(hub);
		const { url: oauthUrl, state } = await generateOAuthUrl(
			corsair,
			input.plugin,
			{
				tenantId: input.tenantId,
				redirectUri: oauthCallbackUrl,
			},
		);

		payload = {
			plugin: input.plugin,
			tenantId: input.tenantId,
			providerName,
			oauthUrl,
			state,
			deliveryUrl: hub.deliveryUrl,
			source: input.source,
			oauthMode: 'byo',
		};
	}

	const response = await fetch(`${apiUrl}/connect/sessions`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${hub.projectApiKey}`,
		},
		body: JSON.stringify(payload),
	});

	const responsePayload = await readHubJsonResponse(response);

	if (!response.ok) {
		throw new Error(parseHubSessionError(responsePayload, response.status));
	}

	return parseHubSessionPayload(responsePayload);
}
