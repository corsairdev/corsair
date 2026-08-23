import type { CloudflareBrowserRenderingContext } from './index';

export class CloudflareBrowserRenderingClient {
	private ctx: CloudflareBrowserRenderingContext;
	private baseUrl = 'https://api.cloudflare.com/client/v4';

	constructor(ctx: CloudflareBrowserRenderingContext) {
		this.ctx = ctx;
	}

	private async request<T>(path: string, options?: RequestInit): Promise<T> {
		const apiKey = await this.ctx.keyBuilder('endpoint');

		const response = await fetch(`${this.baseUrl}${path}`, {
			...options,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				...options?.headers,
			},
		});

		if (!response.ok) {
			throw new Error(
				`Cloudflare API error: ${response.status} ${response.statusText}`,
			);
		}

		const data = (await response.json()) as {
			success: boolean;
			result: T;
			errors?: unknown[];
		};

		if (!data.success) {
			throw new Error(
				`Cloudflare API returned errors: ${JSON.stringify(data.errors)}`,
			);
		}

		return data.result;
	}

	async listAccounts() {
		return this.request<Array<{ id: string; name: string }>>('/accounts');
	}

	async captureScreenshot(
		accountId: string,
		url: string,
		viewport?: { width: number; height: number },
	) {
		return this.request<string>(
			`/accounts/${accountId}/browser-rendering/screenshot`,
			{
				method: 'POST',
				body: JSON.stringify({ url, viewport }),
			},
		);
	}

	async takeWebpageSnapshot(accountId: string, url: string) {
		return this.request<{ html: string; screenshot: string }>(
			`/accounts/${accountId}/browser-rendering/snapshot`,
			{
				method: 'POST',
				body: JSON.stringify({ url }),
			},
		);
	}

	async scrapeHtmlElements(
		accountId: string,
		url: string,
		selectors: string[],
	) {
		return this.request<Record<string, unknown>>(
			`/accounts/${accountId}/browser-rendering/scrape`,
			{
				method: 'POST',
				body: JSON.stringify({
					url,
					elements: selectors.map((s) => ({ selector: s })),
				}),
			},
		);
	}
}
