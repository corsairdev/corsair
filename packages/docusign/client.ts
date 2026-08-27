export interface DocusignAuthOptions {
	accessToken: string;
	accountId: string;
	baseUri?: string;
}

export class DocusignClient {
	private accessToken: string;
	private accountId: string;
	private baseUri: string;

	constructor(options: DocusignAuthOptions) {
		this.accessToken = options.accessToken;
		this.accountId = options.accountId;
		this.baseUri = this.resolveAndValidateBaseUri(options.baseUri);
	}

	private resolveAndValidateBaseUri(baseUri?: string): string {
		const raw = baseUri || 'https://demo.docusign.net/restapi/v2.1';
		const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);

		if (url.protocol !== 'https:') {
			throw new Error('DocuSign baseUri must use HTTPS.');
		}

		const host = url.hostname.toLowerCase();
		const isAllowedHost =
			host === 'docusign.com' ||
			host.endsWith('.docusign.com') ||
			host === 'docusign.net' ||
			host.endsWith('.docusign.net');

		if (!isAllowedHost) {
			throw new Error(
				`Untrusted DocuSign baseUri host: "${host}". Must be a valid *.docusign.com or *.docusign.net domain.`,
			);
		}

		let path = url.pathname.replace(/\/+$/, '');
		if (!path.includes('/restapi/v2.1')) {
			path = `${path}/restapi/v2.1`;
		}
		if (!path.includes(`/accounts/${this.accountId}`)) {
			path = `${path}/accounts/${this.accountId}`;
		}

		return `${url.origin}${path}`;
	}

	async request<T = unknown>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
		const url = `${this.baseUri}${path}`;

		const response = await fetch(url, {
			...options,
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorBody = await response.text();
			throw new Error(`DocuSign API error (${response.status}): ${errorBody}`);
		}

		return response.json() as Promise<T>;
	}
}
