import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Livefeed,
	Messages,
	SequenceFolders,
	Sequences,
	Snippets,
	SnippetTags,
	Unsubscribes,
	Users,
} from './endpoints';
import type {
	MixmaxEndpointInputs,
	MixmaxEndpointOutputs,
} from './endpoints/types';
import {
	MixmaxEndpointInputSchemas,
	MixmaxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MixmaxSchema } from './schema';

export type MixmaxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMixmaxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mixmaxEndpointsNested>;
};

export type MixmaxContext = CorsairPluginContext<
	typeof MixmaxSchema,
	MixmaxPluginOptions
>;

export type MixmaxKeyBuilderContext = KeyBuilderContext<MixmaxPluginOptions>;

export type MixmaxBoundEndpoints = BindEndpoints<typeof mixmaxEndpointsNested>;

type MixmaxEndpoint<K extends keyof MixmaxEndpointOutputs> = CorsairEndpoint<
	MixmaxContext,
	MixmaxEndpointInputs[K],
	MixmaxEndpointOutputs[K]
>;

export type MixmaxEndpoints = {
	usersGetMe: MixmaxEndpoint<'usersGetMe'>;
	userPreferencesGet: MixmaxEndpoint<'userPreferencesGet'>;
	userPreferencesUpdate: MixmaxEndpoint<'userPreferencesUpdate'>;
	userPreferencesAutoBccList: MixmaxEndpoint<'userPreferencesAutoBccList'>;
	userPreferencesAutoBccAdd: MixmaxEndpoint<'userPreferencesAutoBccAdd'>;
	userPreferencesAutoBccExists: MixmaxEndpoint<'userPreferencesAutoBccExists'>;
	messagesList: MixmaxEndpoint<'messagesList'>;
	messagesCreate: MixmaxEndpoint<'messagesCreate'>;
	messagesGet: MixmaxEndpoint<'messagesGet'>;
	messagesUpdate: MixmaxEndpoint<'messagesUpdate'>;
	messagesSend: MixmaxEndpoint<'messagesSend'>;
	messagesSchedule: MixmaxEndpoint<'messagesSchedule'>;
	messagesUnschedule: MixmaxEndpoint<'messagesUnschedule'>;
	messagesTest: MixmaxEndpoint<'messagesTest'>;
	messagesSendPlain: MixmaxEndpoint<'messagesSendPlain'>;
	snippetsList: MixmaxEndpoint<'snippetsList'>;
	snippetsGet: MixmaxEndpoint<'snippetsGet'>;
	snippetsUpdate: MixmaxEndpoint<'snippetsUpdate'>;
	snippetsDelete: MixmaxEndpoint<'snippetsDelete'>;
	snippetsSend: MixmaxEndpoint<'snippetsSend'>;
	snippetTagsList: MixmaxEndpoint<'snippetTagsList'>;
	snippetTagsCreate: MixmaxEndpoint<'snippetTagsCreate'>;
	snippetTagsGet: MixmaxEndpoint<'snippetTagsGet'>;
	snippetTagsUpdate: MixmaxEndpoint<'snippetTagsUpdate'>;
	snippetTagsDelete: MixmaxEndpoint<'snippetTagsDelete'>;
	snippetTagsListSnippets: MixmaxEndpoint<'snippetTagsListSnippets'>;
	snippetTagsAddSnippets: MixmaxEndpoint<'snippetTagsAddSnippets'>;
	unsubscribesList: MixmaxEndpoint<'unsubscribesList'>;
	unsubscribesCreate: MixmaxEndpoint<'unsubscribesCreate'>;
	unsubscribesRemove: MixmaxEndpoint<'unsubscribesRemove'>;
	livefeedList: MixmaxEndpoint<'livefeedList'>;
	livefeedEvents: MixmaxEndpoint<'livefeedEvents'>;
	sequencesList: MixmaxEndpoint<'sequencesList'>;
	sequencesSearch: MixmaxEndpoint<'sequencesSearch'>;
	sequencesCancelAll: MixmaxEndpoint<'sequencesCancelAll'>;
	sequencesCancel: MixmaxEndpoint<'sequencesCancel'>;
	sequencesRecipientsList: MixmaxEndpoint<'sequencesRecipientsList'>;
	sequencesRecipientsAdd: MixmaxEndpoint<'sequencesRecipientsAdd'>;
	sequenceFoldersList: MixmaxEndpoint<'sequenceFoldersList'>;
	sequenceFoldersCreate: MixmaxEndpoint<'sequenceFoldersCreate'>;
	sequenceFoldersGet: MixmaxEndpoint<'sequenceFoldersGet'>;
	sequenceFoldersRename: MixmaxEndpoint<'sequenceFoldersRename'>;
	sequenceFoldersDelete: MixmaxEndpoint<'sequenceFoldersDelete'>;
	sequenceFoldersAddSequences: MixmaxEndpoint<'sequenceFoldersAddSequences'>;
};

