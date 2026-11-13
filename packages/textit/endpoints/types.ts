import { z } from 'zod';
import * as R from './resources';

const text = z.string().min(1);
const list100 = z.array(text).max(100);
const dates = { before: z.string().optional(), after: z.string().optional() };
const cursor = { cursor: z.string().optional() };
const uuid = { uuid: text };
const keyed = { key: text };
const quickReply = z.object({
	type: z.enum(['text', 'form', 'url', 'location']).optional(),
	text: z.string().max(64),
	extra: z.string().max(1000).optional(),
});
const names = z.object({ name: text });
// The update example shows groups as objects; the create documentation uses UUIDs.
const contactBody = z.object({
	name: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	urns: list100.optional(),
	groups: z
		.array(
			z.union([text, z.object({ uuid: text, name: z.string().optional() })]),
		)
		.max(100)
		.optional(),
	fields: z.record(z.string(), z.string().nullable()).optional(),
});
const contactSelector = z.union([
	z.strictObject({ uuid: text }),
	z.strictObject({ urn: text }),
]);
const eventFields = {
	relative_to: text,
	offset: z.number().int(),
	unit: z.enum(['minutes', 'hours', 'days', 'weeks']),
	delivery_hour: z.number().int().min(-1).max(24),
	message: z.string().optional(),
	flow: text.optional(),
};
const hasExactlyOneEventTarget = (v: { message?: string; flow?: string }) =>
	Boolean(v.message) !== Boolean(v.flow);
const eventBody = z
	.object({ campaign: text.optional(), ...eventFields })
	.refine(hasExactlyOneEventTarget, 'Specify either message or flow');

// Public schemas use the provider's wire names. No identifiers occur in a path
// segment: TextIt selects individual records with query parameters instead.
export const TextItEndpointInputSchemas = {
	archivesList: z.object({
		...cursor,
		...dates,
		type: z.enum(['message', 'run']).optional(),
		period: z.enum(['daily', 'monthly']).optional(),
	}),
	broadcastsList: z.object({ ...cursor, ...dates, uuid: text.optional() }),
	broadcastsSend: z.object({
		urns: list100.optional(),
		contacts: list100.optional(),
		groups: list100.optional(),
		text: z.record(z.string(), z.string()),
		attachments: z.record(z.string(), z.array(z.string())).optional(),
		quick_replies: z.record(z.string(), z.array(quickReply)).optional(),
		base_language: z.string().optional(),
	}),
	campaignsList: z.object({ ...cursor, ...dates, uuid: text.optional() }),
	campaignsCreate: z.object({ name: text, group: text }),
	campaignsUpdate: z.object({
		...uuid,
		name: text.optional(),
		group: text.optional(),
	}),
	campaignEventsList: z.object({
		...cursor,
		uuid: text.optional(),
		campaign: text.optional(),
	}),
	campaignEventsCreate: z
		.object({ campaign: text, ...eventFields })
		.refine(hasExactlyOneEventTarget, 'Specify either message or flow'),
	campaignEventsUpdate: z.object({ ...uuid, body: eventBody }),
	campaignEventsDelete: z.object(uuid),
	channelsList: z.object({
		...cursor,
		uuid: text.optional(),
		address: text.optional(),
	}),
	contactsList: z.object({
		...cursor,
		...dates,
		uuid: text.optional(),
		urn: text.optional(),
		group: text.optional(),
	}),
	contactsCreate: contactBody,
	contactsUpdate: z
		.object({ query: contactSelector, body: contactBody })
		.refine(
			(v) => !('urn' in v.query) || v.body.urns === undefined,
			'Do not specify urns when updating by URN',
		),
	contactsDelete: contactSelector,
	contactActionsApply: z
		.object({
			contacts: list100.min(1),
			action: z.enum([
				'add',
				'remove',
				'block',
				'unblock',
				'interrupt',
				'delete',
			]),
			group: text.optional(),
		})
		.refine(
			(v) => !['add', 'remove'].includes(v.action) || !!v.group,
			'group is required for add and remove',
		),
	fieldsList: z.object({ ...cursor, key: text.optional() }),
	fieldsCreate: z.object({
		name: text,
		type: z.enum(['text', 'number', 'datetime', 'state', 'district', 'ward']),
	}),
	fieldsUpdate: z.object({
		...keyed,
		name: text.optional(),
		type: z
			.enum(['text', 'number', 'datetime', 'state', 'district', 'ward'])
			.optional(),
	}),
	flowStartsList: z.object({ ...cursor, uuid: text.optional() }),
	flowStartsCreate: z.object({
		flow: text,
		groups: list100.optional(),
		contacts: list100.optional(),
		urns: list100.optional(),
		restart_participants: z.boolean().optional(),
		exclude_active: z.boolean().optional(),
		// Flow parameter values are user-defined JSON, so no fixed value schema applies.
		params: z.record(z.string(), z.unknown()).optional(),
	}),
	flowsList: z.object({
		...cursor,
		...dates,
		uuid: text.optional(),
		type: z.enum(['message', 'voice', 'survey']).optional(),
		archived: z.boolean().optional(),
	}),
	globalsList: z.object({ ...cursor, ...dates, key: text.optional() }),
	globalsCreate: z.object({ name: text, value: z.string() }),
	globalsUpdate: z.object({
		...keyed,
		name: text.optional(),
		value: z.string().optional(),
	}),
	groupsList: z.object({
		...cursor,
		uuid: text.optional(),
		name: text.optional(),
		manual_only: z.union([z.literal(1), z.literal(0)]).optional(),
	}),
	groupsCreate: names,
	groupsUpdate: z.object({ ...uuid, name: text }),
	groupsDelete: z.object(uuid),
	labelsList: z.object({
		...cursor,
		uuid: text.optional(),
		name: text.optional(),
	}),
	labelsCreate: names,
	labelsUpdate: z.object({ ...uuid, name: text }),
	labelsDelete: z.object(uuid),
	mediaUpload: z.object({ file: z.instanceof(Blob) }),
	messagesList: z.object({
		...cursor,
		...dates,
		uuid: text.optional(),
		label: text.optional(),
		folder: z
			.enum(['inbox', 'flows', 'archived', 'outbox', 'sent', 'failed'])
			.optional(),
	}),
	messagesSend: z.object({
		contact: text,
		text: z.string(),
		attachments: z.array(text).max(10).optional(),
		quick_replies: z.array(quickReply).max(10).optional(),
	}),
	messageActionsApply: z
		.object({
			messages: z.array(z.number().int()).min(1).max(100),
			action: z.enum(['label', 'unlabel', 'archive', 'restore', 'delete']),
			label: text.optional(),
		})
		.refine(
			(v) => !['label', 'unlabel'].includes(v.action) || !!v.label,
			'label is required for label and unlabel',
		),
	runsList: z.object({
		...cursor,
		...dates,
		uuid: text.optional(),
		flow: text.optional(),
		responded: z.boolean().optional(),
	}),
	resthooksList: z.object(cursor),
	resthookEventsList: z.object({ ...cursor, resthook: text.optional() }),
	resthookSubscribersList: z.object({
		...cursor,
		id: z.union([text, z.number().int()]).optional(),
		resthook: text.optional(),
	}),
	resthookSubscribersCreate: z.object({ resthook: text, target_url: z.url() }),
	resthookSubscribersDelete: z.object({
		id: z.union([text, z.number().int()]),
	}),
	ticketsList: z.object({ ...cursor, uuid: text.optional() }),
	ticketActionsApply: z.object({
		tickets: list100.min(1),
		action: z.enum(['assign', 'note', 'close', 'reopen']),
		assignee: z.string().optional(),
		note: z.string().optional(),
	}),
	topicsList: z.object(cursor),
	topicsCreate: names,
	usersList: z.object({ ...cursor, uuid: text.optional() }),
	workspaceGet: z.object({}),
} as const;

