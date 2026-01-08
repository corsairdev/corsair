/**
 * Minimal HTTP client for Slack Web API
 * Uses native fetch - no external dependencies
 */

const SLACK_API_BASE = 'https://slack.com/api';

type SlackAPIResponse<T> = {
	ok: boolean;
	error?: string;
} & T;

class SlackAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SlackAPIError';
	}
}

async function makeRequest<T>(
	endpoint: string,
	token: string,
	body: Record<string, unknown> = {},
): Promise<T> {
	const url = `${SLACK_API_BASE}/${endpoint}`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new SlackAPIError(
			`HTTP error! status: ${response.status}`,
			`http_${response.status}`,
		);
	}

	const data = (await response.json()) as SlackAPIResponse<T>;

	if (!data.ok) {
		throw new SlackAPIError(
			data.error || 'Unknown Slack API error',
			data.error,
		);
	}

	return data;
}

export interface SlackClient {
	postMessage(params: {
		channel: string;
		text: string;
		thread_ts?: string;
	}): Promise<{
		ok: boolean;
		ts: string;
		channel: string;
		message: {
			text: string;
			user: string;
			ts: string;
		};
	}>;

	getMessages(params: {
		channel: string;
		limit?: number;
		oldest?: string;
		latest?: string;
		cursor?: string;
	}): Promise<{
		ok: boolean;
		messages: Array<{
			type: string;
			user?: string;
			text: string;
			ts: string;
			thread_ts?: string;
		}>;
		has_more: boolean;
		response_metadata?: {
			next_cursor?: string;
		};
	}>;

	getChannels(params: {
		types?: string;
		exclude_archived?: boolean;
		limit?: number;
		cursor?: string;
	}): Promise<{
		ok: boolean;
		channels: Array<{
			id: string;
			name: string;
			is_private: boolean;
			is_archived: boolean;
		}>;
		response_metadata?: {
			next_cursor?: string;
		};
	}>;

	updateMessage(params: {
		channel: string;
		ts: string;
		text: string;
	}): Promise<{
		ok: boolean;
		ts: string;
		channel: string;
		text: string;
	}>;

	addReaction(params: {
		channel: string;
		timestamp: string;
		name: string;
	}): Promise<{
		ok: boolean;
	}>;
}

export function createSlackClient(token: string): SlackClient {
	return {
		async postMessage(params) {
			return makeRequest<ReturnType<SlackClient['postMessage']>>(
				'chat.postMessage',
				token,
				params,
			);
		},

		async getMessages(params) {
			return makeRequest<ReturnType<SlackClient['getMessages']>>(
				'conversations.history',
				token,
				params,
			);
		},

		async getChannels(params) {
			const result = await makeRequest<{
				ok: boolean;
				channels: Array<{
					id: string;
					name: string;
					is_private?: boolean;
					is_archived?: boolean;
				}>;
				response_metadata?: {
					next_cursor?: string;
				};
			}>('conversations.list', token, params);

			return {
				...result,
				channels: result.channels.map((ch) => ({
					id: ch.id,
					name: ch.name,
					is_private: ch.is_private ?? false,
					is_archived: ch.is_archived ?? false,
				})),
			};
		},

		async updateMessage(params) {
			return makeRequest<ReturnType<SlackClient['updateMessage']>>(
				'chat.update',
				token,
				params,
			);
		},

		async addReaction(params) {
			// Remove colons from emoji name if present
			const emojiName = params.name.replace(/:/g, '');
			return makeRequest<ReturnType<SlackClient['addReaction']>>(
				'reactions.add',
				token,
				{
					...params,
					name: emojiName,
				},
			);
		},
	};
}

export { SlackAPIError };
