import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

/**
 * The Formbricks Cloud API host.
 *
 * Self-hosting is possible but needs an Ubuntu VM, a custom domain and ports 80/443, so
 * Cloud is what this plugin is verified against. A self-hosted caller can point at their own
 * host by passing `host` in the plugin options.
 *
 * @see https://formbricks.com/docs
 */
const FORMBRICKS_CLOUD_HOST = 'https://app.formbricks.com';

/**
 * Formbricks exposes **two API versions at once**, and the operation surface spans both.
 *
 * This is not a migration in progress that can be waited out - the two versions carry
 * different resources, so a complete plugin has to use both:
 *
 * - **v1** has surveys, responses, action classes, contacts, contact attributes and
 *   storage.
 * - **v2** has webhooks, organizations, teams, roles, health, bulk contact upload and the
 *   contact-attribute-key writes.
 *
 * A few resources exist in both. Webhooks are the clearest case: a webhook created through
 * `POST v1/webhooks` is returned by `GET v2/management/webhooks`, so they are two surfaces
 * over one store rather than two resources. Where that happens this plugin picks the version
 * the OpenAPI document describes and says so on the operation.
 *
 * The version is therefore **explicit on every call** rather than a default. A default would
 * silently send a v2-only request to v1 and produce a 404 that looks like a missing record.
 */
export type FormbricksApiVersion = 'v1' | 'v2';

/** The rate-limit state Formbricks reports, when it reports any. */
export type FormbricksRateLimit = {
	limit?: number;
	remaining?: number;
	reset?: number;
};

/**
 * Reads whatever rate-limit headers are present.
 *
 * Formbricks does not document a rate-limit budget and did not return these headers on any
 * observed response, so this returns an empty object in practice. It is kept because the
 * cost is nothing and a provider adding the headers later is silently useful rather than a
 * change here - and because a caller sweeping a large workspace has no other signal.
 */
export function readRateLimit(headers: Headers): FormbricksRateLimit {
	const num = (name: string) => {
		const raw = headers.get(name);
		if (raw === null) return undefined;
		const parsed = Number(raw);
		return Number.isFinite(parsed) ? parsed : undefined;
	};
	return {
		limit: num('x-ratelimit-limit'),
		remaining: num('x-ratelimit-remaining'),
		reset: num('x-ratelimit-reset'),
	};
}

export type FormbricksRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/**
	 * The JSON request body.
	 *
	 * `unknown` values rather than a narrower union because bodies are assembled by the
	 * endpoints from their own already-validated input schemas, and those shapes vary
	 * widely. Validation belongs to the input schemas in `endpoints/types.ts`; this type
	 * says only "already-checked JSON".
	 */
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
	/** Overrides the host, for self-hosted instances. */
	host?: string;
};

/**
 * Issues a Formbricks request.
 *
 * Two decisions here differ from the generated template, and both matter:
 *
 * **1. Errors are not wrapped.** The template caught everything and rethrew it as a
 * `FormbricksAPIError`, which discards the `ApiError` and with it the HTTP status. Every
 * error handler in this plugin classifies on status - and the delete flow depends on telling
 * a 404 from a 500 to decide whether a record is gone. Wrapping would make that impossible,
 * so `ApiError` is allowed to propagate untouched.
 *
 * **2. `query` is sent on every method, not only GET.** The template dropped it on writes.
 * Formbricks takes query parameters on non-GET requests, and a silently discarded parameter
 * is the worst kind of bug: the request succeeds and does something other than what was
 * asked.
 */
export async function makeFormbricksRequest<T>(
	version: FormbricksApiVersion,
	endpoint: string,
	apiKey: string,
	options: FormbricksRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, host } = options;

	const config: OpenAPIConfig = {
		BASE: `${host ?? FORMBRICKS_CLOUD_HOST}/api/${version}`,
		VERSION: version,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			// A personal API key, created at Settings -> API Keys. Not a bearer token: the
			// header is `x-api-key`, which both OpenAPI documents declare as the only
			// security scheme.
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	return await request<T>(config, requestOptions);
}

export { FORMBRICKS_CLOUD_HOST };
