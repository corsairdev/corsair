import { delivery } from './events';

export const SaperlyWebhooks = {
	delivery,
};

export { matchSaperlyTenantWebhook } from './tenant-matcher';
export type {
	ConfirmedDelivery,
	DeliveryEnvelope,
	SaperlyWebhookOutputs,
} from './types';
export { ConfirmedDeliverySchema, DeliveryEnvelopeSchema } from './types';
