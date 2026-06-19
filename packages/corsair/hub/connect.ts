import { formatProviderDisplayName } from '../core/constants';
import { generateOAuthUrl } from '../oauth';
import { getHubConfig, resolveHubOAuthCallbackUrl } from './config';
import type { HubConnectSessionInput, HubConnectSessionResult } from './types';

type HubCreateSessionErrorResponse = {
	error?: string;
	message?: string;
};

type CreateSessionPayload = {
	plugin: string;
	tenantId: string;
	providerName: string;
	oauthUrl: string;
	state: string;
	deliveryUrl: string;
	source: HubConnectSessionInput['source'];
};

function parseHubSessionPayload(payload: unknown): HubConnectSessionResult {
	if (
		payload &&
		typeof payload === 'object' &&
		'connectUrl' in payload &&
		typeof payload.connectUrl === 'string'
	) {
		return payload as HubConnectSessionResult;
	}

	throw new Error('Hub API returned an empty connect session');
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

export async function createHubConnectSession(
	corsair: unknown,
	input: HubConnectSessionInput,
): Promise<HubConnectSessionResult> {
	const hub = getHubConfig(corsair);
	const apiUrl = hub.apiUrl.replace(/\/$/, '');
	const oauthCallbackUrl = resolveHubOAuthCallbackUrl(hub);

	const { url: oauthUrl, state } = await generateOAuthUrl(
		corsair,
		input.plugin,
		{
			tenantId: input.tenantId,
			redirectUri: oauthCallbackUrl,
		},
	);

	const payload: CreateSessionPayload = {
		plugin: input.plugin,
		tenantId: input.tenantId,
		providerName: input.providerName ?? formatProviderDisplayName(input.plugin),
		oauthUrl,
		state,
		deliveryUrl: hub.deliveryUrl,
		source: input.source,
	};

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
