import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import {
	ApiError,
	BaseWebhookHandler,
	request,
	verifyHmacSignature,
} from 'corsair/http';
import { z } from 'zod';
import type {
	PostHogEventMap,
	PostHogEventName,
	PostHogWebhookPayload,
} from './webhooks/types';

export class PostHogAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// unknown because PostHog error bodies differ by endpoint (DRF errors,
	// query errors, capture errors); callers read `detail` defensively.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'PostHogAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/** Capture (ingestion) host used when the region is unknown, as before. */
const POSTHOG_CAPTURE_DEFAULT_BASE = 'https://app.posthog.com';
export const POSTHOG_US_HOST = 'https://us.posthog.com';
export const POSTHOG_EU_HOST = 'https://eu.posthog.com';

export const PERSONAL_KEY_REQUIRED_MESSAGE =
	'PostHog read actions need a personal API key (phx_...) with read scopes; reconnect PostHog with one.';

/**
 * What the key builder hands every endpoint. `key` is whatever the connection
 * holds: a project token (phc_...) or a personal API key (phx_...).
 */
export const PostHogCredentialsSchema = z.object({
	key: z.string().min(1),
	projectId: z.string().min(1).optional(),
	host: z.string().min(1).optional(),
});

export type PostHogCredentials = z.infer<typeof PostHogCredentialsSchema>;

export function packPostHogCredentials(
	credentials: PostHogCredentials,
): string {
	return JSON.stringify(credentials);
}

/** Reads packed credentials; a bare string (older callers) is treated as the key. */
export function unpackPostHogCredentials(raw: string): PostHogCredentials {
	if (raw.trim().startsWith('{')) {
		try {
			return PostHogCredentialsSchema.parse(JSON.parse(raw));
		} catch {
			// fall through: not our JSON, treat the whole string as the key
		}
	}
	return { key: raw };
}

export function isPersonalApiKey(key: string): boolean {
	return key.startsWith('phx_');
}

function normalizeHost(host: string): string {
	const withProtocol = /^https?:\/\//i.test(host) ? host : `https://${host}`;
	return withProtocol.replace(/\/+$/, '');
}

// Which region a personal key works in, learned on first use.
const resolvedHosts = new Map<string, string>();
/** How long a project token looked up with a personal key is reused. */
export const CAPTURE_TOKEN_TTL_MS = 10 * 60 * 1000;

// Project token per personal key + project, for capture with a phx_ key.
const captureTokens = new Map<string, { token: string; expiresAt: number }>();
// Lookups in flight, so concurrent cold-start captures share one request.
const captureTokenLookups = new Map<string, Promise<string>>();

/** Test hook: forget learned regions and project tokens. */
export function resetPostHogClientCache(): void {
	resolvedHosts.clear();
	captureTokens.clear();
	captureTokenLookups.clear();
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * A personal key can read and change the whole project, so it only goes over
 * HTTPS; plain http is allowed for a self-hosted PostHog on this machine.
 */
function assertSafeHostForPersonalKey(host: string): void {
	const url = new URL(host);
	if (url.protocol === 'http:' && !LOCAL_HOSTS.has(url.hostname)) {
		throw new PostHogAPIError(
			`Refusing to send a PostHog personal API key over plain http to ${url.hostname}; use an https host.`,
			'insecure_host',
		);
	}
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type PostHogQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

// The body is any JSON object PostHog accepts; each endpoint's zod input
// schema has already validated what goes into it.
export type PostHogApiOptions = {
	method?: HttpMethod;
	body?: Record<string, unknown>;
	query?: PostHogQuery;
	/** Overrides the connection's project for this call. */
	projectId?: string | number;
};

async function sendPostHogRequest<T>(
	base: string,
	endpoint: string,
	token: string,
	options: {
		method?: HttpMethod;
		body?: Record<string, unknown>;
		query?: PostHogQuery;
	},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new PostHogAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new PostHogAPIError(error.message);
		}
		throw new PostHogAPIError('Unknown error');
	}
}

/**
 * Capture request (`/capture/`, `/batch/`). The token goes in the body as
 * `api_key`; `base` defaults to the legacy US ingestion host.
 */
