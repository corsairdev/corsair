import type {
	BindEndpoints,
	CorsairEndpoint,
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
import {
	Account,
	Contacts,
	Forms,
	Responses,
	Segments,
	Users,
} from './endpoints';
import type {
	RefinerEndpointInputs,
	RefinerEndpointOutputs,
} from './endpoints/types';
import {
	RefinerEndpointInputSchemas,
	RefinerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RefinerSchema } from './schema';

export type RefinerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRefinerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof refinerEndpointsNested>;
};

export type RefinerContext = CorsairPluginContext<
	typeof RefinerSchema,
	RefinerPluginOptions
>;

export type RefinerKeyBuilderContext = KeyBuilderContext<RefinerPluginOptions>;

export type RefinerBoundEndpoints = BindEndpoints<
	typeof refinerEndpointsNested
>;

type RefinerEndpoint<K extends keyof RefinerEndpointOutputs> = CorsairEndpoint<
	RefinerContext,
	RefinerEndpointInputs[K],
	RefinerEndpointOutputs[K]
>;

export type RefinerEndpoints = {
	accountGet: RefinerEndpoint<'accountGet'>;
	identifyUser: RefinerEndpoint<'identifyUser'>;
	trackEvent: RefinerEndpoint<'trackEvent'>;
	responsesList: RefinerEndpoint<'responsesList'>;
	responsesStore: RefinerEndpoint<'responsesStore'>;
	responsesTag: RefinerEndpoint<'responsesTag'>;
	reportingGet: RefinerEndpoint<'reportingGet'>;
	contactsList: RefinerEndpoint<'contactsList'>;
	contactsGet: RefinerEndpoint<'contactsGet'>;
	contactsDelete: RefinerEndpoint<'contactsDelete'>;
	formsList: RefinerEndpoint<'formsList'>;
	formsPublish: RefinerEndpoint<'formsPublish'>;
	formsDelete: RefinerEndpoint<'formsDelete'>;
	formsDuplicate: RefinerEndpoint<'formsDuplicate'>;
	formsHistory: RefinerEndpoint<'formsHistory'>;
	segmentsList: RefinerEndpoint<'segmentsList'>;
	segmentsSync: RefinerEndpoint<'segmentsSync'>;
};

const refinerEndpointsNested = {
	account: {
		get: Account.get,
	},
	users: {
		identify: Users.identify,
		track: Users.track,
	},
	responses: {
		list: Responses.list,
		store: Responses.store,
		tag: Responses.tag,
	},
	reporting: {
		get: Responses.report,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		delete: Contacts.remove,
	},
	forms: {
		list: Forms.list,
		publish: Forms.publish,
		archive: Forms.archive,
		duplicate: Forms.duplicate,
		history: Forms.history,
	},
	segments: {
		list: Segments.list,
		sync: Segments.sync,
	},
} as const;

