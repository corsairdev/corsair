import { getTrigger, getTriggers, triggerBroadcast } from './broadcasts';
import { sendBatch, trackPage, trackScreen } from './cdp';
import { listCollections } from './collections';
import { addPersonToGroup } from './groups';
import { listIpAddresses } from './info';
import { getMessages } from './messages';
import { listNewsletters } from './newsletters';
import {
	createAlias,
	identifyPerson,
	reportPushEvents,
	suppressPerson,
	trackEvent,
	unsubscribeDelivery,
} from './profiles';
import { getWebhooks } from './reporting-webhooks';
import {
	getSegmentDetails,
	getSegmentMembership,
	getSegments,
} from './segments';
import { listSnippets } from './snippets';
import { listTransactionalMessages } from './transactional';

export const Broadcasts = {
	triggerBroadcast,
	getTriggers,
	getTrigger,
};

export const Segments = {
	getSegments,
	getSegmentDetails,
	getSegmentMembership,
};

export const Messages = {
	getMessages,
};

export const Profiles = {
	identifyPerson,
	createAlias,
	suppressPerson,
	trackEvent,
	unsubscribeDelivery,
	reportPushEvents,
};

export const Groups = {
	addPersonToGroup,
};

export const Collections = {
	listCollections,
};

export const Info = {
	listIpAddresses,
};

export const Newsletters = {
	listNewsletters,
};

export const Snippets = {
	listSnippets,
};

export const Transactional = {
	listTransactionalMessages,
};

export const ReportingWebhooks = {
	getWebhooks,
};

export const Cdp = {
	sendBatch,
	trackPage,
	trackScreen,
};

export * from './types';
