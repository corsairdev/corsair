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
		const res = await fetch(`${this.baseUrl}/projects`, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(
				`AppVeyor API Error [${res.status} ${res.statusText}]: ${text}`,
			);
		}
		return (await res.json()) as AppVeyorProject[];
	}

	async getLastBuild(
		accountName: string,
		projectSlug: string,
	): Promise<AppVeyorBuildResponse> {
		const res = await fetch(
			`${this.baseUrl}/projects/${accountName}/${projectSlug}`,
			{
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			},
		);
		if (!res.ok) {
			const text = await res.text();
			throw new Error(
				`AppVeyor API Error [${res.status} ${res.statusText}]: ${text}`,
			);
		}
		return (await res.json()) as AppVeyorBuildResponse;
	}
}
