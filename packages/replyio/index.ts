import type {
	BindEndpoints,
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
	ContactLists,
	Contacts,
	EmailAccounts,
	Schedules,
	SequenceContacts,
	Sequences,
	Steps,
	Users,
} from './endpoints';
import type { ReplyioEndpoint } from './endpoints/context';
import {
	ReplyioEndpointInputSchemas,
	ReplyioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ReplyioSchema } from './schema';

export type ReplyioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalReplyioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof replyioEndpointsNested>;
};

export type ReplyioContext = CorsairPluginContext<
	typeof ReplyioSchema,
	ReplyioPluginOptions
>;

export type ReplyioKeyBuilderContext = KeyBuilderContext<ReplyioPluginOptions>;

export type ReplyioBoundEndpoints = BindEndpoints<
	typeof replyioEndpointsNested
>;

export type ReplyioEndpoints = {
	contactsCreate: ReplyioEndpoint<'contactsCreate'>;
	contactsGet: ReplyioEndpoint<'contactsGet'>;
	contactsUpdate: ReplyioEndpoint<'contactsUpdate'>;
	contactsDelete: ReplyioEndpoint<'contactsDelete'>;
	contactsList: ReplyioEndpoint<'contactsList'>;
	contactsSearchByEmail: ReplyioEndpoint<'contactsSearchByEmail'>;
	contactsGetStatus: ReplyioEndpoint<'contactsGetStatus'>;
	contactsSetStatus: ReplyioEndpoint<'contactsSetStatus'>;
	contactsClearStatus: ReplyioEndpoint<'contactsClearStatus'>;
	sequencesList: ReplyioEndpoint<'sequencesList'>;
	sequencesGet: ReplyioEndpoint<'sequencesGet'>;
	sequencesDelete: ReplyioEndpoint<'sequencesDelete'>;
	sequencesStart: ReplyioEndpoint<'sequencesStart'>;
	sequencesPause: ReplyioEndpoint<'sequencesPause'>;
	sequencesArchive: ReplyioEndpoint<'sequencesArchive'>;
	stepsList: ReplyioEndpoint<'stepsList'>;
	stepsGet: ReplyioEndpoint<'stepsGet'>;
	stepsCreate: ReplyioEndpoint<'stepsCreate'>;
	sequenceContactsAdd: ReplyioEndpoint<'sequenceContactsAdd'>;
	sequenceContactsRemove: ReplyioEndpoint<'sequenceContactsRemove'>;
	sequenceContactsBulkRemove: ReplyioEndpoint<'sequenceContactsBulkRemove'>;
	sequenceContactsListExtended: ReplyioEndpoint<'sequenceContactsListExtended'>;
	sequenceContactsSetStatus: ReplyioEndpoint<'sequenceContactsSetStatus'>;
	emailAccountsList: ReplyioEndpoint<'emailAccountsList'>;
	emailAccountsListDisconnected: ReplyioEndpoint<'emailAccountsListDisconnected'>;
	emailAccountsUpdate: ReplyioEndpoint<'emailAccountsUpdate'>;
	emailAccountsDelete: ReplyioEndpoint<'emailAccountsDelete'>;
	emailAccountsConnectGmail: ReplyioEndpoint<'emailAccountsConnectGmail'>;
	emailAccountsConnectOffice365: ReplyioEndpoint<'emailAccountsConnectOffice365'>;
	schedulesDelete: ReplyioEndpoint<'schedulesDelete'>;
	usersGetCurrent: ReplyioEndpoint<'usersGetCurrent'>;
	usersListTeam: ReplyioEndpoint<'usersListTeam'>;
	contactListsList: ReplyioEndpoint<'contactListsList'>;
};

