import { AuthMissingError } from 'corsair/core';

export class JumpCloudAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'JumpCloudAPIError';
	}
}

// JumpCloud runs two documented API generations off the same console origin:
// API 1.0 (users, systems, commands, applications, organizations) and API 2.0
// (groups, policies, per-system associations). Each operation states its
// generation in the endpoints map and the client routes accordingly.
const API_V1_BASE = 'https://console.jumpcloud.com/api';
const API_V2_BASE = 'https://console.jumpcloud.com/api/v2';

const REQUEST_TIMEOUT_MS = 60_000;

export type JumpCloudApiVersion = 1 | 2;

function baseFor(version: JumpCloudApiVersion): string {
	return version === 2 ? API_V2_BASE : API_V1_BASE;
}

function parseRetryAfter(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	return Number.isNaN(seconds) ? undefined : seconds * 1000;
}

export async function makeJumpCloudRequest<T>(
	apiKey: string,
	version: JumpCloudApiVersion,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	path: string,
	options: {
		query?: Record<
			string,
			string | number | boolean | (string | number)[] | undefined
		>;
		// unknown: each endpoint's input schema has already validated its request
		// body with Zod, and every operation's body shape differs, so the client
		// only serializes the validated value here.
		body?: unknown;
	} = {},
): Promise<T> {
	if (!apiKey) {
		throw new AuthMissingError('jumpcloud', 'api_key');
	}

	const url = new URL(baseFor(version) + path);
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (value === undefined) continue;
		// Array-valued query parameters serialize as repeated keys, matching the
		// repeated-parameter form JumpCloud documents for fields/filter/sort.
		if (Array.isArray(value)) {
			for (const item of value) url.searchParams.append(key, String(item));
			continue;
		}
		url.searchParams.set(key, String(value));
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'x-api-key': apiKey,
	};
	if (options.body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method,
			headers,
			body:
				options.body === undefined ? undefined : JSON.stringify(options.body),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch {
		throw new JumpCloudAPIError('Failed to reach the JumpCloud API');
	}

	if (!response.ok) {
		// Provider response bodies and reason phrases can echo customer data;
		// retain only the status and rate-limit metadata.
		throw new JumpCloudAPIError(
			`JumpCloud API returned ${response.status}`,
			undefined,
			response.status,
			parseRetryAfter(response.headers.get('retry-after')),
		);
	}

	// Ops the API documents without a JSON body (password set, MFA enforce and
	// sync) return an empty 2xx body; callers model those outputs as void.
	if (response.status === 204) {
		return undefined as T;
	}
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.includes('application/json')) {
		return undefined as T;
	}
	return (await response.json()) as T;
}
