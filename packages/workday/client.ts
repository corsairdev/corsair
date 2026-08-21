import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { WorkdayService } from './endpoints/routes';

export class WorkdayAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'WorkdayAPIError';
	}
}

export type WorkdayConnection = {
	/** e.g. wd2-impl-services1.workday.com — no scheme */
	host: string;
	/** Workday tenant identifier */
	tenant: string;
};

const DEFAULT_HOST = 'wd2-impl-services1.workday.com';
const HOST_PATTERN = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(:\d{1,5})?$/i;

/** Strip scheme / trailing slash; host only (no credentials, no path). */
export function normalizeWorkdayHost(host: string): string {
	const trimmed = host.trim();
	if (!trimmed) throw new Error('[workday] host is required');

	let value = trimmed;
	if (trimmed.includes('://')) {
		let url: URL;
		try {
			url = new URL(trimmed);
		} catch {
			throw new Error('[workday] host is not a valid URL');
		}
		if (url.protocol !== 'https:') {
			throw new Error('[workday] host must use https');
		}
		if (url.username || url.password) {
			throw new Error('[workday] host must not contain credentials');
		}
		value = url.host;
	}

	// ponytail: no /\/+$/ — CodeQL flags ReDoS on uncontrolled host input
	while (value.endsWith('/')) {
		value = value.slice(0, -1);
	}
	if (!HOST_PATTERN.test(value)) {
		throw new Error('[workday] host must be a bare hostname');
	}
	return value;
}

export function normalizeWorkdayTenant(tenant: string): string {
	const trimmed = tenant.trim();
	if (!trimmed) throw new Error('[workday] tenant is required');
	if (trimmed.includes('/') || trimmed.includes('://')) {
		throw new Error('[workday] tenant must be the bare tenant name');
	}
	return trimmed;
}

export function resolveWorkdayConnection(input: {
	host?: string;
	tenant?: string;
}): WorkdayConnection {
	return {
		host: normalizeWorkdayHost(input.host?.trim() || DEFAULT_HOST),
		tenant: normalizeWorkdayTenant(input.tenant ?? ''),
	};
}

/** OAuth endpoints: https://{host}/ccx/oauth2/{tenant}/{authorize|token} */
export function workdayOAuthUrls(connection: WorkdayConnection) {
	const base = `https://${connection.host}/ccx/oauth2/${connection.tenant}`;
	return {
		authUrl: `${base}/authorize`,
		tokenUrl: `${base}/token`,
	};
}

/** REST base: https://{host}/ccx/api/{service}/{version}/{tenant} */
export function workdayServiceBase(
	connection: WorkdayConnection,
	service: WorkdayService,
	version: string,
): string {
	return `https://${connection.host}/ccx/api/${service}/${version}/${connection.tenant}`;
}

export async function makeWorkdayRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: { [key: string]: unknown };
		query?: Record<string, string | number | boolean | undefined>;
		connection: WorkdayConnection;
		service: WorkdayService;
		version: string;
	},
): Promise<T> {
	const { method = 'GET', body, query, connection, service, version } = options;
	const base = workdayServiceBase(connection, service, version);

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: version,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path.startsWith('/') ? path : `/${path}`,
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
		// Preserve ApiError so RATE_LIMIT_ERROR can read status/retryAfter.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) throw new WorkdayAPIError(error.message);
		throw new WorkdayAPIError('Unknown error');
	}
}
