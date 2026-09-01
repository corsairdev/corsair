import type { RequiredPluginWebhookSchemas } from 'corsair/core';
import {
	kaseClosed,
	kaseCreated,
	kaseDeleted,
	kaseMoved,
	kaseUpdated,
	opportunityClosed,
	opportunityCreated,
	opportunityDeleted,
	opportunityMoved,
	opportunityUpdated,
	partyCreated,
	partyDeleted,
	partyUpdated,
	taskCompleted,
	taskCreated,
	taskUpdated,
	userCreated,
	userDeleted,
	userUpdated,
} from './handlers';
import {
	CapsuleCrmRestHookPayloadSchema,
	CapsuleCrmWebhookResponseSchema,
} from './types';

export const capsuleCrmWebhooksNested = {
	parties: {
		created: partyCreated,
		updated: partyUpdated,
		deleted: partyDeleted,
	},
	projects: {
		created: kaseCreated,
		updated: kaseUpdated,
		deleted: kaseDeleted,
		closed: kaseClosed,
		moved: kaseMoved,
	},
	opportunities: {
		created: opportunityCreated,
		updated: opportunityUpdated,
		deleted: opportunityDeleted,
		closed: opportunityClosed,
		moved: opportunityMoved,
	},
	tasks: {
		created: taskCreated,
		updated: taskUpdated,
		completed: taskCompleted,
	},
	users: {
		created: userCreated,
		updated: userUpdated,
		deleted: userDeleted,
	},
} as const;

const restHookSchema = {
	payload: CapsuleCrmRestHookPayloadSchema,
	response: CapsuleCrmWebhookResponseSchema,
};

export const capsuleCrmWebhookSchemas = {
	'parties.created': {
		description: 'Capsule REST hook party/created',
		...restHookSchema,
	},
	'parties.updated': {
		description: 'Capsule REST hook party/updated',
		...restHookSchema,
	},
	'parties.deleted': {
		description: 'Capsule REST hook party/deleted',
		...restHookSchema,
	},
	'projects.created': {
		description: 'Capsule REST hook kase/created',
		...restHookSchema,
	},
	'projects.updated': {
		description: 'Capsule REST hook kase/updated',
		...restHookSchema,
	},
	'projects.deleted': {
		description: 'Capsule REST hook kase/deleted',
		...restHookSchema,
	},
	'projects.closed': {
		description: 'Capsule REST hook kase/closed',
		...restHookSchema,
	},
	'projects.moved': {
		description: 'Capsule REST hook kase/moved',
		...restHookSchema,
	},
	'opportunities.created': {
		description: 'Capsule REST hook opportunity/created',
		...restHookSchema,
	},
	'opportunities.updated': {
		description: 'Capsule REST hook opportunity/updated',
		...restHookSchema,
	},
	'opportunities.deleted': {
		description: 'Capsule REST hook opportunity/deleted',
		...restHookSchema,
	},
	'opportunities.closed': {
		description: 'Capsule REST hook opportunity/closed',
		...restHookSchema,
	},
	'opportunities.moved': {
		description: 'Capsule REST hook opportunity/moved',
		...restHookSchema,
	},
	'tasks.created': {
		description: 'Capsule REST hook task/created',
		...restHookSchema,
	},
	'tasks.updated': {
		description: 'Capsule REST hook task/updated',
		...restHookSchema,
	},
	'tasks.completed': {
		description: 'Capsule REST hook task/completed',
		...restHookSchema,
	},
	'users.created': {
		description: 'Capsule REST hook user/created',
		...restHookSchema,
	},
	'users.updated': {
		description: 'Capsule REST hook user/updated',
		...restHookSchema,
	},
	'users.deleted': {
		description: 'Capsule REST hook user/deleted',
		...restHookSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof capsuleCrmWebhooksNested
>;

export { resolveCapsuleCrmOAuthWebhookTenantLink } from './oauth-tenant-link';
export { matchCapsuleCrmTenantWebhook } from './tenant-matcher';
export { isCapsuleCrmWebhookRequest } from './types';
