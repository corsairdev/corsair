export const APALEO_API_BASE = 'https://api.apaleo.com';
export const APALEO_AUTH_URL = 'https://identity.apaleo.com/connect/authorize';
export const APALEO_TOKEN_URL = 'https://identity.apaleo.com/connect/token';

export class ApaleoAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ApaleoAPIError';
	}
}

export class ApaleoOAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApaleoOAuthError';
	}
}

export type ApaleoTokenResult = {
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
	refreshed: boolean;
};

async function requestApaleoToken(params: {
	clientId: string;
	clientSecret: string;
	grantType: 'client_credentials' | 'refresh_token';
	refreshToken?: string;
}): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}> {
	const body = new URLSearchParams({ grant_type: params.grantType });
	if (params.grantType === 'refresh_token' && params.refreshToken) {
		body.set('refresh_token', params.refreshToken);
	}
	const response = await fetch(APALEO_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization:
				'Basic ' +
				Buffer.from(params.clientId + ':' + params.clientSecret).toString(
					'base64',
				),
		},
		body,
	});
	const json = (await response.json()) as {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
		error?: string;
		error_description?: string;
	};
	if (
		!response.ok ||
		!json.access_token ||
		typeof json.expires_in !== 'number'
	) {
		throw new ApaleoOAuthError(
			json.error_description ||
				json.error ||
				`Failed to obtain Apaleo access token (${response.status})`,
		);
	}
	return {
		access_token: json.access_token,
		refresh_token: json.refresh_token,
		expires_in: json.expires_in,
	};
}

/**
 * Client-credentials grant (simple client) or refresh_token grant (connect client).
 * https://apaleo.dev/guides/oauth-connection/simple-client.html
 */
export async function getValidApaleoAccessToken({
	accessToken,
	expiresAt,
	refreshToken,
	clientId,
	clientSecret,
	forceRefresh = false,
}: {
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken?: string | null;
	clientId?: string | null;
	clientSecret?: string | null;
	forceRefresh?: boolean;
}): Promise<ApaleoTokenResult> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;
	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return {
			accessToken,
			refreshToken: refreshToken ?? undefined,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}
	if (!clientId || !clientSecret) {
		throw new ApaleoOAuthError(
			'Apaleo client_id and client_secret are required',
		);
	}
	const token = await requestApaleoToken(
		refreshToken
			? {
					clientId,
					clientSecret,
					grantType: 'refresh_token',
					refreshToken,
				}
			: { clientId, clientSecret, grantType: 'client_credentials' },
	);
	return {
		accessToken: token.access_token,
		refreshToken: token.refresh_token ?? refreshToken ?? undefined,
		expiresAt: now + token.expires_in,
		refreshed: true,
	};
}

function withQuery(endpoint: string, query?: Record<string, unknown>): string {
	const url = new URL(endpoint, APALEO_API_BASE);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) continue;
			if (Array.isArray(value)) {
				for (const item of value) url.searchParams.append(key, String(item));
			} else {
				url.searchParams.set(key, String(value));
			}
		}
	}
	return url.toString();
}

function retryAfterMs(response: Response): number | undefined {
	const header = response.headers.get('Retry-After');
	if (!header) return undefined;
	const seconds = Number.parseInt(header, 10);
	return Number.isFinite(seconds) ? seconds * 1000 : undefined;
}

export async function makeApaleoRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
		body?: unknown;
		query?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const response = await fetch(withQuery(endpoint, query), {
		method,
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
			...(method === 'POST' || method === 'PUT' || method === 'PATCH'
				? { 'Content-Type': 'application/json' }
				: {}),
		},
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? JSON.stringify(body)
				: undefined,
	});

	const contentType = response.headers.get('Content-Type') ?? '';
	let parsed: unknown;
	if (response.status !== 204 && contentType.includes('application/json')) {
		try {
			parsed = await response.json();
		} catch {
			parsed = undefined;
		}
	}

	if (!response.ok) {
		throw new ApaleoAPIError(
			typeof parsed === 'object' && parsed && 'message' in parsed
				? String((parsed as { message: unknown }).message)
				: `${response.status} ${response.statusText}`.trim(),
			response.status,
			parsed,
			retryAfterMs(response),
		);
	}

	return parsed as T;
}

export async function apaleoResourceExists(
	endpoint: string,
	accessToken: string,
): Promise<boolean> {
	try {
		await makeApaleoRequest(endpoint, accessToken, { method: 'HEAD' });
		return true;
	} catch (error) {
		if (error instanceof ApaleoAPIError && error.status === 404) return false;
		throw error;
	}
}
