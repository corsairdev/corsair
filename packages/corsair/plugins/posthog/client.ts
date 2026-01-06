/**
 * HTTP client for PostHog API
 * Uses native fetch - no external dependencies
 */

const DEFAULT_POSTHOG_API_HOST = 'https://app.posthog.com';

class PostHogAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'PostHogAPIError';
	}
}

async function makeRequest<T>(
	endpoint: string,
	apiKey: string,
	apiHost: string,
	options: {
		method?: string;
		body?: unknown;
	} = {},
): Promise<T> {
	const { method = 'POST', body } = options;

	const url = `${apiHost}${endpoint}`;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	// PostHog expects API key in the request body
	const payload = {
		...(body as Record<string, unknown>),
		api_key: apiKey,
	};

	const response = await fetch(url, {
		method,
		headers,
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new PostHogAPIError(
			errorData.message || `HTTP error! status: ${response.status}`,
			errorData.code || `http_${response.status}`,
		);
	}

	// PostHog capture endpoint returns 1 on success, or an object
	const responseData = await response.json().catch(() => null);
	return (responseData ?? 1) as T;
}

export interface PostHogClient {
	createEvent(params: {
		distinct_id: string;
		event: string;
		properties?: Record<string, unknown>;
		timestamp?: string;
		uuid?: string;
	}): Promise<number | { status?: number; message?: string }>;

	createIdentity(params: {
		distinct_id: string;
		properties?: Record<string, unknown>;
	}): Promise<number | { status?: number; message?: string }>;

	createAlias(params: {
		distinct_id: string;
		alias: string;
	}): Promise<number | { status?: number; message?: string }>;

	trackPage(params: {
		distinct_id: string;
		url: string;
		properties?: Record<string, unknown>;
		timestamp?: string;
		uuid?: string;
	}): Promise<number | { status?: number; message?: string }>;

	trackScreen(params: {
		distinct_id: string;
		screen_name: string;
		properties?: Record<string, unknown>;
		timestamp?: string;
		uuid?: string;
	}): Promise<number | { status?: number; message?: string }>;
}

export function createPostHogClient(
	apiKey: string,
	apiHost?: string,
): PostHogClient {
	const host = apiHost || DEFAULT_POSTHOG_API_HOST;

	return {
		async createEvent(params) {
			const payload: any = {
				event: params.event,
				properties: {
					...params.properties,
					distinct_id: params.distinct_id,
				},
				distinct_id: params.distinct_id,
			};

			if (params.timestamp) {
				payload.timestamp = params.timestamp;
			}

			if (params.uuid) {
				payload.uuid = params.uuid;
			}

			return makeRequest<ReturnType<PostHogClient['createEvent']>>(
				'/capture/',
				apiKey,
				host,
				{
					method: 'POST',
					body: payload,
				},
			);
		},

		async createIdentity(params) {
			const payload = {
				event: '$identify',
				properties: {
					...params.properties,
					distinct_id: params.distinct_id,
				},
				distinct_id: params.distinct_id,
			};

			return makeRequest<ReturnType<PostHogClient['createIdentity']>>(
				'/capture/',
				apiKey,
				host,
				{
					method: 'POST',
					body: payload,
				},
			);
		},

		async createAlias(params) {
			const payload = {
				event: '$create_alias',
				properties: {
					distinct_id: params.distinct_id,
					alias: params.alias,
				},
				distinct_id: params.distinct_id,
			};

			return makeRequest<ReturnType<PostHogClient['createAlias']>>(
				'/capture/',
				apiKey,
				host,
				{
					method: 'POST',
					body: payload,
				},
			);
		},

		async trackPage(params) {
			const payload: any = {
				event: '$pageview',
				properties: {
					...params.properties,
					$current_url: params.url,
					distinct_id: params.distinct_id,
				},
				distinct_id: params.distinct_id,
			};

			if (params.timestamp) {
				payload.timestamp = params.timestamp;
			}

			if (params.uuid) {
				payload.uuid = params.uuid;
			}

			return makeRequest<ReturnType<PostHogClient['trackPage']>>(
				'/capture/',
				apiKey,
				host,
				{
					method: 'POST',
					body: payload,
				},
			);
		},

		async trackScreen(params) {
			const payload: any = {
				event: '$screen',
				properties: {
					...params.properties,
					$screen_name: params.screen_name,
					distinct_id: params.distinct_id,
				},
				distinct_id: params.distinct_id,
			};

			if (params.timestamp) {
				payload.timestamp = params.timestamp;
			}

			if (params.uuid) {
				payload.uuid = params.uuid;
			}

			return makeRequest<ReturnType<PostHogClient['trackScreen']>>(
				'/capture/',
				apiKey,
				host,
				{
					method: 'POST',
					body: payload,
				},
			);
		},
	};
}

export { PostHogAPIError };

