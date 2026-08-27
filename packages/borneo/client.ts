import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import { BORNEO_TOOLKIT_VERSION } from './operations';

const DEFAULT_COMPOSIO_API_BASE_URL = 'https://backend.composio.dev/api/v3';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type BorneoExecutionOptions = {
	composioApiKey: string;
	connectedAccountId?: string;
	userId?: string;
	composioBaseUrl?: string;
	borneoCredential?: string;
	borneoBaseUrl?: string;
	credentialHeaderName?: string;
	credentialPrefix?: string;
};

export function normalizeComposioBaseUrl(
	value = DEFAULT_COMPOSIO_API_BASE_URL,
): string {
	const trimmed = value.trim().replace(/\/+$/, '');
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error('[borneo] composioBaseUrl must be an absolute HTTPS URL');
	}
	if (parsed.protocol !== 'https:') {
		throw new Error('[borneo] composioBaseUrl must use https');
	}
	return trimmed;
}

function buildCustomAuthParams(options: BorneoExecutionOptions) {
	if (options.connectedAccountId) return undefined;
	if (!options.borneoCredential) {
		throw new Error(
			'[borneo] configure connectedAccountId or provide a Borneo credential',
		);
	}
	if (!options.credentialHeaderName) {
		throw new Error(
			'[borneo] credentialHeaderName is required when using direct custom auth',
		);
	}

	const prefix = options.credentialPrefix ?? '';
	return {
		parameters: [
			{
				in: 'header' as const,
				name: options.credentialHeaderName,
				value: `${prefix}${options.borneoCredential}`,
			},
		],
		...(options.borneoBaseUrl
			? { base_url: options.borneoBaseUrl.trim().replace(/\/+$/, '') }
			: {}),
	};
}

export async function executeBorneoTool<T>(
	toolSlug: string,
	arguments_: Record<string, unknown>,
	options: BorneoExecutionOptions,
): Promise<T> {
	if (!options.composioApiKey.trim()) {
		throw new Error('[borneo] composioApiKey is required');
	}

	const base = normalizeComposioBaseUrl(options.composioBaseUrl);
	const body: Record<string, unknown> = {
		arguments: arguments_,
		version: BORNEO_TOOLKIT_VERSION,
	};

	if (options.connectedAccountId) {
		body.connected_account_id = options.connectedAccountId;
	}
	if (options.userId) {
		body.user_id = options.userId;
	}

	const customAuthParams = buildCustomAuthParams(options);
	if (customAuthParams) {
		body.custom_auth_params = customAuthParams;
	}

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': options.composioApiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/tools/execute/${encodeURIComponent(toolSlug)}`,
		body,
		mediaType: 'application/json; charset=utf-8',
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: RATE_LIMIT_CONFIG,
	});
}
