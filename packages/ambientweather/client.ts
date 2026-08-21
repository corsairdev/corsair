import { z } from 'zod';

export const AmbientWeatherCredentialsSchema = z.object({
	apiKey: z.string().min(1),
	applicationKey: z.string().min(1),
});

export type AmbientWeatherCredentials = z.infer<
	typeof AmbientWeatherCredentialsSchema
>;

export class AmbientWeatherAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options);
		this.name = 'AmbientWeatherAPIError';
		this.status = options?.status ?? code;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

export class AmbientWeatherRateLimitError extends AmbientWeatherAPIError {
	constructor(
		message: string,
		options?: ConstructorParameters<typeof AmbientWeatherAPIError>[2],
	) {
		super(message, 429, options);
		this.name = 'AmbientWeatherRateLimitError';
	}
}

const AMBIENTWEATHER_API_BASE = 'https://rt.ambientweather.net';

export type AmbientWeatherQueryValue = string | number | boolean | undefined;

export type AmbientWeatherRequestQuery = Record<
	string,
	AmbientWeatherQueryValue
>;

export function packAmbientWeatherCredentials(
	credentials: AmbientWeatherCredentials,
): string {
	return JSON.stringify(credentials);
}

export function parseAmbientWeatherKey(
	key: string,
): AmbientWeatherCredentials | null {
	try {
		const parsed = JSON.parse(key) as unknown;
		const credentials = AmbientWeatherCredentialsSchema.safeParse(parsed);
		return credentials.success ? credentials.data : null;
	} catch {
		return null;
	}
}

function buildAmbientWeatherUrl(
	endpoint: string,
	apiKey: string,
	applicationKey: string,
	query?: AmbientWeatherRequestQuery,
): URL {
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	const url = new URL(path, `${AMBIENTWEATHER_API_BASE}/`);
	const params: AmbientWeatherRequestQuery = {
		...query,
		apiKey,
		applicationKey,
	};
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	return url;
}

/** Retry-After: delta-seconds or HTTP-date → non-negative delay ms. */
function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;

	const seconds = Number(header);
	if (Number.isFinite(seconds) && seconds >= 0) {
		return seconds * 1000;
	}

	const dateMs = Date.parse(header);
	if (!Number.isFinite(dateMs)) return undefined;

	const delayMs = dateMs - Date.now();
	return delayMs >= 0 ? delayMs : undefined;
}

export async function makeAmbientWeatherRequest<T>(
	endpoint: string,
	apiKey: string,
	applicationKey: string,
	options: {
		query?: AmbientWeatherRequestQuery;
	} = {},
): Promise<T> {
	const url = buildAmbientWeatherUrl(
		endpoint,
		apiKey,
		applicationKey,
		options.query,
	);

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new AmbientWeatherAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new AmbientWeatherAPIError('Unknown Ambient Weather API error');
	}

	if (!response.ok) {
		let body: unknown;
		try {
			body = await response.json();
		} catch {
			body = undefined;
		}

		const retryAfter = parseRetryAfterMs(response.headers.get('Retry-After'));

		if (response.status === 429) {
			throw new AmbientWeatherRateLimitError(
				response.statusText || 'Too Many Requests',
				{
					status: 429,
					statusText: response.statusText,
					body,
					retryAfter,
				},
			);
		}

		throw new AmbientWeatherAPIError(
			response.statusText || 'Ambient Weather API error',
			response.status,
			{
				status: response.status,
				statusText: response.statusText,
				body,
				retryAfter,
			},
		);
	}

	return (await response.json()) as T;
}
