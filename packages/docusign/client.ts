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

		let root = options.baseUri?.trim() || 'https://demo.docusign.net/restapi';
		while (root.endsWith('/')) {
			root = root.slice(0, -1);
		}

		this.baseUri = `${root}/v2.1/accounts/${this.accountId}`;
	}

	async request<T = any>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
		const url = `${this.baseUri}${cleanPath}`;

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
