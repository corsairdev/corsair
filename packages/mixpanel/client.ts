import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type MixpanelRegion = 'us' | 'eu' | 'in';

export const MIXPANEL_REGIONS: readonly MixpanelRegion[] = ['us', 'eu', 'in'];

/**
 * Mixpanel serves its APIs from different hosts, one set per data residency
 * region (https://docs.mixpanel.com/reference/overview and the `servers` of
 * each OpenAPI file in github.com/mixpanel/docs/openapi):
 *
 * - ingestion (import, track, engage, groups, lookup tables, flags):
 *   api / api-eu / api-in .mixpanel.com
 * - query (reports, engage query, JQL): mixpanel.com / eu. / in. + /api/query
 * - app (annotations, Lexicon, service accounts, GDPR, feature flags,
 *   experiments, warehouse imports): mixpanel.com / eu. / in. + /api/app
 * - data (raw export, data pipelines): data / data-eu / data-in + /api/2.0
 * - platform (data definitions, audit logs): platform-us / -eu / -in
 */
export type MixpanelService =
	| 'ingestion'
	| 'query'
	| 'app'
	| 'data'
	| 'platform';

const HOSTS: Record<MixpanelService, Record<MixpanelRegion, string>> = {
	ingestion: {
		us: 'https://api.mixpanel.com',
		eu: 'https://api-eu.mixpanel.com',
		in: 'https://api-in.mixpanel.com',
	},
	query: {
		us: 'https://mixpanel.com/api/query',
		eu: 'https://eu.mixpanel.com/api/query',
		in: 'https://in.mixpanel.com/api/query',
	},
	app: {
		us: 'https://mixpanel.com/api/app',
		eu: 'https://eu.mixpanel.com/api/app',
		in: 'https://in.mixpanel.com/api/app',
	},
	data: {
		us: 'https://data.mixpanel.com/api/2.0',
		eu: 'https://data-eu.mixpanel.com/api/2.0',
		in: 'https://data-in.mixpanel.com/api/2.0',
	},
	platform: {
		us: 'https://platform-us.mixpanel.com',
		eu: 'https://platform-eu.mixpanel.com',
		in: 'https://platform-in.mixpanel.com',
	},
};

/** The base URL for one API in one region. */
export function mixpanelHost(
	service: MixpanelService,
	region: MixpanelRegion,
): string {
	return HOSTS[service][region];
}

/**
 * Everything one Mixpanel account needs, packed into the key the keyBuilder
 * returns, so endpoints read credentials from `ctx.key` only.
 *
 * - `username` / `secret`: the service account (HTTP Basic) for every API
 *   except the token-authenticated ingestion calls and GDPR.
 * - `projectId`: required by every service-account request.
 * - `projectToken`: the project token that `/track`, `/engage`, `/groups`,
 *   identity calls and the GDPR API carry in the payload or query.
 * - `gdprToken`: the OAuth token the GDPR API takes as a bearer token;
 *   service accounts get 401 "required scope(s)" there.
 */
export type MixpanelCredentials = {
	username: string;
	secret: string;
	projectId: number;
	region: MixpanelRegion;
	projectToken?: string;
	gdprToken?: string;
};

const KEY_PREFIX = 'mixpanel:v1:';

export function packMixpanelKey(credentials: MixpanelCredentials): string {
	return `${KEY_PREFIX}${JSON.stringify(credentials)}`;
}

export class MixpanelConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MixpanelConfigError';
	}
}

