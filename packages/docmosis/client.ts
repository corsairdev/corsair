import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class DocmosisAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DocmosisAPIError';
	}
}

export type DocmosisRegion = 'us1' | 'eu1' | 'au1';

const DOCMOSIS_API_BASES: Record<DocmosisRegion, string> = {
	us1: 'https://us1.dws4.docmosis.com/api',
	eu1: 'https://eu1.dws4.docmosis.com/api',
	au1: 'https://au1.dws4.docmosis.com/api',
};

export async function makeDocmosisRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		mediaType?: string;
		region?: DocmosisRegion;
	} = {},
): Promise<T> {
	const {
		method = 'POST',
		body,
		query,
		formData,
		mediaType,
		region = 'us1',
	} = options;

	const config: OpenAPIConfig = {
		BASE: DOCMOSIS_API_BASES[region],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body,
		formData: {
			accessKey: apiKey,
			...formData,
		},
		mediaType: mediaType ?? 'application/x-www-form-urlencoded',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new DocmosisAPIError(error.message);
		}

		throw new DocmosisAPIError('Unknown error');
	}
}