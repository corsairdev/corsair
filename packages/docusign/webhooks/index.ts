export interface DocusignWebhookEvent {
	event?: string;
	apiVersion?: string;
	uri?: string;
	retryCount?: number;
	configurationId?: number;
	generatedDateTime?: string;
	data?: {
		accountId?: string;
		userId?: string;
		envelopeId?: string;
		envelopeSummary?: Record<string, unknown>;
		[key: string]: unknown;
	};
	envelopeId?: string;
	[key: string]: unknown;
}

export interface WebhookRequest {
	body?: DocusignWebhookEvent | Record<string, unknown>;
	headers?: Record<string, string>;
	[key: string]: unknown;
}

export const handleWebhook = {
	match: (context: unknown, request?: unknown): boolean => {
		const req = (request ?? context) as
			| WebhookRequest
			| DocusignWebhookEvent
			| undefined;
		const payload = ((req as WebhookRequest)?.body ??
			req ??
			{}) as DocusignWebhookEvent;

		if (!payload || typeof payload !== 'object') {
			return false;
		}

		return (
			typeof payload.event === 'string' ||
			Boolean(payload.data?.envelopeId) ||
			Boolean(payload.envelopeId)
		);
	},
	handler: async (context: unknown, request: unknown) => {
		const req = request as WebhookRequest | DocusignWebhookEvent | undefined;
		const payload = ((req as WebhookRequest)?.body ??
			req ??
			{}) as DocusignWebhookEvent;

		return {
			received: true,
			event: payload.event ?? 'docusign.event',
			envelopeId: payload.data?.envelopeId ?? payload.envelopeId,
			data: payload.data ?? payload,
		};
	},
};

export const webhooks = {
	handleWebhook,
};

export default webhooks;
