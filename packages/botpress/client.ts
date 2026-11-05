import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const BOTPRESS_API_BASE = 'https://api.botpress.cloud';

/**
 * Botpress documents no published rate-limit numbers for the Admin/Billing/
 * Files/Chat surface covered here. It answers over-limit requests with a
 * standard 429, so the retry loop reacts to that rather than pacing
 * proactively against a budget it is never told.
 */
const BOTPRESS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Raised when an operation needs a workspace id and none could be determined.
 *
 * A Botpress Personal Access Token can reach several workspaces, so the
 * workspace is a second credential rather than something derivable from the
 * token alone — confirmed live: `POST /v1/admin/bots` answers 400
 * `request/headers must have required property 'x-workspace-id'` when the
 * header is omitted.
 */
export class BotpressWorkspaceIdMissingError extends Error {
	constructor() {
		super(
			'Botpress requires a workspace id for this operation. Set `workspaceId` ' +
				'in the plugin options, or store one under the `workspace_id` key.',
		);
		this.name = 'BotpressWorkspaceIdMissingError';
	}
}

/**
 * Raised when an operation needs a bot id and none was supplied.
 *
 * Unlike the workspace, the bot varies per call rather than per account — a
 * workspace can hold many bots — so it is taken as an explicit input field on
 * the chat, files, knowledge-base and table operations rather than resolved
 * as account-level configuration. Confirmed live:
 * `GET /v1/files/tags` answers 400 "Request is missing some required
 * authentication params" without `x-bot-id`, and `GET /v1/chat/conversations`
 * answers 400 `request/headers must have required property 'x-bot-id'`.
 */
export class BotpressBotIdMissingError extends Error {
	constructor() {
		super('Botpress requires a `botId` input for this operation.');
		this.name = 'BotpressBotIdMissingError';
	}
}

type BotpressWorkspaceListPage = {
	workspaces?: { id?: string }[];
};

/**
 * Resolves the workspace reachable by a token.
 *
 * Only used when no workspace id was configured. `GET /v1/admin/workspaces`
 * is scoped to the token's own account and needs no `x-workspace-id` header
 * (confirmed live), so it is safe to call before a workspace id is known.
 * Discovery is only unambiguous for a single workspace; with several, the
 * caller has to say which one.
 */
export async function discoverBotpressWorkspaceId(
	personalAccessToken: string,
): Promise<string> {
	const payload = await makeBotpressRequest<BotpressWorkspaceListPage>(
		'/v1/admin/workspaces',
		personalAccessToken,
		{ method: 'GET' },
	);

	const workspaces = payload?.workspaces ?? [];
	const only = workspaces.length === 1 ? workspaces[0] : undefined;
	if (!only?.id?.trim()) throw new BotpressWorkspaceIdMissingError();

	return only.id.trim();
}

export type BotpressRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<
		string,
		string | number | boolean | string[] | Record<string, string> | undefined
	>;
	/**
	 * Scopes the request to a workspace via `x-workspace-id`. Harmless to send
	 * on requests that do not need it (confirmed live against the public hub
	 * and path-scoped workspace endpoints), so callers that have a resolved
	 * workspace id can pass it unconditionally.
	 */
	workspaceId?: string;
	/**
	 * Scopes the request to a bot via `x-bot-id`, required by the chat, files,
	 * knowledge-base and table operations.
	 */
	botId?: string;
};

/**
 * Issues a Botpress request with Bearer auth, optional workspace/bot scoping
 * headers, and rate-limit retries.
 *
 * Every admin, billing, files, chat and table operation in this catalog lives
 * on the single `api.botpress.cloud` host — confirmed live. Earlier
 * reconnaissance for this integration assumed the Chat API lived on a
 * separate `chat.botpress.cloud` host per Botpress's docs prose; a live probe
 * of `chat.botpress.cloud/v1/chat/conversations` returned a webhook-handler
 * 404 ("Integration with webhook ID \"v1\" not found"), while the same path
 * against `api.botpress.cloud` with an `x-bot-id` header succeeded. The docs
 * describe the separate host for the SDK/webhook messaging surface, not for
 * these direct REST calls.
 */
export async function makeBotpressRequest<T>(
	path: string,
	personalAccessToken: string,
	options: BotpressRequestOptions = {},
): Promise<T> {
	const token = personalAccessToken.trim();
	if (!token) {
		throw new AuthMissingError('botpress', 'api_key');
	}

	const { method = 'GET', body, query, workspaceId, botId } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
	if (workspaceId !== undefined) {
		if (!workspaceId.trim()) throw new BotpressWorkspaceIdMissingError();
		headers['x-workspace-id'] = workspaceId.trim();
	}
	if (botId !== undefined) {
		if (!botId.trim()) throw new BotpressBotIdMissingError();
		headers['x-bot-id'] = botId.trim();
	}

	const config: OpenAPIConfig = {
		BASE: BOTPRESS_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: BOTPRESS_RATE_LIMIT_CONFIG,
	});
}
