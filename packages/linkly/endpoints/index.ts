import { test as authTest } from './auth';
import { exportClicks, getCounters, getTimeSeries } from './clicks';
import {
	create as conversionsCreate,
	list as conversionsList,
} from './conversions';
import {
	create as domainsCreate,
	remove as domainsDelete,
	list as domainsList,
	updateFavicon as domainsUpdateFavicon,
} from './domains';
import {
	bulkUpsert,
	create,
	exportLinks,
	get,
	getDetails,
	list,
	remove,
	removeMany,
	restore,
	update,
} from './links';
import {
	listForLink,
	subscribe,
	subscribeToLink,
	unsubscribe,
	unsubscribeFromLink,
	list as webhooksList,
} from './webhooks';
import { listWorkspaces, update as workspacesUpdate } from './workspaces';

export const Auth = { test: authTest };
export const Workspaces = { listWorkspaces, update: workspacesUpdate };
export const Links = {
	list,
	get,
	getDetails,
	create,
	update,
	bulkUpsert,
	remove,
	removeMany,
	restore,
	export: exportLinks,
};
export const Clicks = { getTimeSeries, getCounters, export: exportClicks };
export const Domains = {
	list: domainsList,
	create: domainsCreate,
	delete: domainsDelete,
	updateFavicon: domainsUpdateFavicon,
};
export const Webhooks = {
	list: webhooksList,
	subscribe,
	unsubscribe,
	listForLink,
	subscribeToLink,
	unsubscribeFromLink,
};
export const Conversions = { list: conversionsList, create: conversionsCreate };

export * from './types';
