import {
	create as botsCreate,
	get as botsGet,
	list as botsList,
	update as botsUpdate,
	remove as botsDelete,
} from './bots';
import {
	list as conversationsList,
	get as conversationsGet,
} from './conversations';
import { send as messagesSend, list as messagesList } from './messages';
import {
	deploy as deploymentsDeploy,
	getStatus as deploymentsGetStatus,
} from './deployments';
import { getSummary as analyticsGetSummary } from './analytics';

export const Bots = {
	create: botsCreate,
	get: botsGet,
	list: botsList,
	update: botsUpdate,
	delete: botsDelete,
};

export const Conversations = {
	list: conversationsList,
	get: conversationsGet,
};

export const Messages = {
	send: messagesSend,
	list: messagesList,
};

export const Deployments = {
	deploy: deploymentsDeploy,
	getStatus: deploymentsGetStatus,
};

export const Analytics = {
	getSummary: analyticsGetSummary,
};

export * from './types';
