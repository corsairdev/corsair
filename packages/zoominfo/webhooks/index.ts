import { companyUpdate, contactUpdate } from './updates';

export const ZoominfoWebhookHandlers = {
	contactUpdate,
	companyUpdate,
};

export * from './tenant-matcher';
export * from './types';
