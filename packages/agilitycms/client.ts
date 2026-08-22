import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class AgilityCmsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AgilityCmsAPIError';
	}
}

const AGILITYCMS_API_BASE = 'https://api.aglty.io';

export async function makeAgilityCmsRequest<T>(
	instanceGuid: string,
	apiKey: string,
	apiType: 'fetch' | 'preview',
	endpoint: string,
	options: {
		method?: 'GET';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', query } = options;

	if (!instanceGuid) {
		throw new AgilityCmsAPIError('Agility CMS instance GUID is required');
	}

	if (!apiKey) {
		throw new AgilityCmsAPIError('Agility CMS API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: `${AGILITYCMS_API_BASE}/${instanceGuid}/${apiType}`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			APIKey: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new AgilityCmsAPIError(error.message);
		}

		throw new AgilityCmsAPIError('Unknown Agility CMS API error');
	}
}
