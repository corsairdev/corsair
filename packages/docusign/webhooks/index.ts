import type { DocusignWebhookEvent } from './types';

export const handleWebhook = async (payload: DocusignWebhookEvent) => {
	return {
		received: true,
		event: payload.event,
		data: payload.data,
	};
};

export * from './types';