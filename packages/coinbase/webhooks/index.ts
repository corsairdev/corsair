import { newPayment } from './new-payment';
import { ping } from './ping';

export const NotificationWebhooks = {
	ping,
	newPayment,
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