const replyioEndpointsNested = {
	contacts: {
		create: Contacts.create,
		get: Contacts.get,
		update: Contacts.update,
		delete: Contacts.delete,
		list: Contacts.list,
		searchByEmail: Contacts.searchByEmail,
		getStatus: Contacts.getStatus,
		setStatus: Contacts.setStatus,
		clearStatus: Contacts.clearStatus,
	},
	sequences: {
		list: Sequences.list,
		get: Sequences.get,
		delete: Sequences.delete,
		start: Sequences.start,
		pause: Sequences.pause,
		archive: Sequences.archive,
	},
	steps: {
		list: Steps.list,
		get: Steps.get,
		create: Steps.create,
	},
	sequenceContacts: {
		add: SequenceContacts.add,
		remove: SequenceContacts.remove,
		bulkRemove: SequenceContacts.bulkRemove,
		listExtended: SequenceContacts.listExtended,
		setStatus: SequenceContacts.setStatus,
	},
	emailAccounts: {
		list: EmailAccounts.list,
		listDisconnected: EmailAccounts.listDisconnected,
		update: EmailAccounts.update,
		delete: EmailAccounts.delete,
		connectGmail: EmailAccounts.connectGmail,
		connectOffice365: EmailAccounts.connectOffice365,
	},
	schedules: {
		delete: Schedules.delete,
	},
	users: {
		getCurrent: Users.getCurrent,
		listTeam: Users.listTeam,
	},
	contactLists: {
		list: ContactLists.list,
	},
} as const;

// Reply.io exposes no webhook subscriptions for this integration surface, so
// the plugin ships no webhooks. An empty nested map is the established
// convention for webhook-less plugins.
const replyioWebhooksNested = {} as const;