/** Reads the packed key; a malformed one fails before any request is sent. */
export function parseMixpanelKey(key: string | undefined): MixpanelCredentials {
	if (!key?.startsWith(KEY_PREFIX)) {
		throw new MixpanelConfigError(
			'Mixpanel credentials are missing: connect the account (service account username, secret and project id).',
		);
	}
	// unknown: parsed JSON, checked field by field below.
	let parsed: unknown;
	try {
		parsed = JSON.parse(key.slice(KEY_PREFIX.length));
	} catch {
		throw new MixpanelConfigError('Mixpanel credentials are not readable.');
	}
	const record = asRecord(parsed);
	const username = record?.username;
	const secret = record?.secret;
	const projectId = record?.projectId;
	const region = record?.region;
	if (
		typeof username !== 'string' ||
		typeof secret !== 'string' ||
		typeof projectId !== 'number' ||
		!MIXPANEL_REGIONS.includes(region as MixpanelRegion)
	) {
		throw new MixpanelConfigError('Mixpanel credentials are incomplete.');
	}
	return {
		username,
		secret,
		projectId,
		region: region as MixpanelRegion,
		projectToken:
			typeof record?.projectToken === 'string'
				? record.projectToken
				: undefined,
		gdprToken:
			typeof record?.gdprToken === 'string' ? record.gdprToken : undefined,
	};
}

/**
 * A stored project id must be the whole string of a positive integer: "42.5"
 * or "42oops" would otherwise parse as 42 and send requests to another
 * project.
 */
export function parseProjectId(
	value: string | number | null | undefined,
): number | undefined {
	if (value === null || value === undefined || value === '') return undefined;
	if (typeof value === 'number') {
		if (Number.isSafeInteger(value) && value > 0) return value;
		throw new MixpanelConfigError(
			'Mixpanel project_id must be a positive integer.',
		);
	}
	const trimmed = value.trim();
	if (!/^[1-9]\d*$/.test(trimmed) || !Number.isSafeInteger(Number(trimmed))) {
		throw new MixpanelConfigError(
			'Mixpanel project_id must be a positive integer.',
		);
	}
	return Number(trimmed);
}

/** Accepts us/eu/in in any case; empty means the default, `us`. */
export function parseRegion(
	value: string | null | undefined,
): MixpanelRegion | undefined {
	if (value === null || value === undefined || value.trim() === '') {
		return undefined;
	}
	const normalized = value.trim().toLowerCase();
	if (MIXPANEL_REGIONS.includes(normalized as MixpanelRegion)) {
		return normalized as MixpanelRegion;
	}
	throw new MixpanelConfigError('Mixpanel region must be one of us, eu or in.');
}

function base64(text: string): string {
	return btoa(text);
}

/**
 * - `service_account`: HTTP Basic with the service account, base64-encoded.
 *   Mixpanel answers 401 to the unencoded `username:secret` pair.
 * - `project_token`: HTTP Basic with the project token as the username, as
 *   the feature flag evaluation API takes it. `/track`, `/engage` and
 *   `/groups` carry the token in the payload instead and use `none`.
 * - `gdpr`: the GDPR API's OAuth bearer token.
 */
export type MixpanelAuth =
	| 'service_account'
	| 'project_token'
	| 'gdpr'
	| 'none';

export type MixpanelRequest = {
	service: MixpanelService;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	/** Arrays repeat the key (`type=a&type=b`). */
	query?: Record<
		string,
		string | number | boolean | readonly string[] | undefined
	>;
	/**
	 * A string body is sent verbatim with `mediaType` (the query API's forms,
	 * CSV lookup tables); anything else is serialized as JSON.
	 */
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	mediaType?: string;
	headers?: Record<string, string>;
	auth?: MixpanelAuth;
	/** `text` keeps the body as a string (raw export JSONL, `/track` "1"). */
	responseType?: 'json' | 'text';
	/** Long-running calls (export, JQL, queued queries) get more time. */
	timeoutMs?: number;
};

export const MIXPANEL_DEFAULT_TIMEOUT_MS = 60_000;

function authHeader(
	auth: MixpanelAuth,
	credentials: MixpanelCredentials,
): string | undefined {
	switch (auth) {
		case 'service_account':
			return `Basic ${base64(`${credentials.username}:${credentials.secret}`)}`;
		case 'project_token':
			return `Basic ${base64(`${requireProjectToken(credentials)}:`)}`;
		case 'gdpr': {
			if (!credentials.gdprToken) {
				throw new MixpanelConfigError(
					'This Mixpanel GDPR call needs the GDPR OAuth token: save gdpr_token on the account (Mixpanel, Personal Settings, Data & Privacy).',
				);
			}
			return `Bearer ${credentials.gdprToken}`;
		}
		case 'none':
			return undefined;
	}
}

