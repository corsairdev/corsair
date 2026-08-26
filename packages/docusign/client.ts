export interface DocusignAuthOptions {
	accessToken: string;
	accountId: string;
	baseUri?: string;
}

export class DocusignClient {
	public baseUri: string;
	public accountId: string;
	private token: string;

	constructor(options: DocusignAuthOptions) {
		this.accountId = options.accountId;
		this.token = options.accessToken;
		const root = options.baseUri || 'https://demo.docusign.net/restapi';
		this.baseUri = `${root.replace(/\/+$/, '')}/v2.1/accounts/${this.accountId}`;
	}

	async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUri}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
		const response = await fetch(url, {
			...options,
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`DocuSign API Error (${response.status}): ${errorText}`);
		}

		return response.json() as Promise<T>;
	}
}