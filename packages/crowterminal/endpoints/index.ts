import { register } from './agent';
import { getTypes, ingest, ingestBulk } from './data';
import { getByokPlatform, getPlatform } from './intelligence';
import {
	compareMd,
	engagementAnalysis,
	getBulk as getBulkMemory,
	getChangelog,
	get as getMemory,
	getPattern,
	validateChanges,
} from './memory';
import {
	engagementAnalysis as sandboxEngagementAnalysis,
	getClient as sandboxGetClient,
	getMemory as sandboxGetMemory,
	validate as sandboxValidate,
} from './sandbox';
import {
	getComponents,
	getHistory,
	getIncidents,
	get as getStatus,
	getUptime,
	ping,
} from './status';
import {
	create as createWebhook,
	deleteWebhook,
	list as listWebhooks,
	test as testWebhook,
	update as updateWebhook,
} from './webhooks';

export const Memory = {
	get: getMemory,
	getBulk: getBulkMemory,
	getChangelog,
	getPattern,
	engagementAnalysis,
	compareMd,
	validateChanges,
};

export const Data = {
	ingest,
	ingestBulk,
	getTypes,
};

export const Intelligence = {
	getPlatform,
	getByokPlatform,
};

export const Status = {
	get: getStatus,
	ping,
	getComponents,
	getIncidents,
	getHistory,
	getUptime,
};

export const Sandbox = {
	getClient: sandboxGetClient,
	getMemory: sandboxGetMemory,
	engagementAnalysis: sandboxEngagementAnalysis,
	validate: sandboxValidate,
};

export const Agent = {
	register,
};

export const Webhooks = {
	create: createWebhook,
	list: listWebhooks,
	update: updateWebhook,
	delete: deleteWebhook,
	test: testWebhook,
};

export * from './types';