export function requireProjectToken(credentials: MixpanelCredentials): string {
	if (!credentials.projectToken) {
		throw new MixpanelConfigError(
			'This Mixpanel call needs the project token: save project_token on the account (Project Settings, Overview).',
		);
	}
	return credentials.projectToken;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMixpanelRequest(
	credentials: MixpanelCredentials,
	req: MixpanelRequest,
): Promise<unknown> {
	const auth = req.auth ?? 'service_account';
	const authorization = authHeader(auth, credentials);
	const config: OpenAPIConfig = {
		BASE: mixpanelHost(req.service, credentials.region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: req.timeoutMs ?? MIXPANEL_DEFAULT_TIMEOUT_MS,
		HEADERS: {
			Accept: req.responseType === 'text' ? '*/*' : 'application/json',
			...(authorization ? { Authorization: authorization } : {}),
			...req.headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: req.method,
		url: req.path,
		query: req.query,
		body: req.body,
		mediaType: req.mediaType,
		// Text answers (raw export JSONL) are read as bytes and decoded here:
		// core parses any application/json body as one JSON document and would
		// turn several JSON lines into undefined. A failed body read throws.
		...(req.responseType === 'text' ? { responseType: 'binary' as const } : {}),
	};

	// unknown: the body is parsed by the endpoint's output schema.
	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, credentials);
		}
		throw error;
	}
	if (req.responseType === 'text') {
		const bytes = (raw as { bytes?: Uint8Array } | undefined)?.bytes;
		if (!(bytes instanceof Uint8Array)) {
			throw new Error('Mixpanel returned no readable body');
		}
		return new TextDecoder().decode(bytes);
	}

	// The query and app APIs can answer 200 with `status: "error"`, and the
	// ingestion API answers 200 with `status: 0` and an `error` in verbose
	// mode. Both are failures.
	const record = asRecord(raw);
	if (record && bodySaysError(record)) {
		throw new ApiError(
			{ method: req.method, url: req.path },
			{
				url: mixpanelHost(req.service, credentials.region) + req.path,
				ok: false,
				status: 200,
				statusText: 'OK',
				body: safeErrorBody(raw, credentials),
			},
			mixpanelErrorMessage(200, safeErrorBody(raw, credentials), 'failed'),
		);
	}
	return raw;
}

// unknown: an error body is untyped JSON.
function bodySaysError(record: Record<string, unknown>): boolean {
	if (record.status === 'error') return true;
	return (
		record.status === 0 &&
		typeof record.error === 'string' &&
		record.error.length > 0
	);
}

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body and headers on `ApiError.request`. Mixpanel bodies
 * carry the project token (`$token`, `properties.token`), user profiles and
 * event properties, and the headers carry the service account, so the error
 * is rebuilt without them, keeping the status and rate-limit fields the
 * handlers and core's retries read. The message is rebuilt from Mixpanel's
 * error body, which core would otherwise reduce to a status text.
 */