export const replyioEndpointSchemas = {
	'contacts.create': {
		input: ReplyioEndpointInputSchemas.contactsCreate,
		output: ReplyioEndpointOutputSchemas.contactsCreate,
	},
	'contacts.get': {
		input: ReplyioEndpointInputSchemas.contactsGet,
		output: ReplyioEndpointOutputSchemas.contactsGet,
	},
	'contacts.update': {
		input: ReplyioEndpointInputSchemas.contactsUpdate,
		output: ReplyioEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: ReplyioEndpointInputSchemas.contactsDelete,
		output: ReplyioEndpointOutputSchemas.contactsDelete,
	},
	'contacts.list': {
		input: ReplyioEndpointInputSchemas.contactsList,
		output: ReplyioEndpointOutputSchemas.contactsList,
	},
	'contacts.searchByEmail': {
		input: ReplyioEndpointInputSchemas.contactsSearchByEmail,
		output: ReplyioEndpointOutputSchemas.contactsSearchByEmail,
	},
	'contacts.getStatus': {
		input: ReplyioEndpointInputSchemas.contactsGetStatus,
		output: ReplyioEndpointOutputSchemas.contactsGetStatus,
	},
	'contacts.setStatus': {
		input: ReplyioEndpointInputSchemas.contactsSetStatus,
		output: ReplyioEndpointOutputSchemas.contactsSetStatus,
	},
	'contacts.clearStatus': {
		input: ReplyioEndpointInputSchemas.contactsClearStatus,
		output: ReplyioEndpointOutputSchemas.contactsClearStatus,
	},
	'sequences.list': {
		input: ReplyioEndpointInputSchemas.sequencesList,
		output: ReplyioEndpointOutputSchemas.sequencesList,
	},
	'sequences.get': {
		input: ReplyioEndpointInputSchemas.sequencesGet,
		output: ReplyioEndpointOutputSchemas.sequencesGet,
	},
	'sequences.delete': {
		input: ReplyioEndpointInputSchemas.sequencesDelete,
		output: ReplyioEndpointOutputSchemas.sequencesDelete,
	},
	'sequences.start': {
		input: ReplyioEndpointInputSchemas.sequencesStart,
		output: ReplyioEndpointOutputSchemas.sequencesStart,
	},
	'sequences.pause': {
		input: ReplyioEndpointInputSchemas.sequencesPause,
		output: ReplyioEndpointOutputSchemas.sequencesPause,
	},
	'sequences.archive': {
		input: ReplyioEndpointInputSchemas.sequencesArchive,
		output: ReplyioEndpointOutputSchemas.sequencesArchive,
	},
	'steps.list': {
		input: ReplyioEndpointInputSchemas.stepsList,
		output: ReplyioEndpointOutputSchemas.stepsList,
	},
	'steps.get': {
		input: ReplyioEndpointInputSchemas.stepsGet,
		output: ReplyioEndpointOutputSchemas.stepsGet,
	},
	'steps.create': {
		input: ReplyioEndpointInputSchemas.stepsCreate,
		output: ReplyioEndpointOutputSchemas.stepsCreate,
	},
	'sequenceContacts.add': {
		input: ReplyioEndpointInputSchemas.sequenceContactsAdd,
		output: ReplyioEndpointOutputSchemas.sequenceContactsAdd,
	},
	'sequenceContacts.remove': {
		input: ReplyioEndpointInputSchemas.sequenceContactsRemove,
		output: ReplyioEndpointOutputSchemas.sequenceContactsRemove,
	},
	'sequenceContacts.bulkRemove': {
		input: ReplyioEndpointInputSchemas.sequenceContactsBulkRemove,
		output: ReplyioEndpointOutputSchemas.sequenceContactsBulkRemove,
	},
	'sequenceContacts.listExtended': {
		input: ReplyioEndpointInputSchemas.sequenceContactsListExtended,
		output: ReplyioEndpointOutputSchemas.sequenceContactsListExtended,
	},
	'sequenceContacts.setStatus': {
		input: ReplyioEndpointInputSchemas.sequenceContactsSetStatus,
		output: ReplyioEndpointOutputSchemas.sequenceContactsSetStatus,
	},
	'emailAccounts.list': {
		input: ReplyioEndpointInputSchemas.emailAccountsList,
		output: ReplyioEndpointOutputSchemas.emailAccountsList,
	},
	'emailAccounts.listDisconnected': {
		input: ReplyioEndpointInputSchemas.emailAccountsListDisconnected,
		output: ReplyioEndpointOutputSchemas.emailAccountsListDisconnected,
	},
	'emailAccounts.update': {
		input: ReplyioEndpointInputSchemas.emailAccountsUpdate,
		output: ReplyioEndpointOutputSchemas.emailAccountsUpdate,
	},
	'emailAccounts.delete': {
		input: ReplyioEndpointInputSchemas.emailAccountsDelete,
		output: ReplyioEndpointOutputSchemas.emailAccountsDelete,
	},
	'emailAccounts.connectGmail': {
		input: ReplyioEndpointInputSchemas.emailAccountsConnectGmail,
		output: ReplyioEndpointOutputSchemas.emailAccountsConnectGmail,
	},
	'emailAccounts.connectOffice365': {
		input: ReplyioEndpointInputSchemas.emailAccountsConnectOffice365,
		output: ReplyioEndpointOutputSchemas.emailAccountsConnectOffice365,
	},
	'schedules.delete': {
		input: ReplyioEndpointInputSchemas.schedulesDelete,
		output: ReplyioEndpointOutputSchemas.schedulesDelete,
	},
	'users.getCurrent': {
		input: ReplyioEndpointInputSchemas.usersGetCurrent,
		output: ReplyioEndpointOutputSchemas.usersGetCurrent,
	},
	'users.listTeam': {
		input: ReplyioEndpointInputSchemas.usersListTeam,
		output: ReplyioEndpointOutputSchemas.usersListTeam,
	},
	'contactLists.list': {
		input: ReplyioEndpointInputSchemas.contactListsList,
		output: ReplyioEndpointOutputSchemas.contactListsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof replyioEndpointsNested
>;

const defaultAuthType: PickAuth<'api_key'> = 'api_key';

const replyioEndpointMeta = {
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact in Reply.io',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a contact by ID',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contact [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with pagination and optional filters',
	},
	'contacts.searchByEmail': {
		riskLevel: 'read',
		description: 'Search contacts by exact email address',
	},
	'contacts.getStatus': {
		riskLevel: 'read',
		description: "Get a contact's statuses across sequences",
	},
	'contacts.setStatus': {
		riskLevel: 'write',
		description: "Set contacts' in-sequence status in bulk",
	},
	'contacts.clearStatus': {
		riskLevel: 'write',
		description: 'Clear clearable contact statuses (opt-out, replied, bounced)',
	},
	'sequences.list': {
		riskLevel: 'read',
		description: 'List sequences with pagination and optional filters',
	},
	'sequences.get': {
		riskLevel: 'read',
		description: 'Get a sequence by ID with settings and steps',
	},
	'sequences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a sequence [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'sequences.start': {
		riskLevel: 'write',
		description: 'Start a sequence in New or Paused status',
	},
	'sequences.pause': {
		riskLevel: 'write',
		description: 'Pause a running sequence',
	},
	'sequences.archive': {
		riskLevel: 'write',
		description: 'Archive a sequence and remove its contacts',
	},
	'steps.list': {
		riskLevel: 'read',
		description: 'List all steps in a sequence',
	},
	'steps.get': {
		riskLevel: 'read',
		description: 'Get a sequence step by ID',
	},
	'steps.create': {
		riskLevel: 'write',
		description: 'Add a new step to a sequence',
	},
	'sequenceContacts.add': {
		riskLevel: 'write',
		description: 'Add contacts to a sequence in bulk',
	},
	'sequenceContacts.remove': {
		riskLevel: 'write',
		description: 'Remove a contact from a sequence',
	},
	'sequenceContacts.bulkRemove': {
		riskLevel: 'write',
		description: 'Remove multiple contacts from a sequence at once',
	},
	'sequenceContacts.listExtended': {
		riskLevel: 'read',
		description: 'List sequence contacts with extended engagement state',
	},
	'sequenceContacts.setStatus': {
		riskLevel: 'write',
		description: "Set contacts' status for enrollments in a specific sequence",
	},
	'emailAccounts.list': {
		riskLevel: 'read',
		description: 'List email accounts with pagination',
	},
	'emailAccounts.listDisconnected': {
		riskLevel: 'read',
		description:
			'List email accounts disconnected by auth or connection errors',
	},
	'emailAccounts.update': {
		riskLevel: 'write',
		description: 'Update an email account with custom SMTP/IMAP settings',
	},
	'emailAccounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an email account [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'emailAccounts.connectGmail': {
		riskLevel: 'write',
		description: 'Get the Gmail OAuth connect URL for the user to open',
	},
	'emailAccounts.connectOffice365': {
		riskLevel: 'write',
		description: 'Get the Microsoft 365 OAuth connect URL for the user to open',
	},
	'schedules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a sending schedule [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the current authenticated user and verify the API key',
	},
	'users.listTeam': {
		riskLevel: 'read',
		description: 'List users on the current team',
	},
	'contactLists.list': {
		riskLevel: 'read',
		description: 'List contact lists with pagination',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof replyioEndpointsNested>;

export const replyioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseReplyioPlugin<T extends ReplyioPluginOptions> = CorsairPlugin<
	'replyio',
	typeof ReplyioSchema,
	typeof replyioEndpointsNested,
	typeof replyioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalReplyioPlugin = BaseReplyioPlugin<ReplyioPluginOptions>;

export type ExternalReplyioPlugin<T extends ReplyioPluginOptions> =
	BaseReplyioPlugin<T>;

// The factory is intentionally non-generic: the generated scaffold uses a
// `const T` type parameter with a type assertion on the default options
// object, and this plugin forbids type assertions. Callers still get a fully
// typed plugin; only literal-level inference of caller-supplied overrides is
// not captured.
export function replyio(
	incomingOptions?: ReplyioPluginOptions,
): ExternalReplyioPlugin<ReplyioPluginOptions> {
	const options: ReplyioPluginOptions = {
		...incomingOptions,
		authType: incomingOptions?.authType ?? defaultAuthType,
	};
	return {
		id: 'replyio',
		authConfig: replyioAuthConfig,
		schema: ReplyioSchema,
		options,
		hooks: options.hooks,
		endpoints: replyioEndpointsNested,
		webhooks: replyioWebhooksNested,
		endpointMeta: replyioEndpointMeta,
		endpointSchemas: replyioEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ReplyioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('replyio', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('replyio', 'api_key');
		},
	} satisfies InternalReplyioPlugin;
}

export type {
	Contact,
	ContactStatus,
	CurrentUser,
	EmailAccountDetail,
	EmailAccountListItem,
	ReplyioEndpointInputs,
	ReplyioEndpointOutputs,
	SequenceContactExtended,
	SequenceDetail,
	SequenceListItem,
	SequenceStep,
	TeamUser,
} from './endpoints/types';
export * from './error-handlers';