export async function makePostHogRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: HttpMethod;
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		base?: string;
	} = {},
): Promise<T> {
	const { method = 'POST', body, query, base } = options;
	return sendPostHogRequest<T>(
		base ?? POSTHOG_CAPTURE_DEFAULT_BASE,
		endpoint,
		apiKey,
		{ method, body, query: method === 'GET' ? query : undefined },
	);
}

function requirePersonalKey(credentials: PostHogCredentials): string {
	if (!isPersonalApiKey(credentials.key)) {
		throw new PostHogAPIError(PERSONAL_KEY_REQUIRED_MESSAGE, 'personal_key');
	}
	return credentials.key;
}

function requireProjectId(
	credentials: PostHogCredentials,
	override?: string | number,
): string {
	const projectId =
		override !== undefined ? String(override) : credentials.projectId;
	if (!projectId) {
		throw new PostHogAPIError(
			'PostHog read actions need the project id; add it to the PostHog connection or pass project_id.',
			'project_id',
		);
	}
	return projectId;
}

/**
 * Private API request with a personal API key. `path` may contain
 * `{project_id}`, filled from `options.projectId` or the credentials.
 * Without a configured host the US cloud is tried first; a 401 there retries once on the EU cloud, and the
 * host that answered is remembered for the key.
 */
export async function makePostHogApiRequest<T>(
	credentials: PostHogCredentials,
	path: string,
	options: PostHogApiOptions = {},
): Promise<T> {
	const key = requirePersonalKey(credentials);
	const { projectId: projectOverride, ...requestOptions } = options;
	const endpoint = path.includes('{project_id}')
		? path.replace(
				'{project_id}',
				encodeURIComponent(requireProjectId(credentials, projectOverride)),
			)
		: path;

	if (credentials.host) {
		const host = normalizeHost(credentials.host);
		assertSafeHostForPersonalKey(host);
		return sendPostHogRequest<T>(host, endpoint, key, requestOptions);
	}

	const known = resolvedHosts.get(key);
	if (known) {
		return sendPostHogRequest<T>(known, endpoint, key, requestOptions);
	}

	try {
		const result = await sendPostHogRequest<T>(
			POSTHOG_US_HOST,
			endpoint,
			key,
			requestOptions,
		);
		resolvedHosts.set(key, POSTHOG_US_HOST);
		return result;
	} catch (usError) {
		if (!(usError instanceof PostHogAPIError) || usError.status !== 401) {
			throw usError;
		}
		try {
			const result = await sendPostHogRequest<T>(
				POSTHOG_EU_HOST,
				endpoint,
				key,
				requestOptions,
			);
			resolvedHosts.set(key, POSTHOG_EU_HOST);
			return result;
		} catch (euError) {
			if (euError instanceof PostHogAPIError && euError.status === 401) {
				// Neither region accepts the key: report the US answer.
				throw usError;
			}
			throw euError;
		}
	}
}

/** Ingestion host that matches the app host a personal key resolved to. */
function captureHostFor(appHost: string): string {
	if (appHost === POSTHOG_US_HOST) return 'https://us.i.posthog.com';
	if (appHost === POSTHOG_EU_HOST) return 'https://eu.i.posthog.com';
	return appHost;
}

/**
 * Token and host for capture. A project token is used as is. With a personal
 * key the project's `api_token` is fetched once and cached.
 */
export async function resolveCaptureTarget(
	credentials: PostHogCredentials,
): Promise<{ token: string; base?: string }> {
	if (!isPersonalApiKey(credentials.key)) {
		return {
			token: credentials.key,
			base: credentials.host ? normalizeHost(credentials.host) : undefined,
		};
	}

	const key = requirePersonalKey(credentials);
	const cacheKey = captureCacheKey(credentials);
	const cached = captureTokens.get(cacheKey);
	let token: string;
	if (cached && cached.expiresAt > Date.now()) {
		token = cached.token;
	} else {
		let lookup = captureTokenLookups.get(cacheKey);
		if (!lookup) {
			lookup = lookUpProjectToken(credentials).finally(() => {
				captureTokenLookups.delete(cacheKey);
			});
			captureTokenLookups.set(cacheKey, lookup);
		}
		token = await lookup;
	}

	const appHost = credentials.host
		? normalizeHost(credentials.host)
		: (resolvedHosts.get(key) ?? POSTHOG_US_HOST);
	return { token, base: captureHostFor(appHost) };
}

