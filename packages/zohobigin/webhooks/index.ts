import type { CorsairWebhook } from 'corsair/core';
import type { ZohoBiginContext } from '..';
import { example } from './example';
import type { ExampleEvent, ZohoBiginWebhookOutputs } from './types';

export const ExampleWebhooks = {
	example: example,
};

export type ZohoBiginWebhooks = {
	example: CorsairWebhook<
		ZohoBiginContext,
		ExampleEvent,
		ZohoBiginWebhookOutputs['example']
	>;
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
