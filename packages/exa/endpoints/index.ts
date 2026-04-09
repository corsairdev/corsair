import { getAnswer } from './answer';
import { getContents } from './contents';
import { getEvent, listEvents } from './events';
import { createImport, deleteImport, listImports } from './imports';
import { createMonitor } from './monitors';
import { findSimilar, search } from './search';
import { listWebhooks } from './webhooks-api';
import { createWebset, deleteWebset, getWebset } from './websets';

export const Search = {
	search,
	findSimilar,
};

export const Contents = {
	get: getContents,
};

export const Answer = {
	get: getAnswer,
};

export const Websets = {
	create: createWebset,
	get: getWebset,
	delete: deleteWebset,
};

export const Imports = {
	create: createImport,
	list: listImports,
	delete: deleteImport,
};

export const Monitors = {
	create: createMonitor,
};

export const Events = {
	list: listEvents,
	get: getEvent,
};

export const WebhooksApi = {
	list: listWebhooks,
};

export * from './types';
