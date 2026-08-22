import { ingest } from './data';
import { engagementAnalysis, get as getMemory } from './memory';
import { get as getStatus } from './status';
import {
	create as createWebhook,
	deleteWebhook,
	list as listWebhooks,
	test as testWebhook,
	update as updateWebhook,
} from './webhooks';

export const Memory = {
	get: getMemory,
	engagementAnalysis,
};

export const Data = {
	ingest,
};

export const Status = {
	get: getStatus,
};

export const Webhooks = {
	create: createWebhook,
	list: listWebhooks,
	update: updateWebhook,
	delete: deleteWebhook,
	test: testWebhook,
};

export * from './types';
