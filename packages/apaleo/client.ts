export const APALEO_API_BASE = 'https://api.apaleo.com';
export const APALEO_AUTH_URL = 'https://identity.apaleo.com/connect/authorize';
export const APALEO_TOKEN_URL = 'https://identity.apaleo.com/connect/token';

export class ApaleoAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		// unknown: Apaleo error JSON is not a single schema (message vs messages)
		public readonly body?: unknown,
		// milliseconds; Retry-After seconds are converted in retryAfterMs()
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
	let response: Response;
	try {
		response = await fetch(APALEO_TOKEN_URL, {
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
			signal: AbortSignal.timeout(20_000),
		});
	} catch (error) {
		throw new ApaleoOAuthError(
			error instanceof Error
				? error.message
				: 'Failed to obtain Apaleo access token',
		);
	}
	let json: {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
		error?: string;
		error_description?: string;
	} = {};
	try {
		const text = await response.text();
		if (text) json = JSON.parse(text) as typeof json;
	} catch {
		throw new ApaleoOAuthError(
			`Failed to obtain Apaleo access token (${response.status})`,
		);
	}
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
	let token: Awaited<ReturnType<typeof requestApaleoToken>>;
	if (refreshToken) {
		try {
			token = await requestApaleoToken({
				clientId,
				clientSecret,
				grantType: 'refresh_token',
				refreshToken,
			});
		} catch {
			token = await requestApaleoToken({
				clientId,
				clientSecret,
				grantType: 'client_credentials',
			});
		}
	} else {
		token = await requestApaleoToken({
			clientId,
			clientSecret,
			grantType: 'client_credentials',
		});
	}
	return {
		accessToken: token.access_token,
		refreshToken: token.refresh_token ?? refreshToken ?? undefined,
		expiresAt: now + token.expires_in,
		refreshed: true,
	};
}

function withQuery(endpoint: string, query?: object): string {
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

// unknown: error JSON is untyped until we check for a string message
function errorMessage(parsed: unknown, fallback: string): string {
	if (
		parsed &&
		typeof parsed === 'object' &&
		'message' in parsed &&
		typeof parsed.message === 'string'
	) {
		return parsed.message;
	}
	return fallback;
}

function retryAfterMs(response: Response): number | undefined {
	const header = response.headers.get('Retry-After');
	if (!header) return undefined;
	const seconds = Number.parseInt(header, 10);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(header);
	if (Number.isNaN(at)) return undefined;
	return Math.max(0, at - Date.now());
}

// unknown: JSON is untyped until the endpoint zod schema parses it
export async function makeApaleoRequest<T = unknown>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
		body?: object;
		query?: object;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 20_000);
	let response: Response;
	try {
		response = await fetch(withQuery(endpoint, query), {
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
			signal: controller.signal,
		});
	} catch (error) {
		throw new ApaleoAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	} finally {
		clearTimeout(timer);
	}

	const contentType = response.headers.get('Content-Type') ?? '';
	// unknown: fetch JSON is untyped; callers parse with zod
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
			errorMessage(parsed, `${response.status} ${response.statusText}`.trim()),
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
