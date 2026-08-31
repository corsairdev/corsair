export const SPOKI_BASE_URL = 'https://api.spoki.com/api/1';

export class SpokiApiError extends Error {
	constructor(
		public readonly status: number,
		message: string,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'SpokiApiError';
	}
}

export interface SpokiClientOptions {
	apiKey: string;
}

export class SpokiClient {
	private readonly apiKey: string;

	constructor(options: SpokiClientOptions) {
		if (!options.apiKey) {
			throw new Error('Spoki API key is required');
		}

		this.apiKey = options.apiKey;
	}

	async request<T>(path: string, options: RequestInit = {}): Promise<T> {
		const response = await fetch(`${SPOKI_BASE_URL}${path}`, {
			...options,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Spoki-Api-Key': this.apiKey,
				...options.headers,
			},
		});

		const text = await response.text();

		let body: unknown;

		if (text) {
			try {
				body = JSON.parse(text);
			} catch {
				body = text;
			}
		}

		if (!response.ok) {
			throw new SpokiApiError(
				response.status,
				`Spoki API request failed with status ${response.status}`,
				body,
			);
		}

		return body as T;
	}

	async get<T>(path: string): Promise<T> {
		return this.request<T>(path, {
			method: 'GET',
		});
	}

	async post<T>(path: string, body: unknown): Promise<T> {
		return this.request<T>(path, {
			method: 'POST',
			body: JSON.stringify(body),
		});
	}

	async put<T>(path: string, body: unknown): Promise<T> {
		return this.request<T>(path, {
			method: 'PUT',
			body: JSON.stringify(body),
		});
	}

	async delete<T>(path: string): Promise<T> {
		return this.request<T>(path, {
			method: 'DELETE',
		});
	}
}
