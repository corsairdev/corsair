/**
 * Minimal HTTP client for Gmail API
 * Uses native fetch - no external dependencies
 */

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

class GmailAPIError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message);
		this.name = 'GmailAPIError';
	}
}

async function makeRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: string;
		body?: unknown;
		params?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, params } = options;
	
	let url = `${GMAIL_API_BASE}${endpoint}`;
	if (params && Object.keys(params).length > 0) {
		const searchParams = new URLSearchParams(params);
		url += `?${searchParams.toString()}`;
	}

	const headers: Record<string, string> = {
		Authorization: `Bearer ${accessToken}`,
	};

	if (body) {
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(url, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new GmailAPIError(
			errorData.error?.message || `HTTP error! status: ${response.status}`,
			errorData.error?.code || `http_${response.status}`,
		);
	}

	return response.json() as Promise<T>;
}

export interface GmailClient {
	sendMessage(params: {
		to: string;
		subject: string;
		body: string;
		threadId?: string;
	}): Promise<{
		id: string;
		threadId: string;
		labelIds: string[];
	}>;

	listMessages(params?: {
		maxResults?: number;
		pageToken?: string;
		q?: string;
		labelIds?: string[];
	}): Promise<{
		messages: Array<{ id: string; threadId: string }>;
		nextPageToken?: string;
		resultSizeEstimate: number;
	}>;

	getMessage(id: string): Promise<{
		id: string;
		threadId: string;
		labelIds: string[];
		snippet: string;
		payload: {
			headers: Array<{ name: string; value: string }>;
			body?: {
				data?: string;
			};
			parts?: Array<{
				body?: { data?: string };
				mimeType: string;
			}>;
		};
		internalDate: string;
	}>;

	listThreads(params?: {
		maxResults?: number;
		pageToken?: string;
		q?: string;
		labelIds?: string[];
	}): Promise<{
		threads: Array<{ id: string; historyId: string; snippet: string }>;
		nextPageToken?: string;
		resultSizeEstimate: number;
	}>;

	getThread(id: string): Promise<{
		id: string;
		historyId: string;
		messages: Array<{
			id: string;
			threadId: string;
			labelIds: string[];
			snippet: string;
		}>;
	}>;

	listLabels(): Promise<{
		labels: Array<{
			id: string;
			name: string;
			type: string;
			color?: { backgroundColor?: string; textColor?: string };
		}>;
	}>;

	createDraft(params: {
		to: string;
		subject: string;
		body: string;
	}): Promise<{
		id: string;
		message: {
			id: string;
			threadId: string;
		};
	}>;
}

export function createGmailClient(accessToken: string): GmailClient {
	return {
		async sendMessage(params) {
			// Create message in RFC 2822 format
			const message = [
				`To: ${params.to}`,
				`Subject: ${params.subject}`,
				'Content-Type: text/plain; charset=utf-8',
				'',
				params.body,
			].join('\n');

			const encodedMessage = Buffer.from(message)
				.toString('base64')
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=+$/, '');

			const body: { raw: string; threadId?: string } = {
				raw: encodedMessage,
			};

			if (params.threadId) {
				body.threadId = params.threadId;
			}

			return makeRequest<ReturnType<GmailClient['sendMessage']>>(
				'/users/me/messages/send',
				accessToken,
				{
					method: 'POST',
					body,
				},
			);
		},

		async listMessages(params) {
			const queryParams: Record<string, string> = {};
			if (params?.maxResults) {
				queryParams.maxResults = params.maxResults.toString();
			}
			if (params?.pageToken) {
				queryParams.pageToken = params.pageToken;
			}
			if (params?.q) {
				queryParams.q = params.q;
			}
			if (params?.labelIds && params.labelIds.length > 0) {
				queryParams.labelIds = params.labelIds.join(',');
			}

			return makeRequest<ReturnType<GmailClient['listMessages']>>(
				'/users/me/messages',
				accessToken,
				{ params: queryParams },
			);
		},

		async getMessage(id) {
			return makeRequest<ReturnType<GmailClient['getMessage']>>(
				`/users/me/messages/${id}`,
				accessToken,
			);
		},

		async listThreads(params) {
			const queryParams: Record<string, string> = {};
			if (params?.maxResults) {
				queryParams.maxResults = params.maxResults.toString();
			}
			if (params?.pageToken) {
				queryParams.pageToken = params.pageToken;
			}
			if (params?.q) {
				queryParams.q = params.q;
			}
			if (params?.labelIds && params.labelIds.length > 0) {
				queryParams.labelIds = params.labelIds.join(',');
			}

			return makeRequest<ReturnType<GmailClient['listThreads']>>(
				'/users/me/threads',
				accessToken,
				{ params: queryParams },
			);
		},

		async getThread(id) {
			return makeRequest<ReturnType<GmailClient['getThread']>>(
				`/users/me/threads/${id}`,
				accessToken,
			);
		},

		async listLabels() {
			return makeRequest<ReturnType<GmailClient['listLabels']>>(
				'/users/me/labels',
				accessToken,
			);
		},

		async createDraft(params) {
			const message = [
				`To: ${params.to}`,
				`Subject: ${params.subject}`,
				'Content-Type: text/plain; charset=utf-8',
				'',
				params.body,
			].join('\n');

			const encodedMessage = Buffer.from(message)
				.toString('base64')
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=+$/, '');

			return makeRequest<ReturnType<GmailClient['createDraft']>>(
				'/users/me/drafts',
				accessToken,
				{
					method: 'POST',
					body: {
						message: {
							raw: encodedMessage,
						},
					},
				},
			);
		},
	};
}

export { GmailAPIError };

