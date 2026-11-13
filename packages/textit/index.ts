import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { textItEndpointsNested } from './endpoints';
import {
	TextItEndpointInputSchemas as Inputs,
	TextItEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { mergeErrorHandlers } from './error-handlers';
import { TextItSchema } from './schema';

export type TextItPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTextItPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof textItEndpointsNested>;
};
export type TextItContext = CorsairPluginContext<
	typeof TextItSchema,
	TextItPluginOptions
>;
export type TextItKeyBuilderContext = KeyBuilderContext<TextItPluginOptions>;
export type TextItBoundEndpoints = BindEndpoints<typeof textItEndpointsNested>;

export const textItEndpointSchemas = {
	'archives.list': { input: Inputs.archivesList, output: Outputs.archivesList },
	'broadcasts.list': {
		input: Inputs.broadcastsList,
		output: Outputs.broadcastsList,
	},
	'broadcasts.send': {
		input: Inputs.broadcastsSend,
		output: Outputs.broadcastsSend,
	},
	'campaigns.list': {
		input: Inputs.campaignsList,
		output: Outputs.campaignsList,
	},
	'campaigns.create': {
		input: Inputs.campaignsCreate,
		output: Outputs.campaignsCreate,
	},
	'campaigns.update': {
		input: Inputs.campaignsUpdate,
		output: Outputs.campaignsUpdate,
	},
	'campaignEvents.list': {
		input: Inputs.campaignEventsList,
		output: Outputs.campaignEventsList,
	},
	'campaignEvents.create': {
		input: Inputs.campaignEventsCreate,
		output: Outputs.campaignEventsCreate,
	},
	'campaignEvents.update': {
		input: Inputs.campaignEventsUpdate,
		output: Outputs.campaignEventsUpdate,
	},
	'campaignEvents.delete': {
		input: Inputs.campaignEventsDelete,
		output: Outputs.campaignEventsDelete,
	},
	'channels.list': { input: Inputs.channelsList, output: Outputs.channelsList },
	'contacts.list': { input: Inputs.contactsList, output: Outputs.contactsList },
	'contacts.create': {
		input: Inputs.contactsCreate,
		output: Outputs.contactsCreate,
	},
	'contacts.update': {
		input: Inputs.contactsUpdate,
		output: Outputs.contactsUpdate,
	},
	'contacts.delete': {
		input: Inputs.contactsDelete,
		output: Outputs.contactsDelete,
	},
	'contactActions.apply': {
		input: Inputs.contactActionsApply,
		output: Outputs.contactActionsApply,
	},
	'fields.list': { input: Inputs.fieldsList, output: Outputs.fieldsList },
	'fields.create': { input: Inputs.fieldsCreate, output: Outputs.fieldsCreate },
	'fields.update': { input: Inputs.fieldsUpdate, output: Outputs.fieldsUpdate },
	'flowStarts.list': {
		input: Inputs.flowStartsList,
		output: Outputs.flowStartsList,
	},
	'flowStarts.create': {
		input: Inputs.flowStartsCreate,
		output: Outputs.flowStartsCreate,
	},
	'flows.list': { input: Inputs.flowsList, output: Outputs.flowsList },
	'globals.list': { input: Inputs.globalsList, output: Outputs.globalsList },
	'globals.create': {
		input: Inputs.globalsCreate,
		output: Outputs.globalsCreate,
	},
	'globals.update': {
		input: Inputs.globalsUpdate,
		output: Outputs.globalsUpdate,
	},
	'groups.list': { input: Inputs.groupsList, output: Outputs.groupsList },
	'groups.create': { input: Inputs.groupsCreate, output: Outputs.groupsCreate },
	'groups.update': { input: Inputs.groupsUpdate, output: Outputs.groupsUpdate },
	'groups.delete': { input: Inputs.groupsDelete, output: Outputs.groupsDelete },
	'labels.list': { input: Inputs.labelsList, output: Outputs.labelsList },
	'labels.create': { input: Inputs.labelsCreate, output: Outputs.labelsCreate },
	'labels.update': { input: Inputs.labelsUpdate, output: Outputs.labelsUpdate },
	'labels.delete': { input: Inputs.labelsDelete, output: Outputs.labelsDelete },
	'media.upload': { input: Inputs.mediaUpload, output: Outputs.mediaUpload },
	'messages.list': { input: Inputs.messagesList, output: Outputs.messagesList },
	'messages.send': { input: Inputs.messagesSend, output: Outputs.messagesSend },
	'messageActions.apply': {
		input: Inputs.messageActionsApply,
		output: Outputs.messageActionsApply,
	},
	'runs.list': { input: Inputs.runsList, output: Outputs.runsList },
	'resthooks.list': {
		input: Inputs.resthooksList,
		output: Outputs.resthooksList,
	},
	'resthookEvents.list': {
		input: Inputs.resthookEventsList,
		output: Outputs.resthookEventsList,
	},
	'resthookSubscribers.list': {
		input: Inputs.resthookSubscribersList,
		output: Outputs.resthookSubscribersList,
	},
	'resthookSubscribers.create': {
		input: Inputs.resthookSubscribersCreate,
		output: Outputs.resthookSubscribersCreate,
	},
	'resthookSubscribers.delete': {
		input: Inputs.resthookSubscribersDelete,
		output: Outputs.resthookSubscribersDelete,
	},
	'tickets.list': { input: Inputs.ticketsList, output: Outputs.ticketsList },
	'ticketActions.apply': {
		input: Inputs.ticketActionsApply,
		output: Outputs.ticketActionsApply,
	},
	'topics.list': { input: Inputs.topicsList, output: Outputs.topicsList },
	'topics.create': { input: Inputs.topicsCreate, output: Outputs.topicsCreate },
	'users.list': { input: Inputs.usersList, output: Outputs.usersList },
	'workspace.get': { input: Inputs.workspaceGet, output: Outputs.workspaceGet },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof textItEndpointsNested
>;

const textItEndpointMeta = {
	'archives.list': {
		riskLevel: 'read',
		description: 'List archived message or flow-run data.',
	},
	'broadcasts.list': {
		riskLevel: 'read',
		description: 'List outgoing broadcasts.',
	},
	'broadcasts.send': {
		riskLevel: 'write',
		description: 'Send a translated broadcast to contacts, groups or URNs.',
	},
	'campaigns.list': { riskLevel: 'read', description: 'List campaigns.' },
	'campaigns.create': {
		riskLevel: 'write',
		description: 'Create a campaign for a contact group.',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description: 'Update a campaign by UUID.',
	},
	'campaignEvents.list': {
		riskLevel: 'read',
		description: 'List campaign events.',
	},
	'campaignEvents.create': {
		riskLevel: 'write',
		description: 'Create a scheduled campaign event.',
	},
	'campaignEvents.update': {
		riskLevel: 'write',
		description: 'Update a scheduled campaign event.',
	},
	'campaignEvents.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign event.',
	},
	'channels.list': {
		riskLevel: 'read',
		description: 'List messaging channels.',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts and their custom fields.',
	},
	'contacts.create': { riskLevel: 'write', description: 'Create a contact.' },
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact by UUID or URN; an unknown URN creates one.',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a contact by UUID or URN.',
	},
	'contactActions.apply': {
		riskLevel: 'destructive',
		description: 'Apply a bulk contact action, including permanent deletion.',
	},
	'fields.list': {
		riskLevel: 'read',
		description: 'List custom contact fields.',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Create a custom contact field.',
	},
	'fields.update': {
		riskLevel: 'write',
		description: 'Update a custom contact field by key.',
	},
	'flowStarts.list': {
		riskLevel: 'read',
		description: 'List manual flow starts.',
	},
	'flowStarts.create': {
		riskLevel: 'write',
		description: 'Start contacts, groups or URNs in a flow.',
	},
	'flows.list': { riskLevel: 'read', description: 'List flows.' },
	'globals.list': { riskLevel: 'read', description: 'List workspace globals.' },
	'globals.create': {
		riskLevel: 'write',
		description: 'Create a workspace global.',
	},
	'globals.update': {
		riskLevel: 'write',
		description: 'Update a workspace global by key.',
	},
	'groups.list': { riskLevel: 'read', description: 'List contact groups.' },
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a contact group.',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update a contact group.',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact group.',
	},
	'labels.list': { riskLevel: 'read', description: 'List message labels.' },
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a message label.',
	},
	'labels.update': {
		riskLevel: 'write',
		description: 'Update a message label.',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message label.',
	},
	'media.upload': {
		riskLevel: 'write',
		description: 'Upload a media file for message attachments.',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages with optional folder and label filters.',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a message to a contact.',
	},
	'messageActions.apply': {
		riskLevel: 'destructive',
		description:
			'Apply a bulk message action, including permanent deletion; inspect failures.',
	},
	'runs.list': { riskLevel: 'read', description: 'List flow runs.' },
	'resthooks.list': {
		riskLevel: 'read',
		description: 'List outbound resthooks.',
	},
	'resthookEvents.list': {
		riskLevel: 'read',
		description: 'List outbound resthook events.',
	},
	'resthookSubscribers.list': {
		riskLevel: 'read',
		description: 'List outbound resthook subscribers.',
	},
	'resthookSubscribers.create': {
		riskLevel: 'write',
		description: 'Subscribe a target URL to a resthook.',
	},
	'resthookSubscribers.delete': {
		riskLevel: 'destructive',
		description: 'Remove an outbound resthook subscription.',
	},
	'tickets.list': { riskLevel: 'read', description: 'List support tickets.' },
	'ticketActions.apply': {
		riskLevel: 'write',
		description: 'Apply a bulk ticket action.',
	},
	'topics.list': { riskLevel: 'read', description: 'List ticket topics.' },
	'topics.create': {
		riskLevel: 'write',
		description: 'Create a ticket topic.',
	},
	'users.list': { riskLevel: 'read', description: 'List workspace users.' },
	'workspace.get': {
		riskLevel: 'read',
		description: 'Read current workspace details.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof textItEndpointsNested>;

const defaultAuthType = 'api_key' as const;
export type BaseTextItPlugin<T extends TextItPluginOptions> = CorsairPlugin<
	'textit',
	typeof TextItSchema,
	typeof textItEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;
export type InternalTextItPlugin = BaseTextItPlugin<TextItPluginOptions>;
export type ExternalTextItPlugin<T extends TextItPluginOptions> =
	BaseTextItPlugin<T>;

export function textit<const T extends TextItPluginOptions>(
	incomingOptions: TextItPluginOptions & T = {} as TextItPluginOptions & T,
): ExternalTextItPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'textit',
		schema: TextItSchema,
		options,
		hooks: options.hooks,
		endpoints: textItEndpointsNested,
		webhooks: {},
		pluginWebhookMatcher: () => false,
		endpointSchemas: textItEndpointSchemas,
		endpointMeta: textItEndpointMeta,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: TextItKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			throw new AuthMissingError('textit', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTextItPlugin;
}

export { TextItAPIError } from './client';
export type {
	TextItEndpointInputs,
	TextItEndpointOutputs,
} from './endpoints/types';
