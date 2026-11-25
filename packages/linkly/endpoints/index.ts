import { getCounters, getTimeSeries } from './clicks';
import { list as domainsList } from './domains';
import {
	create,
	exportLinks,
	get,
	list,
	remove,
	restore,
	update,
} from './links';
import { subscribe, unsubscribe, list as webhooksList } from './webhooks';
import { listWorkspaces } from './workspaces';

export const Workspaces = { listWorkspaces };
export const Links = {
	list,
	get,
	create,
	update,
	remove,
	restore,
	export: exportLinks,
};
export const Clicks = { getTimeSeries, getCounters };
export const Domains = { list: domainsList };
export const Webhooks = { list: webhooksList, subscribe, unsubscribe };

export * from './types';
