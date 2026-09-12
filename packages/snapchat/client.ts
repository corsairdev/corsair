import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { SNAPCHAT_TOOLKIT_VERSION } from './operations';

const DEFAULT_COMPOSIO_BASE_URL = 'https://backend.composio.dev/api/v3';

export type SnapchatToolResponse = {
	successful?: boolean;
	data?: unknown;
	error?: unknown;
	log_id?: string;
	status?: string;
	request_id?: string;
} & Record<string, unknown>;

export type ExecuteSnapchatToolOptions = {
	composioApiKey: string;
	snapchatAccessToken?: string;
	connectedAccountId?: string;
	userId?: string;
	composioBaseUrl?: string;
	timeoutMs?: number;
	signal?: AbortSignal;
};

function normalizeBaseUrl(value?: string): string {
	const trimmed = value?.trim();
	if (!trimmed) {
		return DEFAULT_COMPOSIO_BASE_URL;
	}

	const parsed = new URL(trimmed);
	if (parsed.protocol !== 'https:') {
		throw new Error('[snapchat] composioBaseUrl must use https');
	}

	const normalized = parsed.toString();
	return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
}

function createCustomAuthParams(
	snapchatAccessToken?: string,
): Record<string, string> | undefined {
	const token = snapchatAccessToken?.trim();
	if (!token) {
		return undefined;
	}

	return {
		access_token: token,
		Authorization: `Bearer ${token}`,
	};
}

export async function executeSnapchatTool(
	toolSlug: string,
	args: object,
	options: ExecuteSnapchatToolOptions,
): Promise<SnapchatToolResponse> {
	const composioApiKey = options.composioApiKey.trim();
	if (!composioApiKey) {
		throw new Error('[snapchat] composioApiKey is required');
	}

	const body: Record<string, unknown> = {
		arguments: args,
		version: SNAPCHAT_TOOLKIT_VERSION,
	};

	if (options.connectedAccountId) {
		body.connected_account_id = options.connectedAccountId;
	}

	if (options.userId) {
		body.user_id = options.userId;
	}

	const customAuthParams = createCustomAuthParams(options.snapchatAccessToken);
	if (customAuthParams) {
		body.custom_auth_params = customAuthParams;
	}

	const config: OpenAPIConfig = {
		BASE: normalizeBaseUrl(options.composioBaseUrl),
		VERSION: '1.0.0',
		TIMEOUT: options.timeoutMs,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json; charset=utf-8',
			'x-api-key': composioApiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/tools/execute/${encodeURIComponent(toolSlug)}`,
		body,
		mediaType: 'application/json; charset=utf-8',
	};

	const requestPromise = request<SnapchatToolResponse>(config, requestOptions);

	if (!options.signal) {
		return requestPromise;
	}

	const onAbort = () => {
		requestPromise.cancel();
	};

	if (options.signal.aborted) {
		onAbort();
	}

	options.signal.addEventListener('abort', onAbort, { once: true });

	try {
		return await requestPromise;
	} finally {
		options.signal.removeEventListener('abort', onAbort);
	}
}
