import type { CorsairWebhook } from 'corsair/core';
import type { ZohoBiginContext } from '..';
import type {
	ZohoBiginNotificationEvent,
	ZohoBiginWebhookOutputs,
} from './types';

export type ZohoBiginWebhooks = {
	notification: CorsairWebhook<
		ZohoBiginContext,
		ZohoBiginNotificationEvent,
		ZohoBiginWebhookOutputs['notification']
	>;
};
export * from './types';
