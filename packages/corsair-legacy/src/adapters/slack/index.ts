export type SlackSendMessageParams = {
	channel: string;
	text: string;
	threadTs?: string | undefined;
	blocks?: unknown | undefined;
};

export type SlackSendMessageResponse = {
	ok: boolean;
	error?: string | undefined;
	channel?: string | undefined;
	ts?: string | undefined;
	message?: unknown | undefined;
};

export type SlackAdapterOptions = {
	token: string;
	fetch?: typeof fetch | undefined;
	baseUrl?: string | undefined;
};

export type SlackClient = {
	sendMessage: (
		params: SlackSendMessageParams,
	) => Promise<SlackSendMessageResponse>;
};

export function slackAdapter(options: SlackAdapterOptions): SlackClient {
	const baseUrl = options.baseUrl ?? 'https://slack.com/api';
	const f = options.fetch ?? fetch;

	return {
		async sendMessage(params) {
			const res = await f(`${baseUrl}/chat.postMessage`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json; charset=utf-8',
					authorization: `Bearer ${options.token}`,
				},
				body: JSON.stringify({
					channel: params.channel,
					text: params.text,
					thread_ts: params.threadTs,
					blocks: params.blocks,
				}),
			});

			const json = (await res.json()) as any;
			return {
				ok: Boolean(json.ok),
				error: typeof json.error === 'string' ? json.error : undefined,
				channel: typeof json.channel === 'string' ? json.channel : undefined,
				ts: typeof json.ts === 'string' ? json.ts : undefined,
				message: json.message,
			};
		},
	};
}
