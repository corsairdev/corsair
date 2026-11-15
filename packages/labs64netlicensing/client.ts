import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const NETLICENSING_API_BASE = 'https://go.netlicensing.io/core/v2/rest';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function netlicensingGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: NETLICENSING_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(`apiKey:${apiKey}`, 'utf8').toString('base64')}`,
		},
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url, query };
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

function asList(value: unknown): unknown[] {
	if (value == null) return [];
	return Array.isArray(value) ? value : [value];
}

function propertyMap(item: unknown): Record<string, string> {
	if (!item || typeof item !== 'object') return {};
	const record = item as Record<string, unknown>;
	const out: Record<string, string> = {};
	for (const prop of asList(record.property)) {
		if (!prop || typeof prop !== 'object') continue;
		const name = (prop as { name?: unknown }).name;
		const value = (prop as { value?: unknown }).value;
		if (typeof name !== 'string' || value == null) continue;
		out[name] = String(value);
	}
	for (const key of ['number', 'active', 'name', 'version']) {
		if (out[key] !== undefined) continue;
		const flat = record[key];
		if (
			typeof flat === 'string' ||
			typeof flat === 'boolean' ||
			typeof flat === 'number'
		) {
			out[key] = String(flat);
		}
	}
	return out;
}

export function listedItems(body: unknown): Record<string, string>[] {
	if (!body || typeof body !== 'object') return [];
	const items = (body as { items?: unknown }).items;
	if (!items || typeof items !== 'object') return [];
	return asList((items as { item?: unknown }).item).map(propertyMap);
}

export function optionalFlag(value: string | undefined): boolean | undefined {
	if (value === 'true') return true;
	if (value === 'false') return false;
	return undefined;
}