export const refinerEndpointSchemas = {
	'account.get': {
		input: RefinerEndpointInputSchemas.accountGet,
		output: RefinerEndpointOutputSchemas.accountGet,
	},
	'users.identify': {
		input: RefinerEndpointInputSchemas.identifyUser,
		output: RefinerEndpointOutputSchemas.identifyUser,
	},
	'users.track': {
		input: RefinerEndpointInputSchemas.trackEvent,
		output: RefinerEndpointOutputSchemas.trackEvent,
	},
	'responses.list': {
		input: RefinerEndpointInputSchemas.responsesList,
		output: RefinerEndpointOutputSchemas.responsesList,
	},
	'responses.store': {
		input: RefinerEndpointInputSchemas.responsesStore,
		output: RefinerEndpointOutputSchemas.responsesStore,
	},
	'responses.tag': {
		input: RefinerEndpointInputSchemas.responsesTag,
		output: RefinerEndpointOutputSchemas.responsesTag,
	},
	'reporting.get': {
		input: RefinerEndpointInputSchemas.reportingGet,
		output: RefinerEndpointOutputSchemas.reportingGet,
	},
	'contacts.list': {
		input: RefinerEndpointInputSchemas.contactsList,
		output: RefinerEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: RefinerEndpointInputSchemas.contactsGet,
		output: RefinerEndpointOutputSchemas.contactsGet,
	},
	'contacts.delete': {
		input: RefinerEndpointInputSchemas.contactsDelete,
		output: RefinerEndpointOutputSchemas.contactsDelete,
	},
	'forms.list': {
		input: RefinerEndpointInputSchemas.formsList,
		output: RefinerEndpointOutputSchemas.formsList,
	},
	'forms.publish': {
		input: RefinerEndpointInputSchemas.formsPublish,
		output: RefinerEndpointOutputSchemas.formsPublish,
	},
	'forms.archive': {
		input: RefinerEndpointInputSchemas.formsDelete,
		output: RefinerEndpointOutputSchemas.formsDelete,
	},
	'forms.duplicate': {
		input: RefinerEndpointInputSchemas.formsDuplicate,
		output: RefinerEndpointOutputSchemas.formsDuplicate,
	},
	'forms.history': {
		input: RefinerEndpointInputSchemas.formsHistory,
		output: RefinerEndpointOutputSchemas.formsHistory,
	},
	'segments.list': {
		input: RefinerEndpointInputSchemas.segmentsList,
		output: RefinerEndpointOutputSchemas.segmentsList,
	},
	'segments.sync': {
		input: RefinerEndpointInputSchemas.segmentsSync,
		output: RefinerEndpointOutputSchemas.segmentsSync,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof refinerEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const refinerEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the subscription plan, monthly usage against each limit, and the environments in the account',
	},
	'users.identify': {
		riskLevel: 'write',
		description:
			"Identify a user by ID or email, creating the contact on first sight. Every other top-level key is saved as a trait, such as { id: 'user-1', plan: 'pro', signed_up_at: '2024-01-15' }",
	},
	'users.track': {
		riskLevel: 'write',
		description:
			'Track a named event for a user, creating the contact when no match exists',
	},
	'responses.list': {
		riskLevel: 'read',
		description:
			'List survey responses and views, filtered by survey, segment, tag, date, answers or contact traits',
	},
	'responses.store': {
		riskLevel: 'write',
		description:
			"Store a survey response for a user on an existing survey, to import history or feed a custom survey UI. Answers go in as top-level keys named by question identifier, such as { id: 'user-1', form_uuid, nps: 9, feedback: 'Fast setup' }",
	},
	'responses.tag': {
		riskLevel: 'write',
		description: 'Add tags to an existing survey response, up to 20',
	},
	'reporting.get': {
		riskLevel: 'read',
		description:
			'Compute an NPS, CSAT, ratings, distribution or count report over a date range and any filters',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts with their traits, segments and account, filtered by survey or segment',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Read one contact and everything on record for them by user ID, email or Refiner UUID',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a contact and all their survey responses; overwrite traits with users.identify instead when the responses must survive',
	},
	'forms.list': {
		riskLevel: 'read',
		description:
			'List surveys by state, optionally with their configuration and response and view counts',
	},
	'forms.publish': {
		riskLevel: 'write',
		description:
			'Publish a survey, or unpublish it with published: false so it stops collecting',
	},
	'forms.archive': {
		riskLevel: 'write',
		description:
			'Archive a survey; Refiner archives rather than deletes, and an archived survey still appears under all_with_archived',
	},
	'forms.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a survey into a new draft under a new name',
	},
	'forms.history': {
		riskLevel: 'read',
		description:
			'List the previous versions of a survey, each with its full configuration and question set',
	},
	'segments.list': {
		riskLevel: 'read',
		description:
			'List segments, reporting whether each is hand-curated or computed',
	},
	'segments.sync': {
		riskLevel: 'write',
		description:
			'Add a user to a manual segment, or remove them, creating the contact when no match exists',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof refinerEndpointsNested>;

export type BaseRefinerPlugin<T extends RefinerPluginOptions> = CorsairPlugin<
	'refiner',
	typeof RefinerSchema,
	typeof refinerEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRefinerPlugin = BaseRefinerPlugin<RefinerPluginOptions>;

export type ExternalRefinerPlugin<T extends RefinerPluginOptions> =
	BaseRefinerPlugin<T>;

export function refiner<const T extends RefinerPluginOptions>(
	incomingOptions: RefinerPluginOptions & T = {} as RefinerPluginOptions & T,
): ExternalRefinerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'refiner',
		schema: RefinerSchema,
		options: options,
		hooks: options.hooks,
		endpoints: refinerEndpointsNested,
		webhooks: {},
		endpointMeta: refinerEndpointMeta,
		endpointSchemas: refinerEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RefinerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('refiner', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRefinerPlugin;
}

export { RefinerAPIError } from './client';

export type {
	AccountGetResponse,
	ContactsDeleteInput,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	FormsDeleteInput,
	FormsDuplicateInput,
	FormsDuplicateResponse,
	FormsHistoryInput,
	FormsHistoryResponse,
	FormsListInput,
	FormsListResponse,
	FormsPublishInput,
	IdentifyInput,
	IdentifyResponse,
	MessageResponse,
	RefinerAccount,
	RefinerContact,
	RefinerEndpointInputs,
	RefinerEndpointOutputs,
	RefinerForm,
	RefinerPage,
	RefinerResponse,
	RefinerSegment,
	ReportingInput,
	ReportingResponse,
	ResponsesListInput,
	ResponsesListResponse,
	ResponsesStoreInput,
	ResponsesStoreResponse,
	ResponsesTagInput,
	SegmentsListInput,
	SegmentsListResponse,
	SegmentsSyncInput,
	SegmentsSyncResponse,
	TrackEventInput,
} from './endpoints/types';
