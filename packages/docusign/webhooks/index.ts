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
	[key: string]: unknown;
}

export const handleWebhook = {
	match: (event: unknown): boolean => {
		if (!event || typeof event !== 'object') {
			return false;
		}
		const payload = event as DocusignWebhookEvent;
		return (
			typeof payload.event === 'string' ||
			Boolean(payload.data?.envelopeId) ||
			Boolean(payload.envelopeId)
		);
	},
	handler: async (event: DocusignWebhookEvent, context?: unknown) => {
		return {
			received: true,
			event: event.event ?? 'docusign.event',
			envelopeId: event.data?.envelopeId ?? (event as any).envelopeId,
			data: event.data ?? event,
		};
	},
};
