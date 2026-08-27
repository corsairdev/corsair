import { ApiError } from 'corsair/http';
import type {
	AppVeyorBuildResponse,
	AppVeyorConfig,
	AppVeyorProject,
} from './types';

export * from './types';

export class AppVeyorClient {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(config: AppVeyorConfig) {
		if (!config.apiKey) {
			throw new Error('AppVeyor API key is required.');
		}
		this.apiKey = config.apiKey;
		this.baseUrl = config.baseUrl || 'https://ci.appveyor.com/api';
	}

	async getProjects(): Promise<AppVeyorProject[]> {
		const url = `${this.baseUrl}/projects`;

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		});

		const text = await res.text();

		if (!res.ok) {
			const retryAfter = parseRetryAfter(res.headers.get('Retry-After'));

			throw new ApiError(
				{
					method: 'GET',
					url,
				},
				{
					url,
					ok: false,
					status: res.status,
					statusText: res.statusText,
					body: text,
				},
				`AppVeyor API Error [${res.status} ${res.statusText}]: ${text}`,
				{
					retryAfter,
				},
			);
		}

		return JSON.parse(text) as AppVeyorProject[];
	}

	async getLastBuild(
		accountName: string,
		projectSlug: string,
	): Promise<AppVeyorBuildResponse> {
		const url = `${this.baseUrl}/projects/${accountName}/${projectSlug}`;

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		});

		const text = await res.text();

		if (!res.ok) {
			const retryAfter = parseRetryAfter(res.headers.get('Retry-After'));

			throw new ApiError(
				{
					method: 'GET',
					url,
				},
				{
					url,
					ok: false,
					status: res.status,
					statusText: res.statusText,
					body: text,
				},
				`AppVeyor API Error [${res.status} ${res.statusText}]: ${text}`,
				{
					retryAfter,
				},
			);
		}

		return JSON.parse(text) as AppVeyorBuildResponse;
	}
}

export function parseRetryAfter(header: string | null): number | undefined {
	if (!header) {
		return undefined;
	}

	const seconds = Number(header);

	if (Number.isFinite(seconds)) {
		return Math.max(0, seconds) * 1000;
	}

	const when = Date.parse(header);

	return Number.isNaN(when) ? undefined : Math.max(0, when - Date.now());
}
