import { logEventFromContext } from 'corsair/core';
import type { TextItContext } from '..';
import type { TextItRequest } from '../client';
import { makeTextItRequest } from '../client';
import type { TextItEndpointInputs, TextItEndpointOutputs } from './types';
import {
	TextItEndpointInputSchemas as Inputs,
	TextItEndpointOutputSchemas as Outputs,
} from './types';

type Operation = keyof typeof Inputs & keyof typeof Outputs;
type Builder<K extends Operation> = (
	input: TextItEndpointInputs[K],
) => TextItRequest;

function endpoint<K extends Operation>(
	key: K,
	event: string,
	build: Builder<K>,
) {
	return async (
		ctx: TextItContext,
		raw: TextItEndpointInputs[K],
	): Promise<TextItEndpointOutputs[K]> => {
		const input = Inputs[key].parse(raw ?? {}) as TextItEndpointInputs[K];
		const response = await makeTextItRequest(ctx.key, build(input));
		const result = Outputs[key].parse(response) as TextItEndpointOutputs[K];
		await logEventFromContext(ctx, `textit.${event}`, {}, 'completed');
		return result;
	};
}

type Query = Record<string, string | number | boolean | undefined>;
const list = (path: string, query: Query): TextItRequest => ({
	method: 'GET',
	path: `/${path}.json`,
	query,
});
const post = (path: string, body: unknown, query?: Query): TextItRequest => ({
	method: 'POST',
	path: `/${path}.json`,
	body,
	query,
});
const remove = (path: string, query: Query): TextItRequest => ({
	method: 'DELETE',
	path: `/${path}.json`,
	query,
});