function captureCacheKey(credentials: PostHogCredentials): string {
	return `${credentials.key}:${requireProjectId(credentials)}`;
}

async function lookUpProjectToken(
	credentials: PostHogCredentials,
): Promise<string> {
	const project = await makePostHogApiRequest<{ api_token?: string }>(
		credentials,
		'/api/projects/{project_id}/',
	);
	if (!project.api_token) {
		throw new PostHogAPIError(
			'PostHog did not return a project token for this project.',
			'api_token',
		);
	}
	captureTokens.set(captureCacheKey(credentials), {
		token: project.api_token,
		expiresAt: Date.now() + CAPTURE_TOKEN_TTL_MS,
	});
	return project.api_token;
}

/** Forgets the cached project token, e.g. after PostHog rejected it. */
export function invalidateCaptureToken(credentials: PostHogCredentials): void {
	if (isPersonalApiKey(credentials.key) && credentials.projectId) {
		captureTokens.delete(captureCacheKey(credentials));
	}
}

export type PostHogEventHandler<T extends PostHogEventName> = (
	event: PostHogEventMap[T],
) => void | Promise<void>;

export interface PostHogWebhookHeaders {
	'x-posthog-signature'?: string;
	'x-posthog-timestamp'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface PostHogWebhookHandlerOptions {
	secret?: string;
}

export interface HandleWebhookResult {
	success: boolean;
	eventType?: PostHogEventName;
	error?: string;
}

export class PostHogWebhookHandler extends BaseWebhookHandler<
	PostHogEventName,
	PostHogEventMap[PostHogEventName]
> {
	private secret?: string;

	constructor(options: PostHogWebhookHandlerOptions = {}) {
		super();
		this.secret = options.secret;
	}

	on<T extends PostHogEventName>(
		eventName: T,
		handler: PostHogEventHandler<T>,
	): this {
		return super.on(eventName, handler as any) as this;
	}

	off<T extends PostHogEventName>(
		eventName: T,
		handler: PostHogEventHandler<T>,
	): this {
		return super.off(eventName, handler as any) as this;
	}

	verifySignature(
		payload: string,
		signature: string,
		timestamp?: string,
	): boolean {
		if (!this.secret) {
			return true;
		}

		return verifyHmacSignature(payload, this.secret, signature);
	}

	async handleWebhook(
		headers: PostHogWebhookHeaders,
		payload: string | PostHogWebhookPayload | PostHogWebhookPayload[],
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		let events: PostHogWebhookPayload[];
		if (typeof payload === 'string') {
			try {
				const parsed = JSON.parse(payload);
				events = Array.isArray(parsed) ? parsed : [parsed];
			} catch {
				return {
					success: false,
					error: 'Invalid JSON payload',
				};
			}
		} else if (Array.isArray(payload)) {
			events = payload;
		} else {
			events = [payload];
		}

		if (this.secret) {
			const signature = headers['x-posthog-signature'];
			const timestamp = headers['x-posthog-timestamp'];

			if (!signature) {
				return {
					success: false,
					error: 'Missing signature header',
				};
			}

			const isValid = this.verifySignature(payloadString, signature, timestamp);
			if (!isValid) {
				return {
					success: false,
					error: 'Invalid signature',
				};
			}
		}

		for (const event of events) {
			const eventType: PostHogEventName = 'event.captured';
			try {
				await this.executeHandlers(eventType, event as any);
			} catch (error) {
				return {
					success: false,
					eventType: eventType,
					error:
						error instanceof Error ? error.message : 'Handler execution failed',
				};
			}
		}

		return {
			success: true,
			eventType: 'event.captured',
		};
	}
}

export function createWebhookHandler(
	options?: PostHogWebhookHandlerOptions,
): PostHogWebhookHandler {
	return new PostHogWebhookHandler(options);
}
