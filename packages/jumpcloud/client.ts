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
//
// Each organization lives in one region, and its API key only works on that
// region's console host (docs.jumpcloud.com/api/1.0/index.yaml `servers`).
// The region is read from the plugin option or the connected account's stored
// `region` field and only ever used as a key into this map, so no caller text
// reaches the request host.
export const JUMPCLOUD_REGION_ORIGINS = {
	us: 'https://console.jumpcloud.com',
	eu: 'https://console.eu.jumpcloud.com',
	in: 'https://console.in.jumpcloud.com',
} as const;

export type JumpCloudRegion = keyof typeof JUMPCLOUD_REGION_ORIGINS;

const JUMPCLOUD_REGIONS = Object.keys(
	JUMPCLOUD_REGION_ORIGINS,
) as JumpCloudRegion[];

const REQUEST_TIMEOUT_MS = 60_000;

export type JumpCloudApiVersion = 1 | 2;

/**
 * What a request needs from the endpoint context: the key the binder resolved,
 * plus the optional region and multi-tenant organization ID, from the plugin
 * options or the connected account's stored `region` / `org_id` fields.
 * A bare string is accepted as the key alone (US region, no organization).
 */
export type JumpCloudRequestContext =
	| string
	| {
			key: string;
			options?: { region?: string; orgId?: string };
			keys?: {
				get_region?: () => Promise<string | null | undefined>;
				get_org_id?: () => Promise<string | null | undefined>;
			};
	  };

// A tenant with no account row has no DEK, so the key manager throws instead
// of returning null; that case means "nothing stored" and falls back to the
// default. Anything else rethrows untouched.
async function readStoredField(
	read: (() => Promise<string | null | undefined>) | undefined,
): Promise<string | null | undefined> {
	try {
		return await read?.();
	} catch (error) {
		if (error instanceof Error && /no dek found/i.test(error.message)) {
			return null;
		}
		throw error;
	}
}

export async function resolveJumpCloudRegion(
	ctx: JumpCloudRequestContext,
): Promise<JumpCloudRegion> {
	if (typeof ctx === 'string') return 'us';
	const configured =
		ctx.options?.region ?? (await readStoredField(ctx.keys?.get_region));
	// People paste the console host as often as the region code, so
	// `https://console.eu.jumpcloud.com` reads as `eu`.
	const region = (configured ?? '')
		.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/\/+$/, '')
		.replace(/^console\.jumpcloud\.com$/, 'us')
		.replace(/^console\.([a-z]+)\.jumpcloud\.com$/, '$1');
	if (region === '') return 'us';
	if (!Object.hasOwn(JUMPCLOUD_REGION_ORIGINS, region)) {
		throw new JumpCloudAPIError(
			`Unsupported JumpCloud region. Use one of ${JUMPCLOUD_REGIONS.join(', ')}`,
			'INVALID_REGION',
		);
	}
	return region as JumpCloudRegion;
}

// Organization IDs are 24-character hex ObjectIDs. Checking the shape keeps a
// malformed stored value from being sent as a header.
const ORG_ID_PATTERN = /^[a-f0-9]{24}$/i;

export async function resolveJumpCloudOrgId(
	ctx: JumpCloudRequestContext,
): Promise<string | undefined> {
	if (typeof ctx === 'string') return undefined;
	const configured =
		ctx.options?.orgId ?? (await readStoredField(ctx.keys?.get_org_id));
	const orgId = (configured ?? '').trim();
	if (orgId === '') return undefined;
	if (!ORG_ID_PATTERN.test(orgId)) {
		throw new JumpCloudAPIError(
			'The JumpCloud organization ID must be a 24-character hex ID',
			'INVALID_ORG_ID',
		);
	}
	return orgId;
}

function baseFor(
	region: JumpCloudRegion,
	version: JumpCloudApiVersion,
): string {
	const origin = JUMPCLOUD_REGION_ORIGINS[region];
	return version === 2 ? `${origin}/api/v2` : `${origin}/api`;
}

function parseRetryAfter(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	return Number.isNaN(seconds) ? undefined : seconds * 1000;
}

export async function makeJumpCloudRequest<T>(
	ctx: JumpCloudRequestContext,
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
	const apiKey = typeof ctx === 'string' ? ctx : ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('jumpcloud', 'api_key');
	}
	const region = await resolveJumpCloudRegion(ctx);
	const orgId = await resolveJumpCloudOrgId(ctx);

	const url = new URL(baseFor(region, version) + path);
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
	// Multi-tenant (MSP) admins pick the organization each call acts on.
	if (orgId) {
		headers['x-org-id'] = orgId;
	}
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
		// The body is never read on failure, so release it: an unread body keeps
		// its connection busy until garbage collection.
		await response.body?.cancel().catch(() => undefined);
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
	const text = await response.text();
	// unlock, expire and resetmfa document a bare string body (JSON or
	// text/plain); others send an empty 200. Empty means no body.
	if (text === '') {
		return undefined as T;
	}
	if (!contentType.includes('application/json')) {
		return text as T;
	}
	return JSON.parse(text) as T;
}
