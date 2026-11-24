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
	BatchEndpoints,
	ConditionsEndpoints,
	CorrespondenceEndpoints,
	EventTypesEndpoints,
	RecipientsEndpoints,
	SearchFiltersEndpoints,
	TemplatesEndpoints,
	TransactionTypesEndpoints,
} from './endpoints';
import type {
	SpondyrEndpointInputs,
	SpondyrEndpointOutputs,
} from './endpoints/types';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SpondyrSchema } from './schema';

export type SpondyrPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The Application Token. Spondyr needs both this and the Subscription API
	 * key on every request, and only one of them reaches the endpoint as
	 * `ctx.key`, so the token is read here.
	 */
	applicationToken?: string;
	hooks?: InternalSpondyrPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof spondyrEndpointsNested>;
};

/**
 * Both credentials live on the account: `api_key` is the base field, and
 * `application_token` gets a `get_application_token` accessor from this
 * declaration. Declaring it under `integration` instead would not work, because
 * an `api_key` account has no `get_integration_credentials` accessor.
 */
export const spondyrAuthConfig = {
	api_key: {
		account: ['application_token'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SpondyrContext = CorsairPluginContext<
	typeof SpondyrSchema,
	SpondyrPluginOptions,
	undefined,
	typeof spondyrAuthConfig
>;

export type SpondyrKeyBuilderContext = KeyBuilderContext<
	SpondyrPluginOptions,
	typeof spondyrAuthConfig
>;

export type SpondyrBoundEndpoints = BindEndpoints<
	typeof spondyrEndpointsNested
>;

type SpondyrEndpoint<K extends keyof SpondyrEndpointOutputs> = CorsairEndpoint<
	SpondyrContext,
	SpondyrEndpointInputs[K],
	SpondyrEndpointOutputs[K]
>;

export type SpondyrEndpoints = {
	correspondenceSend: SpondyrEndpoint<'send'>;
	correspondenceDeliver: SpondyrEndpoint<'deliver'>;
	correspondenceStatus: SpondyrEndpoint<'status'>;
	correspondenceRetry: SpondyrEndpoint<'retry'>;
	correspondenceSearch: SpondyrEndpoint<'search'>;
	batchSend: SpondyrEndpoint<'batchSend'>;
	batchStatus: SpondyrEndpoint<'batchStatus'>;
	transactionTypesList: SpondyrEndpoint<'listTransactionTypes'>;
	transactionTypesGet: SpondyrEndpoint<'getTransactionType'>;
	transactionTypesCreate: SpondyrEndpoint<'createTransactionType'>;
	transactionTypesUpdate: SpondyrEndpoint<'updateTransactionType'>;
	transactionTypesDelete: SpondyrEndpoint<'deleteTransactionType'>;
	eventTypesList: SpondyrEndpoint<'listEventTypes'>;
	eventTypesGet: SpondyrEndpoint<'getEventType'>;
	eventTypesCreate: SpondyrEndpoint<'createEventType'>;
	eventTypesUpdate: SpondyrEndpoint<'updateEventType'>;
	eventTypesDelete: SpondyrEndpoint<'deleteEventType'>;
	recipientsList: SpondyrEndpoint<'listRecipients'>;
	recipientsGet: SpondyrEndpoint<'getRecipient'>;
	recipientsCreate: SpondyrEndpoint<'createRecipient'>;
	recipientsUpdate: SpondyrEndpoint<'updateRecipient'>;
	recipientsDelete: SpondyrEndpoint<'deleteRecipient'>;
	conditionsList: SpondyrEndpoint<'listConditions'>;
	conditionsGet: SpondyrEndpoint<'getCondition'>;
	conditionsCreate: SpondyrEndpoint<'createCondition'>;
	conditionsUpdate: SpondyrEndpoint<'updateCondition'>;
	conditionsDelete: SpondyrEndpoint<'deleteCondition'>;
	searchFiltersList: SpondyrEndpoint<'listSearchFilters'>;
	searchFiltersGet: SpondyrEndpoint<'getSearchFilter'>;
	searchFiltersCreate: SpondyrEndpoint<'createSearchFilter'>;
	searchFiltersUpdate: SpondyrEndpoint<'updateSearchFilter'>;
	searchFiltersDelete: SpondyrEndpoint<'deleteSearchFilter'>;
	templatesList: SpondyrEndpoint<'listTemplates'>;
	templatesGet: SpondyrEndpoint<'getTemplate'>;
	templatesCreate: SpondyrEndpoint<'createTemplate'>;
	templatesUpdate: SpondyrEndpoint<'updateTemplate'>;
	templatesDelete: SpondyrEndpoint<'deleteTemplate'>;
	templatesUploadContent: SpondyrEndpoint<'uploadTemplateContent'>;
};

const spondyrEndpointsNested = {
	correspondence: {
		send: CorrespondenceEndpoints.send,
		deliver: CorrespondenceEndpoints.deliver,
		status: CorrespondenceEndpoints.status,
		retry: CorrespondenceEndpoints.retry,
		search: CorrespondenceEndpoints.search,
	},
	batch: {
		send: BatchEndpoints.send,
		status: BatchEndpoints.status,
	},
	transactionTypes: {
		list: TransactionTypesEndpoints.list,
		get: TransactionTypesEndpoints.get,
		create: TransactionTypesEndpoints.create,
		update: TransactionTypesEndpoints.update,
		delete: TransactionTypesEndpoints.delete,
	},
	eventTypes: {
		list: EventTypesEndpoints.list,
		get: EventTypesEndpoints.get,
		create: EventTypesEndpoints.create,
		update: EventTypesEndpoints.update,
		delete: EventTypesEndpoints.delete,
	},
	recipients: {
		list: RecipientsEndpoints.list,
		get: RecipientsEndpoints.get,
		create: RecipientsEndpoints.create,
		update: RecipientsEndpoints.update,
		delete: RecipientsEndpoints.delete,
	},
	conditions: {
		list: ConditionsEndpoints.list,
		get: ConditionsEndpoints.get,
		create: ConditionsEndpoints.create,
		update: ConditionsEndpoints.update,
		delete: ConditionsEndpoints.delete,
	},
	searchFilters: {
		list: SearchFiltersEndpoints.list,
		get: SearchFiltersEndpoints.get,
		create: SearchFiltersEndpoints.create,
		update: SearchFiltersEndpoints.update,
		delete: SearchFiltersEndpoints.delete,
	},
	templates: {
		list: TemplatesEndpoints.list,
		get: TemplatesEndpoints.get,
		create: TemplatesEndpoints.create,
		update: TemplatesEndpoints.update,
		delete: TemplatesEndpoints.delete,
		uploadContent: TemplatesEndpoints.uploadContent,
	},
} as const;

export const spondyrEndpointSchemas = {
	'correspondence.send': {
		input: SpondyrEndpointInputSchemas.send,
		output: SpondyrEndpointOutputSchemas.send,
	},
	'correspondence.deliver': {
		input: SpondyrEndpointInputSchemas.deliver,
		output: SpondyrEndpointOutputSchemas.deliver,
	},
	'correspondence.status': {
		input: SpondyrEndpointInputSchemas.status,
		output: SpondyrEndpointOutputSchemas.status,
	},
	'correspondence.retry': {
		input: SpondyrEndpointInputSchemas.retry,
		output: SpondyrEndpointOutputSchemas.retry,
	},
	'correspondence.search': {
		input: SpondyrEndpointInputSchemas.search,
		output: SpondyrEndpointOutputSchemas.search,
	},
	'batch.send': {
		input: SpondyrEndpointInputSchemas.batchSend,
		output: SpondyrEndpointOutputSchemas.batchSend,
	},
	'batch.status': {
		input: SpondyrEndpointInputSchemas.batchStatus,
		output: SpondyrEndpointOutputSchemas.batchStatus,
	},
	'transactionTypes.list': {
		input: SpondyrEndpointInputSchemas.listTransactionTypes,
		output: SpondyrEndpointOutputSchemas.listTransactionTypes,
	},
	'transactionTypes.get': {
		input: SpondyrEndpointInputSchemas.getTransactionType,
		output: SpondyrEndpointOutputSchemas.getTransactionType,
	},
	'transactionTypes.create': {
		input: SpondyrEndpointInputSchemas.createTransactionType,
		output: SpondyrEndpointOutputSchemas.createTransactionType,
	},
	'transactionTypes.update': {
		input: SpondyrEndpointInputSchemas.updateTransactionType,
		output: SpondyrEndpointOutputSchemas.updateTransactionType,
	},
	'transactionTypes.delete': {
		input: SpondyrEndpointInputSchemas.deleteTransactionType,
		output: SpondyrEndpointOutputSchemas.deleteTransactionType,
	},
	'eventTypes.list': {
		input: SpondyrEndpointInputSchemas.listEventTypes,
		output: SpondyrEndpointOutputSchemas.listEventTypes,
	},
	'eventTypes.get': {
		input: SpondyrEndpointInputSchemas.getEventType,
		output: SpondyrEndpointOutputSchemas.getEventType,
	},
	'eventTypes.create': {
		input: SpondyrEndpointInputSchemas.createEventType,
		output: SpondyrEndpointOutputSchemas.createEventType,
	},
	'eventTypes.update': {
		input: SpondyrEndpointInputSchemas.updateEventType,
		output: SpondyrEndpointOutputSchemas.updateEventType,
	},
	'eventTypes.delete': {
		input: SpondyrEndpointInputSchemas.deleteEventType,
		output: SpondyrEndpointOutputSchemas.deleteEventType,
	},
	'recipients.list': {
		input: SpondyrEndpointInputSchemas.listRecipients,
		output: SpondyrEndpointOutputSchemas.listRecipients,
	},
	'recipients.get': {
		input: SpondyrEndpointInputSchemas.getRecipient,
		output: SpondyrEndpointOutputSchemas.getRecipient,
	},
	'recipients.create': {
		input: SpondyrEndpointInputSchemas.createRecipient,
		output: SpondyrEndpointOutputSchemas.createRecipient,
	},
	'recipients.update': {
		input: SpondyrEndpointInputSchemas.updateRecipient,
		output: SpondyrEndpointOutputSchemas.updateRecipient,
	},
	'recipients.delete': {
		input: SpondyrEndpointInputSchemas.deleteRecipient,
		output: SpondyrEndpointOutputSchemas.deleteRecipient,
	},
	'conditions.list': {
		input: SpondyrEndpointInputSchemas.listConditions,
		output: SpondyrEndpointOutputSchemas.listConditions,
	},
	'conditions.get': {
		input: SpondyrEndpointInputSchemas.getCondition,
		output: SpondyrEndpointOutputSchemas.getCondition,
	},
	'conditions.create': {
		input: SpondyrEndpointInputSchemas.createCondition,
		output: SpondyrEndpointOutputSchemas.createCondition,
	},
	'conditions.update': {
		input: SpondyrEndpointInputSchemas.updateCondition,
		output: SpondyrEndpointOutputSchemas.updateCondition,
	},
	'conditions.delete': {
		input: SpondyrEndpointInputSchemas.deleteCondition,
		output: SpondyrEndpointOutputSchemas.deleteCondition,
	},
	'searchFilters.list': {
		input: SpondyrEndpointInputSchemas.listSearchFilters,
		output: SpondyrEndpointOutputSchemas.listSearchFilters,
	},
	'searchFilters.get': {
		input: SpondyrEndpointInputSchemas.getSearchFilter,
		output: SpondyrEndpointOutputSchemas.getSearchFilter,
	},
	'searchFilters.create': {
		input: SpondyrEndpointInputSchemas.createSearchFilter,
		output: SpondyrEndpointOutputSchemas.createSearchFilter,
	},
	'searchFilters.update': {
		input: SpondyrEndpointInputSchemas.updateSearchFilter,
		output: SpondyrEndpointOutputSchemas.updateSearchFilter,
	},
	'searchFilters.delete': {
		input: SpondyrEndpointInputSchemas.deleteSearchFilter,
		output: SpondyrEndpointOutputSchemas.deleteSearchFilter,
	},
	'templates.list': {
		input: SpondyrEndpointInputSchemas.listTemplates,
		output: SpondyrEndpointOutputSchemas.listTemplates,
	},
	'templates.get': {
		input: SpondyrEndpointInputSchemas.getTemplate,
		output: SpondyrEndpointOutputSchemas.getTemplate,
	},
	'templates.create': {
		input: SpondyrEndpointInputSchemas.createTemplate,
		output: SpondyrEndpointOutputSchemas.createTemplate,
	},
	'templates.update': {
		input: SpondyrEndpointInputSchemas.updateTemplate,
		output: SpondyrEndpointOutputSchemas.updateTemplate,
	},
	'templates.delete': {
		input: SpondyrEndpointInputSchemas.deleteTemplate,
		output: SpondyrEndpointOutputSchemas.deleteTemplate,
	},
	'templates.uploadContent': {
		input: SpondyrEndpointInputSchemas.uploadTemplateContent,
		output: SpondyrEndpointOutputSchemas.uploadTemplateContent,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof spondyrEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const spondyrEndpointMeta = {
	'correspondence.send': {
		riskLevel: 'destructive',
		description:
			'Generate correspondence from a Transaction Type and either deliver it or hold it for `correspondence.deliver`',
	},
	'correspondence.deliver': {
		riskLevel: 'destructive',
		description:
			'Deliver correspondence that was generated with `is_generate_only`, optionally to extra recipients',
	},
	'correspondence.status': {
		riskLevel: 'read',
		description:
			'Read the status of a generated request, one entry per template, with each recipient delivery result',
	},
	'correspondence.retry': {
		riskLevel: 'destructive',
		description: 'Retry the templates that errored on a previous request',
	},
	'correspondence.search': {
		riskLevel: 'read',
		description:
			'Search past requests by batch, Event Type or Search Filter, with paging up to 250 a page',
	},
	'batch.send': {
		riskLevel: 'destructive',
		description:
			'Generate correspondence for a list of data objects in one request, optionally merging shared data into each',
	},
	'batch.status': {
		riskLevel: 'read',
		description:
			'Read a batch progress: items processed, and the reference ID of each item that errored',
	},
	'transactionTypes.list': {
		riskLevel: 'read',
		description: 'List the Transaction Types on the subscription',
	},
	'transactionTypes.get': {
		riskLevel: 'read',
		description: 'Get one Transaction Type with its JSON and CSV field samples',
	},
	'transactionTypes.create': {
		riskLevel: 'write',
		description:
			'Create a Transaction Type from a JSON sample that defines the template fields',
	},
	'transactionTypes.update': {
		riskLevel: 'write',
		description: 'Change a Transaction Type name or its JSON sample',
	},
	'transactionTypes.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a Transaction Type; every template, condition and search filter built on it goes with it',
	},
	'eventTypes.list': {
		riskLevel: 'read',
		description: 'List the Event Types of one Transaction Type',
	},
	'eventTypes.get': {
		riskLevel: 'read',
		description: 'Get one Event Type and the Transaction Type it belongs to',
	},
	'eventTypes.create': {
		riskLevel: 'write',
		description: 'Add an Event Type to a Transaction Type',
	},
	'eventTypes.update': {
		riskLevel: 'write',
		description: 'Rename an Event Type or move it to another Transaction Type',
	},
	'eventTypes.delete': {
		riskLevel: 'destructive',
		description:
			'Delete an Event Type; templates that reference it stop matching',
	},
	'recipients.list': {
		riskLevel: 'read',
		description: "List a Transaction Type's Recipients with their addresses",
	},
	'recipients.get': {
		riskLevel: 'read',
		description: 'Get one Recipient and the placeholder fields it resolves',
	},
	'recipients.create': {
		riskLevel: 'write',
		description:
			'Create a Recipient; any address field may hold a `{FieldName}` placeholder',
	},
	'recipients.update': {
		riskLevel: 'write',
		description: 'Change a Recipient name, address or placeholder fields',
	},
	'recipients.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recipient; templates that name it stop resolving',
	},
	'conditions.list': {
		riskLevel: 'read',
		description: 'List the template-selection Conditions of a Transaction Type',
	},
	'conditions.get': {
		riskLevel: 'read',
		description: 'Get one Condition and the field it inspects',
	},
	'conditions.create': {
		riskLevel: 'write',
		description: 'Create a Condition that decides which template is used',
	},
	'conditions.update': {
		riskLevel: 'write',
		description: 'Change a Condition field or its accepted values',
	},
	'conditions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a Condition; templates that reference it stop matching',
	},
	'searchFilters.list': {
		riskLevel: 'read',
		description: "List a Transaction Type's Search Filters",
	},
	'searchFilters.get': {
		riskLevel: 'read',
		description:
			'Get one Search Filter and the tag it writes onto correspondence',
	},
	'searchFilters.create': {
		riskLevel: 'write',
		description:
			'Create a Search Filter that tags generated correspondence for later search',
	},
	'searchFilters.update': {
		riskLevel: 'write',
		description: 'Change a Search Filter tag',
	},
	'searchFilters.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Search Filter; existing tags stay on the documents',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List the templates of a Transaction Type with their recipients',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			'Get one template with its content reference, recipients, conditions and search filters',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create a template from previously uploaded content, with its delivery recipients and conditions',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			'Change a template content, recipients, conditions or searches',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a template',
	},
	'templates.uploadContent': {
		riskLevel: 'write',
		description:
			'Upload a template file as base64 and return the reference ID a template needs; the content can attach to one template only',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof spondyrEndpointsNested>;

export type BaseSpondyrPlugin<T extends SpondyrPluginOptions> = CorsairPlugin<
	'spondyr',
	typeof SpondyrSchema,
	typeof spondyrEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof spondyrAuthConfig
>;

export type InternalSpondyrPlugin = BaseSpondyrPlugin<SpondyrPluginOptions>;

export type ExternalSpondyrPlugin<T extends SpondyrPluginOptions> =
	BaseSpondyrPlugin<T>;

export function spondyr<const T extends SpondyrPluginOptions>(
	incomingOptions: SpondyrPluginOptions & T = {} as SpondyrPluginOptions & T,
): ExternalSpondyrPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'spondyr',
		authConfig: spondyrAuthConfig,
		schema: SpondyrSchema,
		options: options,
		hooks: options.hooks,
		endpoints: spondyrEndpointsNested,
		webhooks: {},
		endpointMeta: spondyrEndpointMeta,
		endpointSchemas: spondyrEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SpondyrKeyBuilderContext, source) => {
			// Spondyr needs the Application Token on every call. Checking it here (as Algolia does
			// for its applicationId) turns a missing one into a connect link instead of an endpoint error.
			const ensureApplicationToken = async () => {
				if (options.applicationToken) return;
				if (!(await ctx.keys?.get_application_token?.())) {
					throw new AuthMissingError('spondyr', 'api_key');
				}
			};

			if (source === 'endpoint' && options.key) {
				await ensureApplicationToken();
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) {
					await ensureApplicationToken();
					return res;
				}
			}

			throw new AuthMissingError('spondyr', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSpondyrPlugin;
}

export type { SpondyrCredentials } from './client';
export type {
	BatchSendInput,
	BatchStatusInput,
	CreateConditionInput,
	CreateEventTypeInput,
	CreateRecipientInput,
	CreateSearchFilterInput,
	CreateTemplateInput,
	CreateTransactionTypeInput,
	DeliverInput,
	RetryInput,
	SearchInput,
	SearchOutput,
	SendInput,
	SpondyrEndpointInputs,
	SpondyrEndpointOutputs,
	StatusInput,
	StatusOutput,
	TemplateContentInput,
	UpdateConditionInput,
	UpdateEventTypeInput,
	UpdateRecipientInput,
	UpdateSearchFilterInput,
	UpdateTemplateInput,
	UpdateTransactionTypeInput,
} from './endpoints/types';
