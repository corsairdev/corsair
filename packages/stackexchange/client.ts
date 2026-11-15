import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import type { RouteGroup } from './endpoints/routes';
import { getRoute } from './endpoints/routes';

export const STACKEXCHANGE_API_BASE = 'https://api.stackexchange.com/2.3';

type Scalar = string | number | boolean;
type Parameters = Record<string, Scalar | Scalar[] | undefined>;
type PathParameters = Record<string, string | number>;

function encodePath(route: string, values: PathParameters | undefined): string {
	const names = [...route.matchAll(/\{([^}]+)\}/g)].flatMap((match) =>
		match[1] === undefined ? [] : [match[1]],
	);
	const provided = Object.keys(values ?? {});
	if (
		names.length !== provided.length ||
		names.some((name) => !provided.includes(name))
	) {
		throw new Error(
			'Path parameters must match the selected Stack Exchange route',
		);
	}
	for (const name of names) {
		const value = values?.[name];
		if (
			name === 'ids' &&
			typeof value === 'string' &&
			value.split(';').length > 100
		) {
			throw new Error('Stack Exchange ID vectors cannot exceed 100 values');
		}
	}
	return route.replace(/\{([^}]+)\}/g, (_match, name: string) => {
		const value = values?.[name];
		if (value === undefined)
			throw new Error('A required path parameter is missing');
		return encodeURIComponent(String(value));
	});
}

function serializeParameters(
	parameters: Parameters | undefined,
): Record<string, Scalar> {
	const result: Record<string, Scalar> = {};
	for (const [name, value] of Object.entries(parameters ?? {})) {
		if (value === undefined) continue;
		result[name] = Array.isArray(value) ? value.join(';') : value;
	}
	return result;
}

// The docs require waiting `backoff` seconds before calling the same method
// again, and count /me routes as their /users/{ids} equivalent. The /me routes
// also mirror singular /users/{id} routes, so both share one key.
const backoffUntil = new Map<string, number>();
export const MAX_BACKOFF_WAIT_MS = 30_000;

function backoffKey(path: string, site: string | undefined): string {
	const method = path.replace(/^(?:me|users\/\{id\})(?=\/|$)/, 'users/{ids}');
	return `${site ?? ''} ${method}`;
}

// Another response can extend the deadline while this call sleeps, so the
// deadline is read again after every wait.
async function waitForBackoff(key: string): Promise<void> {
	for (;;) {
		const until = backoffUntil.get(key);
		if (until === undefined) return;
		const waitMs = until - Date.now();
		if (waitMs <= 0) {
			backoffUntil.delete(key);
			return;
		}
		if (waitMs > MAX_BACKOFF_WAIT_MS) {
			throw new Error(
				`Stack Exchange rate limit: backoff requested, retry this method in ${Math.ceil(waitMs / 1000)}s`,
			);
		}
		await new Promise((resolve) => setTimeout(resolve, waitMs));
	}
}

// The wrapper is untrusted JSON; only a positive numeric backoff is recorded.
function recordBackoff(key: string, response: unknown): void {
	if (
		typeof response !== 'object' ||
		response === null ||
		!('backoff' in response)
	)
		return;
	const { backoff } = response;
	if (typeof backoff === 'number' && backoff > 0) {
		// Keep the later deadline: a shorter backoff must not cut a longer one short.
		const until = Date.now() + backoff * 1000;
		backoffUntil.set(key, Math.max(until, backoffUntil.get(key) ?? 0));
	}
}

export function clearStackExchangeBackoff(): void {
	backoffUntil.clear();
}

// Stack Exchange item fields depend on the selected route/filter; endpoints
// validate the shared response wrapper after receiving this untrusted JSON.
export async function makeStackExchangeRequest(
	group: RouteGroup,
	routeId: string,
	apiKey: string | undefined,
	authType: 'api_key' | 'oauth_2',
	input: {
		method?: 'GET' | 'POST';
		site?: string;
		pathParams?: PathParameters;
		parameters?: Parameters;
	},
): Promise<unknown> {
	const route = getRoute(group, routeId);
	const method = input.method ?? route.method;
	if (!route.methods.includes(method)) {
		throw new Error(
			`The documented ${routeId} method does not accept ${method}`,
		);
	}
	if (route.site !== (input.site !== undefined)) {
		throw new Error(
			route.site
				? 'This route requires a site'
				: 'This route does not accept a site',
		);
	}
	if (route.scope !== 'none' && !apiKey) {
		throw new AuthMissingError('stackexchange', 'oauth_2');
	}
	if (route.scope !== 'none' && authType !== 'oauth_2') {
		throw new AuthMissingError('stackexchange', 'oauth_2');
	}

	const path = encodePath(route.path, input.pathParams);
	const parameters = serializeParameters(input.parameters);
	const page = parameters.page;
	// Live 11-15: page 26 with an app key in the Authorization header still
	// returns access_denied "page above 25 requires access token or app key".
	if (
		(authType !== 'oauth_2' || !apiKey) &&
		typeof page === 'number' &&
		page > 25
	) {
		throw new Error(
			'Stack Exchange serves pages above 25 only to OAuth connections; anonymous and app-key requests stop at page 25',
		);
	}
	if (input.site) parameters.site = input.site;

	const config: OpenAPIConfig = {
		BASE: STACKEXCHANGE_API_BASE,
		VERSION: '2.3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			'Accept-Encoding': 'gzip, deflate',
		},
	};

	let options: ApiRequestOptions;
	if (method === 'POST') {
		const form = new URLSearchParams();
		for (const [name, value] of Object.entries(parameters)) {
			form.append(name, String(value));
		}
		options = {
			method,
			url: path,
			body: form.toString(),
			mediaType: 'application/x-www-form-urlencoded; charset=utf-8',
		};
	} else {
		options = {
			method,
			url: path,
			query: parameters,
		};
	}

	const throttleKey = backoffKey(route.path, input.site);
	await waitForBackoff(throttleKey);
	// The transport response is untrusted JSON; the endpoint output schema narrows it.
	const response = await request<unknown>(config, options);
	recordBackoff(throttleKey, response);
	return response;
}