export const TextItEndpointOutputSchemas = {
	archivesList: R.page(R.Archive),
	broadcastsList: R.page(R.Broadcast),
	broadcastsSend: R.Broadcast,
	campaignsList: R.page(R.Campaign),
	campaignsCreate: R.Campaign,
	campaignsUpdate: R.Campaign,
	campaignEventsList: R.page(R.CampaignEvent),
	campaignEventsCreate: R.CampaignEvent,
	campaignEventsUpdate: R.CampaignEvent,
	campaignEventsDelete: z.void(),
	channelsList: R.page(R.Channel),
	contactsList: R.page(R.Contact),
	contactsCreate: R.Contact,
	contactsUpdate: R.Contact,
	contactsDelete: z.void(),
	contactActionsApply: z.void(),
	fieldsList: R.page(R.Field),
	fieldsCreate: R.Field,
	fieldsUpdate: R.Field,
	flowStartsList: R.page(R.FlowStart),
	flowStartsCreate: R.FlowStart,
	flowsList: R.page(R.Flow),
	globalsList: R.page(R.Global),
	globalsCreate: R.Global,
	globalsUpdate: R.Global,
	groupsList: R.page(R.Group),
	groupsCreate: R.Group,
	groupsUpdate: R.Group,
	groupsDelete: z.void(),
	labelsList: R.page(R.Label),
	labelsCreate: R.Label,
	labelsUpdate: R.Label,
	labelsDelete: z.void(),
	mediaUpload: R.Media,
	messagesList: R.page(R.Message),
	messagesSend: R.Message,
	messageActionsApply: z.union([
		z.void(),
		z.object({ failures: z.array(z.number().int()) }).loose(),
	]),
	runsList: R.page(R.Run),
	resthooksList: R.page(R.Resthook),
	resthookEventsList: R.page(R.ResthookEvent),
	resthookSubscribersList: R.page(R.ResthookSubscriber),
	resthookSubscribersCreate: R.ResthookSubscriber,
	resthookSubscribersDelete: z.void(),
	ticketsList: R.page(R.Ticket),
	ticketActionsApply: z.void(),
	topicsList: R.page(R.Topic),
	topicsCreate: R.Topic,
	usersList: R.page(R.User),
	workspaceGet: R.Workspace,
} as const;

export type TextItEndpointInputs = {
	[K in keyof typeof TextItEndpointInputSchemas]: z.input<
		(typeof TextItEndpointInputSchemas)[K]
	>;
};
export type TextItEndpointOutputs = {
	[K in keyof typeof TextItEndpointOutputSchemas]: z.output<
		(typeof TextItEndpointOutputSchemas)[K]
	>;
};
