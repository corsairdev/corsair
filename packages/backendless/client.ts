import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const NATIVE_HOSTS = new Set([
	'api.backendless.com',
	'eu-api.backendless.com',
	'api.sa.backendless.com',
]);

export const BACKENDLESS_ROUTES = {
	'files.copy': '/api/files/copy',
	'files.move': '/api/files/move',
	'files.delete': '/api/files/{filePath}',
	'files.directory': '/api/files/{dirPath}',
	'files.root': '/api/files',
	'data.table': '/api/data/{tableName}',
	'data.object': '/api/data/{tableName}/{objectId}',
	'hive.create': '/api/hive/{hiveName}',
	'hive.map': '/api/hive/{hiveName}/map/{key}',
	'hive.list': '/api/hive/{hiveName}/list/{key}',
	'hive.listIndex': '/api/hive/{hiveName}/list/{key}/{index}',
	'hive.mapSet': '/api/hive/{hiveName}/map/{mapKey}/set/{keyName}',
	'counters.get': '/api/counters/{counterName}',
	'counters.compare': '/api/counters/{counterName}/get/compareandset',
	'counters.reset': '/api/counters/{counterName}/reset',
	'users.register': '/api/users/register',
	'users.login': '/api/users/login',
	'users.logout': '/api/users/logout',
	'users.restore': '/api/users/restorepassword/{identity}',
	'users.byId': '/api/users/{userId}',
	'users.find': '/api/data/Users/{userId}',
	'users.validate': '/api/users/isvalidusertoken/{token}',
	'permissions.table': '/api/data/{tableName}/permissions/{action}',
	'permissions.object': '/api/data/{tableName}/permissions/{action}/{objectId}',
	'messaging.publish': '/api/messaging/{channel}',
} as const;

export type BackendlessRoute = keyof typeof BACKENDLESS_ROUTES;

export type BackendlessClientConfig = {
	baseUrl: string;
	applicationId: string;
	restApiKey: string;
	userToken?: string;
};

export class BackendlessAPIError extends Error {
	readonly status?: number;
	readonly statusText?: string;
	readonly body?: unknown;
	readonly code?: number;
	readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: unknown; code?: number }) {
		super(message, options);
		this.name = 'BackendlessAPIError';
		this.code = options?.code;
		const cause = options?.cause;
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.statusText = cause.statusText;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

export function safeBaseUrl(value: string): string {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new BackendlessAPIError('Backendless base URL is not a valid URL');
	}
	if (url.protocol !== 'https:') {
		throw new BackendlessAPIError('Backendless base URL must use HTTPS');
	}
	return `${url.origin}${url.pathname}`.replace(/\/$/, '');
}

function pathSegments(...segments: string[]): string {
	return segments.map((segment) => encodeURIComponent(segment)).join('/');
}

function isNativeCluster(baseUrl: string): boolean {
	return NATIVE_HOSTS.has(new URL(baseUrl).hostname);
}