export function withoutRequestData(
	error: ApiError,
	credentials?: MixpanelCredentials,
): ApiError {
	const body = safeErrorBody(error.body, credentials);
	return new ApiError(
		{
			method: error.request.method,
			url: error.request.url,
			body: error.request.body === undefined ? undefined : REDACTED,
			query: error.request.query
				? Object.fromEntries(
						Object.keys(error.request.query).map((key) => [
							key,
							key === 'project_id' || key === 'workspace_id'
								? error.request.query?.[key]
								: REDACTED,
						]),
					)
				: undefined,
		},
		{
			url: error.url.replace(/\?.*$/, ''),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		mixpanelErrorMessage(error.status, body, error.statusText),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// Fields in an error body that echo customer identifiers back (a strict
// import's failed_records carry each event's $insert_id).
const ECHOED_ID_KEYS = new Set([
	'insert_id',
	'$insert_id',
	'distinct_id',
	'$distinct_id',
	'distinct_ids',
	'$distinct_ids',
]);

/**
 * An error body fit to keep on ApiError: the account's secrets and any
 * email address replaced, echoed customer ids dropped. Status fields,
 * failure indexes, field names and messages stay.
 */
// unknown: the error body is any JSON or text.
export function safeErrorBody(
	value: unknown,
	credentials: MixpanelCredentials | undefined,
	depth = 0,
): unknown {
	const scrubbed = scrubSecrets(value, credentials);
	// unknown: walks any JSON value.
	const walk = (node: unknown, level: number): unknown => {
		if (level > 8) return node;
		if (typeof node === 'string') return node.replace(EMAIL, '[email]');
		if (Array.isArray(node)) return node.map((item) => walk(item, level + 1));
		if (node && typeof node === 'object') {
			return Object.fromEntries(
				Object.entries(node)
					.filter(([key]) => !ECHOED_ID_KEYS.has(key))
					.map(([key, inner]) => [key, walk(inner, level + 1)]),
			);
		}
		return node;
	};
	return walk(scrubbed, depth);
}

/** Replaces the account's own secrets wherever an error body echoes them. */
// unknown: the error body is any JSON or text.
export function scrubSecrets(
	value: unknown,
	credentials: MixpanelCredentials | undefined,
	depth = 0,
): unknown {
	if (!credentials || depth > 8) return value;
	const secrets = [
		credentials.secret,
		credentials.projectToken,
		credentials.gdprToken,
	].filter((secret): secret is string => Boolean(secret && secret.length >= 6));
	if (secrets.length === 0) return value;
	if (typeof value === 'string') {
		return secrets.reduce(
			(text, secret) => text.split(secret).join(REDACTED),
			value,
		);
	}
	if (Array.isArray(value)) {
		return value.map((item) => scrubSecrets(item, credentials, depth + 1));
	}
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, inner]) => [
				key,
				scrubSecrets(inner, credentials, depth + 1),
			]),
		);
	}
	return value;
}

/**
 * Mixpanel error bodies come in several shapes:
 * - query and app APIs: `{ request, status: 'error', error, error_code }`
 * - ingestion: `{ code, error, status: 0 }` plus `failed_records` on a strict
 *   import 400
 * - platform API: problem JSON `{ type, status, title, detail, error_id }`
 * - raw export and data pipelines: plain text or `{ Error }`
 */
// unknown: the error body is any JSON or text.
export function mixpanelErrorMessage(
	status: number,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const pick = (key: string) => {
		const value = record?.[key];
		return typeof value === 'string' && value.trim().length > 0
			? value.trim()
			: undefined;
	};
	const reason =
		pick('error') ??
		pick('detail') ??
		pick('message') ??
		pick('Error') ??
		pick('title') ??
		(typeof body === 'string' && body.trim().length > 0
			? body.trim()
			: undefined) ??
		fallback ??
		'request failed';
	const code = pick('error_code') ?? pick('type');
	// failed_records holds validation text (strings, or objects with a
	// `message`); only the first message is quoted, never the record itself.
	const records = Array.isArray(record?.failed_records)
		? record.failed_records
		: undefined;
	const first = records?.[0];
	const firstMessage =
		typeof first === 'string'
			? first
			: typeof asRecord(first)?.message === 'string'
				? (asRecord(first)?.message as string)
				: undefined;
	const failed = records
		? ` (${records.length} failed records${firstMessage ? `, first: ${firstMessage}` : ''})`
		: '';
	const text = `Mixpanel ${status}${code ? ` ${code}` : ''}: ${reason}${failed}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/**
 * Encodes one path segment. `.` and `..` survive encodeURIComponent and
 * fetch resolves them as dot-segments, so `schemas/event/..` would become
 * `schemas/` (delete every schema); they are refused, as is an empty id.
 */
export function segment(value: string | number): string {
	const text = String(value);
	if (text === '' || text === '.' || text === '..') {
		throw new MixpanelConfigError(
			`"${text}" is not a valid Mixpanel id or name.`,
		);
	}
	return encodeURIComponent(text);
}
