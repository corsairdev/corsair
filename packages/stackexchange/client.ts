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
	if (!apiKey && typeof page === 'number' && page > 25) {
		throw new Error(
			'Anonymous Stack Exchange access cannot request pages above 25',
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

	// The transport response is untrusted JSON; the endpoint output schema narrows it.
	return request<unknown>(config, options);
}