function resolveRouteUrl(route: BackendlessRoute, native: boolean): string {
	const template = BACKENDLESS_ROUTES[route];
	if (!native) return template;
	switch (route) {
		case 'files.copy':
			return '/{applicationId}/{restApiKey}/files/copy';
		case 'files.move':
			return '/{applicationId}/{restApiKey}/files/move';
		case 'files.delete':
			return '/{applicationId}/{restApiKey}/files/{filePath}';
		case 'files.directory':
			return '/{applicationId}/{restApiKey}/files/{dirPath}';
		case 'files.root':
			return '/{applicationId}/{restApiKey}/files';
		case 'data.table':
			return '/{applicationId}/{restApiKey}/data/{tableName}';
		case 'data.object':
			return '/{applicationId}/{restApiKey}/data/{tableName}/{objectId}';
		case 'hive.create':
			return '/{applicationId}/{restApiKey}/hive/{hiveName}';
		case 'hive.map':
			return '/{applicationId}/{restApiKey}/hive/{hiveName}/map/{key}';
		case 'hive.list':
			return '/{applicationId}/{restApiKey}/hive/{hiveName}/list/{key}';
		case 'hive.listIndex':
			return '/{applicationId}/{restApiKey}/hive/{hiveName}/list/{key}/{index}';
		case 'hive.mapSet':
			return '/{applicationId}/{restApiKey}/hive/{hiveName}/map/{mapKey}/set/{keyName}';
		case 'counters.get':
			return '/{applicationId}/{restApiKey}/counters/{counterName}';
		case 'counters.compare':
			return '/{applicationId}/{restApiKey}/counters/{counterName}/get/compareandset';
		case 'counters.reset':
			return '/{applicationId}/{restApiKey}/counters/{counterName}/reset';
		case 'users.register':
			return '/{applicationId}/{restApiKey}/users/register';
		case 'users.login':
			return '/{applicationId}/{restApiKey}/users/login';
		case 'users.logout':
			return '/{applicationId}/{restApiKey}/users/logout';
		case 'users.restore':
			return '/{applicationId}/{restApiKey}/users/restorepassword/{identity}';
		case 'users.byId':
			return '/{applicationId}/{restApiKey}/users/{userId}';
		case 'users.find':
			return '/{applicationId}/{restApiKey}/data/Users/{userId}';
		case 'users.validate':
			return '/{applicationId}/{restApiKey}/users/isvalidusertoken/{token}';
		case 'permissions.table':
			return '/{applicationId}/{restApiKey}/data/{tableName}/permissions/{action}';
		case 'permissions.object':
			return '/{applicationId}/{restApiKey}/data/{tableName}/permissions/{action}/{objectId}';
		case 'messaging.publish':
			return '/{applicationId}/{restApiKey}/messaging/{channel}';
	}
}

export class BackendlessClient {
	private readonly config: OpenAPIConfig;
	private readonly userToken?: string;
	private readonly native: boolean;
	private readonly applicationId: string;
	private readonly restApiKey: string;

	constructor(config: BackendlessClientConfig) {
		const baseUrl = safeBaseUrl(config.baseUrl);
		this.userToken = config.userToken;
		this.native = isNativeCluster(baseUrl);
		this.applicationId = config.applicationId;
		this.restApiKey = config.restApiKey;
		this.config = {
			BASE: baseUrl,
			VERSION: '',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: undefined,
			ENCODE_PATH: (value) => value,
			HEADERS: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'application-id': config.applicationId,
				'api-key': config.restApiKey,
			},
		};
	}

	segment(...values: string[]): string {
		return pathSegments(...values);
	}

	async call<T>(
		method: ApiRequestOptions['method'],
		route: BackendlessRoute,
		options: {
			path?: Record<string, string | number>;
			query?: Record<string, string | number | boolean | undefined>;
			body?: unknown;
			userScoped?: boolean;
		} = {},
	): Promise<T> {
		const requestOptions: ApiRequestOptions = {
			method,
			url: resolveRouteUrl(route, this.native),
			path: this.native
				? {
						applicationId: encodeURIComponent(this.applicationId),
						restApiKey: encodeURIComponent(this.restApiKey),
						...options.path,
					}
				: options.path,
			query: options.query,
			body: options.body,
			headers:
				options.userScoped && this.userToken
					? { 'user-token': this.userToken }
					: undefined,
		};
		try {
			return await request<T>(this.config, requestOptions);
		} catch (error) {
			if (error instanceof ApiError) {
				throw new BackendlessAPIError(error.message, {
					cause: error,
					code: error.status,
				});
			}
			if (error instanceof Error) {
				throw new BackendlessAPIError(error.message, { cause: error });
			}
			throw new BackendlessAPIError('Unknown Backendless API error');
		}
	}
}

export function redactSecrets(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(redactSecrets);
	if (!value || typeof value !== 'object') return value;
	const output: Record<string, unknown> = {};
	for (const [key, item] of Object.entries(value)) {
		const sensitive = ['password', 'token', 'key', 'secret'].some((part) =>
			key.toLowerCase().includes(part),
		);
		output[key] = sensitive ? '[REDACTED]' : redactSecrets(item);
	}
	return output;
}