export const textItEndpointsNested = {
	archives: {
		list: endpoint('archivesList', 'archives.list', (i) => list('archives', i)),
	},
	broadcasts: {
		list: endpoint('broadcastsList', 'broadcasts.list', (i) =>
			list('broadcasts', i),
		),
		send: endpoint('broadcastsSend', 'broadcasts.send', (i) =>
			post('broadcasts', i),
		),
	},
	campaigns: {
		list: endpoint('campaignsList', 'campaigns.list', (i) =>
			list('campaigns', i),
		),
		create: endpoint('campaignsCreate', 'campaigns.create', (i) =>
			post('campaigns', i),
		),
		update: endpoint(
			'campaignsUpdate',
			'campaigns.update',
			({ uuid, ...body }) => post('campaigns', body, { uuid }),
		),
	},
	campaignEvents: {
		list: endpoint('campaignEventsList', 'campaignEvents.list', (i) =>
			list('campaign_events', i),
		),
		create: endpoint('campaignEventsCreate', 'campaignEvents.create', (i) =>
			post('campaign_events', i),
		),
		update: endpoint(
			'campaignEventsUpdate',
			'campaignEvents.update',
			({ uuid, body }) => post('campaign_events', body, { uuid }),
		),
		delete: endpoint('campaignEventsDelete', 'campaignEvents.delete', (i) =>
			remove('campaign_events', i),
		),
	},
	channels: {
		list: endpoint('channelsList', 'channels.list', (i) => list('channels', i)),
	},
	contacts: {
		list: endpoint('contactsList', 'contacts.list', (i) => list('contacts', i)),
		create: endpoint('contactsCreate', 'contacts.create', (i) =>
			post('contacts', i),
		),
		update: endpoint('contactsUpdate', 'contacts.update', ({ query, body }) =>
			post('contacts', body, query),
		),
		delete: endpoint('contactsDelete', 'contacts.delete', (i) =>
			remove('contacts', i),
		),
	},
	contactActions: {
		apply: endpoint('contactActionsApply', 'contactActions.apply', (i) =>
			post('contact_actions', i),
		),
	},
	fields: {
		list: endpoint('fieldsList', 'fields.list', (i) => list('fields', i)),
		create: endpoint('fieldsCreate', 'fields.create', (i) => post('fields', i)),
		update: endpoint('fieldsUpdate', 'fields.update', ({ key, ...body }) =>
			post('fields', body, { key }),
		),
	},
	flowStarts: {
		list: endpoint('flowStartsList', 'flowStarts.list', (i) =>
			list('flow_starts', i),
		),
		create: endpoint('flowStartsCreate', 'flowStarts.create', (i) =>
			post('flow_starts', i),
		),
	},
	flows: { list: endpoint('flowsList', 'flows.list', (i) => list('flows', i)) },
	globals: {
		list: endpoint('globalsList', 'globals.list', (i) => list('globals', i)),
		create: endpoint('globalsCreate', 'globals.create', (i) =>
			post('globals', i),
		),
		update: endpoint('globalsUpdate', 'globals.update', ({ key, ...body }) =>
			post('globals', body, { key }),
		),
	},
	groups: {
		list: endpoint('groupsList', 'groups.list', (i) => list('groups', i)),
		create: endpoint('groupsCreate', 'groups.create', (i) => post('groups', i)),
		update: endpoint('groupsUpdate', 'groups.update', ({ uuid, ...body }) =>
			post('groups', body, { uuid }),
		),
		delete: endpoint('groupsDelete', 'groups.delete', (i) =>
			remove('groups', i),
		),
	},
	labels: {
		list: endpoint('labelsList', 'labels.list', (i) => list('labels', i)),
		create: endpoint('labelsCreate', 'labels.create', (i) => post('labels', i)),
		update: endpoint('labelsUpdate', 'labels.update', ({ uuid, ...body }) =>
			post('labels', body, { uuid }),
		),
		delete: endpoint('labelsDelete', 'labels.delete', (i) =>
			remove('labels', i),
		),
	},
	media: {
		upload: endpoint('mediaUpload', 'media.upload', ({ file }) => ({
			method: 'POST',
			path: '/media.json',
			formData: { file },
		})),
	},
	messages: {
		list: endpoint('messagesList', 'messages.list', (i) => list('messages', i)),
		send: endpoint('messagesSend', 'messages.send', (i) => post('messages', i)),
	},
	messageActions: {
		apply: endpoint('messageActionsApply', 'messageActions.apply', (i) =>
			post('message_actions', i),
		),
	},
	runs: { list: endpoint('runsList', 'runs.list', (i) => list('runs', i)) },
	resthooks: {
		list: endpoint('resthooksList', 'resthooks.list', (i) =>
			list('resthooks', i),
		),
	},
	resthookEvents: {
		list: endpoint('resthookEventsList', 'resthookEvents.list', (i) =>
			list('resthook_events', i),
		),
	},
	resthookSubscribers: {
		list: endpoint('resthookSubscribersList', 'resthookSubscribers.list', (i) =>
			list('resthook_subscribers', i),
		),
		create: endpoint(
			'resthookSubscribersCreate',
			'resthookSubscribers.create',
			(i) => post('resthook_subscribers', i),
		),
		delete: endpoint(
			'resthookSubscribersDelete',
			'resthookSubscribers.delete',
			(i) => remove('resthook_subscribers', i),
		),
	},
	tickets: {
		list: endpoint('ticketsList', 'tickets.list', (i) => list('tickets', i)),
	},
	ticketActions: {
		apply: endpoint('ticketActionsApply', 'ticketActions.apply', (i) =>
			post('ticket_actions', i),
		),
	},
	topics: {
		list: endpoint('topicsList', 'topics.list', (i) => list('topics', i)),
		create: endpoint('topicsCreate', 'topics.create', (i) => post('topics', i)),
	},
	users: { list: endpoint('usersList', 'users.list', (i) => list('users', i)) },
	workspace: {
		get: endpoint('workspaceGet', 'workspace.get', () => list('workspace', {})),
	},
} as const;

export * from './types';