const mixmaxEndpointsNested = {
	users: {
		getMe: Users.getMe,
		preferences: {
			get: Users.preferences.get,
			update: Users.preferences.update,
			autoBccExcludedEmails: {
				list: Users.preferences.autoBccExcludedEmails.list,
				add: Users.preferences.autoBccExcludedEmails.add,
				exists: Users.preferences.autoBccExcludedEmails.exists,
			},
		},
	},
	messages: {
		list: Messages.list,
		create: Messages.create,
		get: Messages.get,
		update: Messages.update,
		send: Messages.send,
		schedule: Messages.schedule,
		unschedule: Messages.unschedule,
		test: Messages.test,
		sendPlain: Messages.sendPlain,
	},
	snippets: {
		list: Snippets.list,
		get: Snippets.get,
		update: Snippets.update,
		delete: Snippets.delete,
		send: Snippets.send,
	},
	snippetTags: {
		list: SnippetTags.list,
		create: SnippetTags.create,
		get: SnippetTags.get,
		update: SnippetTags.update,
		delete: SnippetTags.delete,
		listSnippets: SnippetTags.listSnippets,
		addSnippets: SnippetTags.addSnippets,
	},
	unsubscribes: {
		list: Unsubscribes.list,
		create: Unsubscribes.create,
		remove: Unsubscribes.remove,
	},
	livefeed: {
		list: Livefeed.list,
		events: Livefeed.events,
	},
	sequences: {
		list: Sequences.list,
		search: Sequences.search,
		cancelAll: Sequences.cancelAll,
		cancel: Sequences.cancel,
		recipients: {
			list: Sequences.recipients.list,
			add: Sequences.recipients.add,
		},
	},
	sequenceFolders: {
		list: SequenceFolders.list,
		create: SequenceFolders.create,
		get: SequenceFolders.get,
		rename: SequenceFolders.rename,
		delete: SequenceFolders.delete,
		addSequences: SequenceFolders.addSequences,
	},
} as const;

