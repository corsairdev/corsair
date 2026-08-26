import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const BASELINKER_API_BASE = 'https://api.baselinker.com';
export const BASELINKER_CONNECTOR_PATH = '/connector.php';

export class BaseLinkerAPIError extends Error {
	constructor(
		message: string,
		public readonly code: string | undefined,
		public readonly method: string,
	) {
		super(message);
		this.name = 'BaseLinkerAPIError';
	}
}

export function compactParameters(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value
			.filter((item) => item !== undefined)
			.map((item) => compactParameters(item));
	}
	if (value !== null && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, item]) => item !== undefined)
				.map(([key, item]) => [key, compactParameters(item)]),
		);
	}
	return value;
}

type BaseLinkerResponseEnvelope = {
	status?: unknown;
	error_code?: unknown;
	error_message?: unknown;
};

export async function makeBaseLinkerRequest<T>(
	method: string,
	apiKey: string,
	parameters: Record<string, unknown> = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: BASELINKER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-BLToken': apiKey,
		},
	};

	const form = new URLSearchParams({
		method,
		parameters: JSON.stringify(compactParameters(parameters)),
	}).toString();
	const options: ApiRequestOptions = {
		method: 'POST',
		url: BASELINKER_CONNECTOR_PATH,
		body: form,
		mediaType: 'application/x-www-form-urlencoded',
	};

	const response = await request<T>(config, options);
	const envelope = response as BaseLinkerResponseEnvelope;
	if (envelope.status === 'ERROR') {
		const code =
			typeof envelope.error_code === 'string' ? envelope.error_code : undefined;
		const message =
			typeof envelope.error_message === 'string'
				? envelope.error_message
				: 'BaseLinker API request failed';
		throw new BaseLinkerAPIError(message, code, method);
	}
	return response;
}