export const mixmaxEndpointSchemas = {
	'users.getMe': {
		input: MixmaxEndpointInputSchemas.usersGetMe,
		output: MixmaxEndpointOutputSchemas.usersGetMe,
	},
	'users.preferences.get': {
		input: MixmaxEndpointInputSchemas.userPreferencesGet,
		output: MixmaxEndpointOutputSchemas.userPreferencesGet,
	},
	'users.preferences.update': {
		input: MixmaxEndpointInputSchemas.userPreferencesUpdate,
		output: MixmaxEndpointOutputSchemas.userPreferencesUpdate,
	},
	'users.preferences.autoBccExcludedEmails.list': {
		input: MixmaxEndpointInputSchemas.userPreferencesAutoBccList,
		output: MixmaxEndpointOutputSchemas.userPreferencesAutoBccList,
	},
	'users.preferences.autoBccExcludedEmails.add': {
		input: MixmaxEndpointInputSchemas.userPreferencesAutoBccAdd,
		output: MixmaxEndpointOutputSchemas.userPreferencesAutoBccAdd,
	},
	'users.preferences.autoBccExcludedEmails.exists': {
		input: MixmaxEndpointInputSchemas.userPreferencesAutoBccExists,
		output: MixmaxEndpointOutputSchemas.userPreferencesAutoBccExists,
	},
	'messages.list': {
		input: MixmaxEndpointInputSchemas.messagesList,
		output: MixmaxEndpointOutputSchemas.messagesList,
	},
	'messages.create': {
		input: MixmaxEndpointInputSchemas.messagesCreate,
		output: MixmaxEndpointOutputSchemas.messagesCreate,
	},
	'messages.get': {
		input: MixmaxEndpointInputSchemas.messagesGet,
		output: MixmaxEndpointOutputSchemas.messagesGet,
	},
	'messages.update': {
		input: MixmaxEndpointInputSchemas.messagesUpdate,
		output: MixmaxEndpointOutputSchemas.messagesUpdate,
	},
	'messages.send': {
		input: MixmaxEndpointInputSchemas.messagesSend,
		output: MixmaxEndpointOutputSchemas.messagesSend,
	},
	'messages.schedule': {
		input: MixmaxEndpointInputSchemas.messagesSchedule,
		output: MixmaxEndpointOutputSchemas.messagesSchedule,
	},
	'messages.unschedule': {
		input: MixmaxEndpointInputSchemas.messagesUnschedule,
		output: MixmaxEndpointOutputSchemas.messagesUnschedule,
	},
	'messages.test': {
		input: MixmaxEndpointInputSchemas.messagesTest,
		output: MixmaxEndpointOutputSchemas.messagesTest,
	},
	'messages.sendPlain': {
		input: MixmaxEndpointInputSchemas.messagesSendPlain,
		output: MixmaxEndpointOutputSchemas.messagesSendPlain,
	},
	'snippets.list': {
		input: MixmaxEndpointInputSchemas.snippetsList,
		output: MixmaxEndpointOutputSchemas.snippetsList,
	},
	'snippets.get': {
		input: MixmaxEndpointInputSchemas.snippetsGet,
		output: MixmaxEndpointOutputSchemas.snippetsGet,
	},
	'snippets.update': {
		input: MixmaxEndpointInputSchemas.snippetsUpdate,
		output: MixmaxEndpointOutputSchemas.snippetsUpdate,
	},
	'snippets.delete': {
		input: MixmaxEndpointInputSchemas.snippetsDelete,
		output: MixmaxEndpointOutputSchemas.snippetsDelete,
	},
	'snippets.send': {
		input: MixmaxEndpointInputSchemas.snippetsSend,
		output: MixmaxEndpointOutputSchemas.snippetsSend,
	},
	'snippetTags.list': {
		input: MixmaxEndpointInputSchemas.snippetTagsList,
		output: MixmaxEndpointOutputSchemas.snippetTagsList,
	},
	'snippetTags.create': {
		input: MixmaxEndpointInputSchemas.snippetTagsCreate,
		output: MixmaxEndpointOutputSchemas.snippetTagsCreate,
	},
	'snippetTags.get': {
		input: MixmaxEndpointInputSchemas.snippetTagsGet,
		output: MixmaxEndpointOutputSchemas.snippetTagsGet,
	},
	'snippetTags.update': {
		input: MixmaxEndpointInputSchemas.snippetTagsUpdate,
		output: MixmaxEndpointOutputSchemas.snippetTagsUpdate,
	},
	'snippetTags.delete': {
		input: MixmaxEndpointInputSchemas.snippetTagsDelete,
		output: MixmaxEndpointOutputSchemas.snippetTagsDelete,
	},
	'snippetTags.listSnippets': {
		input: MixmaxEndpointInputSchemas.snippetTagsListSnippets,
		output: MixmaxEndpointOutputSchemas.snippetTagsListSnippets,
	},
	'snippetTags.addSnippets': {
		input: MixmaxEndpointInputSchemas.snippetTagsAddSnippets,
		output: MixmaxEndpointOutputSchemas.snippetTagsAddSnippets,
	},
	'unsubscribes.list': {
		input: MixmaxEndpointInputSchemas.unsubscribesList,
		output: MixmaxEndpointOutputSchemas.unsubscribesList,
	},
	'unsubscribes.create': {
		input: MixmaxEndpointInputSchemas.unsubscribesCreate,
		output: MixmaxEndpointOutputSchemas.unsubscribesCreate,
	},
	'unsubscribes.remove': {
		input: MixmaxEndpointInputSchemas.unsubscribesRemove,
		output: MixmaxEndpointOutputSchemas.unsubscribesRemove,
	},
	'livefeed.list': {
		input: MixmaxEndpointInputSchemas.livefeedList,
		output: MixmaxEndpointOutputSchemas.livefeedList,
	},
	'livefeed.events': {
		input: MixmaxEndpointInputSchemas.livefeedEvents,
		output: MixmaxEndpointOutputSchemas.livefeedEvents,
	},
	'sequences.list': {
		input: MixmaxEndpointInputSchemas.sequencesList,
		output: MixmaxEndpointOutputSchemas.sequencesList,
	},
	'sequences.search': {
		input: MixmaxEndpointInputSchemas.sequencesSearch,
		output: MixmaxEndpointOutputSchemas.sequencesSearch,
	},
	'sequences.cancelAll': {
		input: MixmaxEndpointInputSchemas.sequencesCancelAll,
		output: MixmaxEndpointOutputSchemas.sequencesCancelAll,
	},
	'sequences.cancel': {
		input: MixmaxEndpointInputSchemas.sequencesCancel,
		output: MixmaxEndpointOutputSchemas.sequencesCancel,
	},
	'sequences.recipients.list': {
		input: MixmaxEndpointInputSchemas.sequencesRecipientsList,
		output: MixmaxEndpointOutputSchemas.sequencesRecipientsList,
	},
	'sequences.recipients.add': {
		input: MixmaxEndpointInputSchemas.sequencesRecipientsAdd,
		output: MixmaxEndpointOutputSchemas.sequencesRecipientsAdd,
	},
	'sequenceFolders.list': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersList,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersList,
	},
	'sequenceFolders.create': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersCreate,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersCreate,
	},
	'sequenceFolders.get': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersGet,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersGet,
	},
	'sequenceFolders.rename': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersRename,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersRename,
	},
	'sequenceFolders.delete': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersDelete,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersDelete,
	},
	'sequenceFolders.addSequences': {
		input: MixmaxEndpointInputSchemas.sequenceFoldersAddSequences,
		output: MixmaxEndpointOutputSchemas.sequenceFoldersAddSequences,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mixmaxEndpointsNested
>;

export const mixmaxEndpointMeta = {
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get the current Mixmax user.',
	},
	'users.preferences.get': {
		riskLevel: 'read',
		description: 'Get the calling user’s Mixmax preferences.',
	},
	'users.preferences.update': {
		riskLevel: 'write',
		description: 'Update the calling user’s Mixmax preferences.',
	},
	'users.preferences.autoBccExcludedEmails.list': {
		riskLevel: 'read',
		description:
			'Check whether one email address is excluded from the user’s Mixmax auto BCC list.',
	},
	'users.preferences.autoBccExcludedEmails.add': {
		riskLevel: 'write',
		description:
			'Add email addresses to the user’s Mixmax auto BCC exclusion list.',
	},
	'users.preferences.autoBccExcludedEmails.exists': {
		riskLevel: 'read',
		description:
			'Check exactly which email addresses are excluded from the user’s Mixmax auto BCC list, including role exclusions.',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'List Mixmax messages (drafts, scheduled, sent, or failed), newest first.',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax draft message without sending it.',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax message by id.',
	},
	'messages.update': {
		riskLevel: 'write',
		description:
			'Update the fields of a sent Mixmax message; each included field replaces the stored value.',
	},
	'messages.send': {
		riskLevel: 'destructive',
		description:
			'Send a saved Mixmax draft. Delivery is asynchronous and cannot be undone.',
	},
	'messages.schedule': {
		riskLevel: 'write',
		description:
			'Schedule a saved Mixmax draft to send at a Unix-millisecond timestamp.',
	},
	'messages.unschedule': {
		riskLevel: 'write',
		description:
			'Cancel a scheduled Mixmax send and return the message to draft.',
	},
	'messages.test': {
		riskLevel: 'write',
		description: 'Send a Mixmax test email to the calling user’s own account.',
	},
	'messages.sendPlain': {
		riskLevel: 'destructive',
		description:
			'Send a plain email from the user’s mailbox immediately, outside Mixmax tracking.',
	},
	'snippets.list': {
		riskLevel: 'read',
		description:
			'List the Mixmax templates (snippets) the user can access, including shared ones.',
	},
	'snippets.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax template by id.',
	},
	'snippets.update': {
		riskLevel: 'write',
		description:
			'Update the fields of a Mixmax template; only the fields sent change.',
	},
	'snippets.delete': {
		riskLevel: 'destructive',
		description:
			'Move a Mixmax template to the trash, or archive it, removing it from its folders.',
	},
	'snippets.send': {
		riskLevel: 'destructive',
		description:
			'Send an email built from a Mixmax template, immediately or at a scheduled time.',
	},
	'snippetTags.list': {
		riskLevel: 'read',
		description:
			'List the Mixmax template folders (snippet tags) the user can access.',
	},
	'snippetTags.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax template folder.',
	},
	'snippetTags.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax template folder by id.',
	},
	'snippetTags.update': {
		riskLevel: 'write',
		description: 'Rename a Mixmax template folder.',
	},
	'snippetTags.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a Mixmax template folder and move every template inside it to the trash.',
	},
	'snippetTags.listSnippets': {
		riskLevel: 'read',
		description: 'List the templates contained in one Mixmax template folder.',
	},
	'snippetTags.addSnippets': {
		riskLevel: 'write',
		description: 'Add a template to a Mixmax template folder.',
	},
	'unsubscribes.list': {
		riskLevel: 'read',
		description:
			'List the email addresses unsubscribed from the user’s Mixmax sends.',
	},
	'unsubscribes.create': {
		riskLevel: 'write',
		description:
			'Add one or more email addresses to the Mixmax unsubscribe list.',
	},
	'unsubscribes.remove': {
		riskLevel: 'destructive',
		description: 'Remove one email address from the Mixmax unsubscribe list.',
	},
	'livefeed.list': {
		riskLevel: 'read',
		description:
			'List the user’s Mixmax live feed of tracked email activity, with optional stats.',
	},
	'livefeed.events': {
		riskLevel: 'read',
		description:
			'List individual Mixmax live feed events such as opens, clicks, and replies.',
	},
	'sequences.list': {
		riskLevel: 'read',
		description:
			'List the Mixmax sequences the user can access, including shared ones.',
	},
	'sequences.search': {
		riskLevel: 'read',
		description:
			'Search sequence recipients across every accessible Mixmax sequence with their status and activity.',
	},
	'sequences.cancelAll': {
		riskLevel: 'destructive',
		description:
			'Stop the user’s recipients across every Mixmax sequence at once; cancelled recipients cannot be resumed.',
	},
	'sequences.cancel': {
		riskLevel: 'destructive',
		description:
			'Stop recipients of one Mixmax sequence; cancellation is one-way and deletes their open tasks.',
	},
	'sequences.recipients.list': {
		riskLevel: 'read',
		description:
			'List the recipients of one Mixmax sequence with their per-stage activity.',
	},
	'sequences.recipients.add': {
		riskLevel: 'write',
		description:
			'Add recipients to a Mixmax sequence, starting their sequence emails unless kept as drafts.',
	},
	'sequenceFolders.list': {
		riskLevel: 'read',
		description: 'List the Mixmax sequence folders the user can access.',
	},
	'sequenceFolders.create': {
		riskLevel: 'write',
		description: 'Create a Mixmax sequence folder.',
	},
	'sequenceFolders.get': {
		riskLevel: 'read',
		description: 'Retrieve one Mixmax sequence folder by id.',
	},
	'sequenceFolders.rename': {
		riskLevel: 'write',
		description: 'Rename a Mixmax sequence folder.',
	},
	'sequenceFolders.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a Mixmax sequence folder; its sequences are kept but left without a folder.',
	},
	'sequenceFolders.addSequences': {
		riskLevel: 'write',
		description: 'Move one or more Mixmax sequences into a sequence folder.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mixmaxEndpointsNested>;

export const mixmaxAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType = 'api_key' as const;

// Binds every Mixmax endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withMixmaxSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				mixmaxEndpointSchemas[operation as keyof typeof mixmaxEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing Mixmax endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withMixmaxSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuild keeps the caller's tree shape while each leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const validatedMixmaxEndpointsNested = withMixmaxSchemas(mixmaxEndpointsNested);

export type BaseMixmaxPlugin<T extends MixmaxPluginOptions> = CorsairPlugin<
	'mixmax',
	typeof MixmaxSchema,
	typeof mixmaxEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalMixmaxPlugin = BaseMixmaxPlugin<MixmaxPluginOptions>;

export type ExternalMixmaxPlugin<T extends MixmaxPluginOptions> =
	BaseMixmaxPlugin<T>;

export function mixmax<const T extends MixmaxPluginOptions>(
	incomingOptions: MixmaxPluginOptions & T = {} as MixmaxPluginOptions & T,
): ExternalMixmaxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'mixmax',
		authConfig: mixmaxAuthConfig,
		schema: MixmaxSchema,
		options: options,
		hooks: options.hooks,
		endpoints: validatedMixmaxEndpointsNested,
		webhooks: {},
		endpointMeta: mixmaxEndpointMeta,
		endpointSchemas: mixmaxEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MixmaxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('mixmax', 'api_key');
		},
	} satisfies InternalMixmaxPlugin;
}

export type {
	MixmaxEndpointInputs,
	MixmaxEndpointOutputs,
} from './endpoints/types';
