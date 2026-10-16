import type {
	AuthTypes,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Account, Alerts, SessionLaws, Statutes } from './endpoints';
import type {
	VaquillEndpointInputs,
	VaquillEndpointOutputs,
} from './endpoints/types';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VaquillSchema } from './schema';

export type VaquillPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalVaquillPlugin['hooks'];
	webhookHooks?: InternalVaquillPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vaquillEndpointsNested>;
};

export type VaquillContext = CorsairPluginContext<
	typeof VaquillSchema,
	VaquillPluginOptions
>;

export type VaquillKeyBuilderContext = KeyBuilderContext<VaquillPluginOptions>;

export type VaquillBoundEndpoints = BindEndpoints<
	typeof vaquillEndpointsNested
>;

type VaquillEndpoint<K extends keyof VaquillEndpointOutputs> = CorsairEndpoint<
	VaquillContext,
	VaquillEndpointInputs[K],
	VaquillEndpointOutputs[K]
>;

export type VaquillEndpoints = {
	search: VaquillEndpoint<'search'>;
	count: VaquillEndpoint<'count'>;
	coverage: VaquillEndpoint<'coverage'>;
	divisions: VaquillEndpoint<'divisions'>;
	resolve: VaquillEndpoint<'resolve'>;
	resolveCitation: VaquillEndpoint<'resolveCitation'>;
	section: VaquillEndpoint<'section'>;
	sections: VaquillEndpoint<'sections'>;
	sectionBody: VaquillEndpoint<'sectionBody'>;
	sectionChanges: VaquillEndpoint<'sectionChanges'>;
	sectionCitedBy: VaquillEndpoint<'sectionCitedBy'>;
	sectionCrossState: VaquillEndpoint<'sectionCrossState'>;
	sectionDefinitions: VaquillEndpoint<'sectionDefinitions'>;
	sectionRelated: VaquillEndpoint<'sectionRelated'>;
	enactments: VaquillEndpoint<'enactments'>;
	extractCitations: VaquillEndpoint<'extractCitations'>;
	sessionLawsChanges: VaquillEndpoint<'sessionLawsChanges'>;
	sessionLawsBatch: VaquillEndpoint<'sessionLawsBatch'>;
	sessionLawsSearch: VaquillEndpoint<'sessionLawsSearch'>;
	sessionLawsList: VaquillEndpoint<'sessionLawsList'>;
	sessionLawBody: VaquillEndpoint<'sessionLawBody'>;
	sessionLaw: VaquillEndpoint<'sessionLaw'>;
	boards: VaquillEndpoint<'boards'>;
	watchesList: VaquillEndpoint<'watchesList'>;
	watchesCreate: VaquillEndpoint<'watchesCreate'>;
	watchesTest: VaquillEndpoint<'watchesTest'>;
	watchesUpdate: VaquillEndpoint<'watchesUpdate'>;
	watchesDelete: VaquillEndpoint<'watchesDelete'>;
	watchChanges: VaquillEndpoint<'watchChanges'>;
	watchChangeDiff: VaquillEndpoint<'watchChangeDiff'>;
	watchDeliveries: VaquillEndpoint<'watchDeliveries'>;
	creditsBalance: VaquillEndpoint<'creditsBalance'>;
	creditsPricing: VaquillEndpoint<'creditsPricing'>;
};

export type VaquillWebhooks = Record<string, never>;

export type VaquillBoundWebhooks = Record<string, never>;

const vaquillEndpointsNested = {
	statutes: {
		search: Statutes.search,
		count: Statutes.count,
		coverage: Statutes.coverage,
		divisions: Statutes.divisions,
		resolve: Statutes.resolve,
		resolveCitation: Statutes.resolveCitation,
		section: Statutes.section,
		sections: Statutes.sections,
		sectionBody: Statutes.sectionBody,
		sectionChanges: Statutes.sectionChanges,
		sectionCitedBy: Statutes.sectionCitedBy,
		sectionCrossState: Statutes.sectionCrossState,
		sectionDefinitions: Statutes.sectionDefinitions,
		sectionRelated: Statutes.sectionRelated,
		enactments: Statutes.enactments,
		extractCitations: Statutes.extractCitations,
	},
	sessionLaws: {
		changes: SessionLaws.changes,
		batch: SessionLaws.batch,
		search: SessionLaws.search,
		list: SessionLaws.list,
		body: SessionLaws.body,
		get: SessionLaws.get,
	},
	alerts: {
		boards: Alerts.boards,
		watchesList: Alerts.watchesList,
		watchesCreate: Alerts.watchesCreate,
		watchesTest: Alerts.watchesTest,
		watchesUpdate: Alerts.watchesUpdate,
		watchesDelete: Alerts.watchesDelete,
		watchChanges: Alerts.watchChanges,
		watchChangeDiff: Alerts.watchChangeDiff,
		watchDeliveries: Alerts.watchDeliveries,
	},
	account: {
		creditsBalance: Account.creditsBalance,
		creditsPricing: Account.creditsPricing,
	},
} as const;

const vaquillWebhooksNested = {} as const;

export const vaquillEndpointSchemas = {
	'statutes.search': {
		input: VaquillEndpointInputSchemas.search,
		output: VaquillEndpointOutputSchemas.search,
	},
	'statutes.count': {
		input: VaquillEndpointInputSchemas.count,
		output: VaquillEndpointOutputSchemas.count,
	},
	'statutes.coverage': {
		input: VaquillEndpointInputSchemas.coverage,
		output: VaquillEndpointOutputSchemas.coverage,
	},
	'statutes.divisions': {
		input: VaquillEndpointInputSchemas.divisions,
		output: VaquillEndpointOutputSchemas.divisions,
	},
	'statutes.resolve': {
		input: VaquillEndpointInputSchemas.resolve,
		output: VaquillEndpointOutputSchemas.resolve,
	},
	'statutes.section': {
		input: VaquillEndpointInputSchemas.section,
		output: VaquillEndpointOutputSchemas.section,
	},
	'statutes.sections': {
		input: VaquillEndpointInputSchemas.sections,
		output: VaquillEndpointOutputSchemas.sections,
	},
	'statutes.sectionBody': {
		input: VaquillEndpointInputSchemas.sectionBody,
		output: VaquillEndpointOutputSchemas.sectionBody,
	},
	'statutes.sectionChanges': {
		input: VaquillEndpointInputSchemas.sectionChanges,
		output: VaquillEndpointOutputSchemas.sectionChanges,
	},
	'statutes.sectionCitedBy': {
		input: VaquillEndpointInputSchemas.sectionCitedBy,
		output: VaquillEndpointOutputSchemas.sectionCitedBy,
	},
	'statutes.sectionCrossState': {
		input: VaquillEndpointInputSchemas.sectionCrossState,
		output: VaquillEndpointOutputSchemas.sectionCrossState,
	},
	'statutes.sectionDefinitions': {
		input: VaquillEndpointInputSchemas.sectionDefinitions,
		output: VaquillEndpointOutputSchemas.sectionDefinitions,
	},
	'statutes.sectionRelated': {
		input: VaquillEndpointInputSchemas.sectionRelated,
		output: VaquillEndpointOutputSchemas.sectionRelated,
	},
	'statutes.resolveCitation': {
		input: VaquillEndpointInputSchemas.resolveCitation,
		output: VaquillEndpointOutputSchemas.resolveCitation,
	},
	'statutes.enactments': {
		input: VaquillEndpointInputSchemas.enactments,
		output: VaquillEndpointOutputSchemas.enactments,
	},
	'statutes.extractCitations': {
		input: VaquillEndpointInputSchemas.extractCitations,
		output: VaquillEndpointOutputSchemas.extractCitations,
	},
	'sessionLaws.changes': {
		input: VaquillEndpointInputSchemas.sessionLawsChanges,
		output: VaquillEndpointOutputSchemas.sessionLawsChanges,
	},
	'sessionLaws.batch': {
		input: VaquillEndpointInputSchemas.sessionLawsBatch,
		output: VaquillEndpointOutputSchemas.sessionLawsBatch,
	},
	'sessionLaws.search': {
		input: VaquillEndpointInputSchemas.sessionLawsSearch,
		output: VaquillEndpointOutputSchemas.sessionLawsSearch,
	},
	'sessionLaws.list': {
		input: VaquillEndpointInputSchemas.sessionLawsList,
		output: VaquillEndpointOutputSchemas.sessionLawsList,
	},
	'sessionLaws.body': {
		input: VaquillEndpointInputSchemas.sessionLawBody,
		output: VaquillEndpointOutputSchemas.sessionLawBody,
	},
	'sessionLaws.get': {
		input: VaquillEndpointInputSchemas.sessionLaw,
		output: VaquillEndpointOutputSchemas.sessionLaw,
	},
	'alerts.boards': {
		input: VaquillEndpointInputSchemas.boards,
		output: VaquillEndpointOutputSchemas.boards,
	},
	'alerts.watchesList': {
		input: VaquillEndpointInputSchemas.watchesList,
		output: VaquillEndpointOutputSchemas.watchesList,
	},
	'alerts.watchesCreate': {
		input: VaquillEndpointInputSchemas.watchesCreate,
		output: VaquillEndpointOutputSchemas.watchesCreate,
	},
	'alerts.watchesTest': {
		input: VaquillEndpointInputSchemas.watchesTest,
		output: VaquillEndpointOutputSchemas.watchesTest,
	},
	'alerts.watchesUpdate': {
		input: VaquillEndpointInputSchemas.watchesUpdate,
		output: VaquillEndpointOutputSchemas.watchesUpdate,
	},
	'alerts.watchesDelete': {
		input: VaquillEndpointInputSchemas.watchesDelete,
		output: VaquillEndpointOutputSchemas.watchesDelete,
	},
	'alerts.watchChanges': {
		input: VaquillEndpointInputSchemas.watchChanges,
		output: VaquillEndpointOutputSchemas.watchChanges,
	},
	'alerts.watchChangeDiff': {
		input: VaquillEndpointInputSchemas.watchChangeDiff,
		output: VaquillEndpointOutputSchemas.watchChangeDiff,
	},
	'alerts.watchDeliveries': {
		input: VaquillEndpointInputSchemas.watchDeliveries,
		output: VaquillEndpointOutputSchemas.watchDeliveries,
	},
	'account.creditsBalance': {
		input: VaquillEndpointInputSchemas.creditsBalance,
		output: VaquillEndpointOutputSchemas.creditsBalance,
	},
	'account.creditsPricing': {
		input: VaquillEndpointInputSchemas.creditsPricing,
		output: VaquillEndpointOutputSchemas.creditsPricing,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof vaquillEndpointsNested
>;

const vaquillWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof vaquillWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const vaquillEndpointMeta = {
	'statutes.search': {
		riskLevel: 'read',
		description: 'Search US statutes, regulations, court rules and guidance',
	},
	'statutes.count': {
		riskLevel: 'read',
		description: 'Count statute sections matching a scope',
	},
	'statutes.coverage': {
		riskLevel: 'read',
		description: 'List the covered corpora and jurisdictions',
	},
	'statutes.divisions': {
		riskLevel: 'read',
		description: 'Browse the statutory hierarchy of a corpus',
	},
	'statutes.resolve': {
		riskLevel: 'read',
		description: 'Resolve Bluebook citations to statute sections',
	},
	'statutes.section': {
		riskLevel: 'read',
		description: 'Get a statute section by id',
	},
	'statutes.sections': {
		riskLevel: 'read',
		description: 'Get statute sections in batch by ids',
	},
	'statutes.sectionBody': {
		riskLevel: 'read',
		description: "Get a section's full text",
	},
	'statutes.sectionChanges': {
		riskLevel: 'read',
		description: "Get a section's amendment history",
	},
	'statutes.sectionCitedBy': {
		riskLevel: 'read',
		description: 'Get sections citing this one',
	},
	'statutes.sectionCrossState': {
		riskLevel: 'read',
		description: 'Compare a provision across states',
	},
	'statutes.sectionDefinitions': {
		riskLevel: 'read',
		description: 'Get the defined terms governing a section',
	},
	'statutes.sectionRelated': {
		riskLevel: 'read',
		description: 'Get the neighbouring sections in statutory order',
	},
	'statutes.resolveCitation': {
		riskLevel: 'read',
		description: 'Resolve a single Bluebook citation to its section',
	},
	'statutes.enactments': {
		riskLevel: 'read',
		description: 'List the session-law enactments behind a section',
	},
	'statutes.extractCitations': {
		riskLevel: 'read',
		description: 'Find the citations in a text and optionally resolve each',
	},
	'sessionLaws.changes': {
		riskLevel: 'read',
		description: 'Feed of changes to the session-law registry',
	},
	'sessionLaws.batch': {
		riskLevel: 'read',
		description: 'Get many state session laws at once, by id or citation',
	},
	'sessionLaws.search': {
		riskLevel: 'read',
		description: 'Search the text of state session laws',
	},
	'sessionLaws.list': {
		riskLevel: 'read',
		description: "List a state's session laws",
	},
	'sessionLaws.body': {
		riskLevel: 'read',
		description: "Get a state session law's text",
	},
	'sessionLaws.get': {
		riskLevel: 'read',
		description: 'Get a state session law, by id or by citation',
	},
	'alerts.boards': {
		riskLevel: 'read',
		description: 'List watchable law-change boards',
	},
	'alerts.watchesList': {
		riskLevel: 'read',
		description: 'List your board watches',
	},
	'alerts.watchesCreate': {
		riskLevel: 'write',
		description: 'Create a board watch for law-change alerts',
	},
	'alerts.watchesTest': {
		riskLevel: 'write',
		description: 'Send a test delivery for a watch',
	},
	'alerts.watchesUpdate': {
		riskLevel: 'write',
		description: 'Update a board watch',
	},
	'alerts.watchesDelete': {
		riskLevel: 'destructive',
		description: 'Delete a board watch',
	},
	'alerts.watchChanges': {
		riskLevel: 'read',
		description: "List what changed on a watch's source",
	},
	'alerts.watchChangeDiff': {
		riskLevel: 'read',
		description: 'Old-vs-new text for one change',
	},
	'alerts.watchDeliveries': {
		riskLevel: 'read',
		description: 'List delivery history for a watch',
	},
	'account.creditsBalance': {
		riskLevel: 'read',
		description: 'Get your credit balance',
	},
	'account.creditsPricing': {
		riskLevel: 'read',
		description: 'Get API credit pricing',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof vaquillEndpointsNested>;

export const vaquillAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseVaquillPlugin<T extends VaquillPluginOptions> = CorsairPlugin<
	'vaquill',
	typeof VaquillSchema,
	typeof vaquillEndpointsNested,
	typeof vaquillWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalVaquillPlugin = BaseVaquillPlugin<VaquillPluginOptions>;

export type ExternalVaquillPlugin<T extends VaquillPluginOptions> =
	BaseVaquillPlugin<T>;

export function vaquill<const T extends VaquillPluginOptions>(
	// T is fixed by the caller's options type; the default only applies when
	// every option is omitted, where the empty object is the value.
	incomingOptions: VaquillPluginOptions & T = {} as VaquillPluginOptions & T,
): ExternalVaquillPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vaquill',
		authConfig: vaquillAuthConfig,
		schema: VaquillSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: vaquillEndpointsNested,
		webhooks: vaquillWebhooksNested,
		endpointMeta: vaquillEndpointMeta,
		endpointSchemas: vaquillEndpointSchemas,
		webhookSchemas: vaquillWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VaquillKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalVaquillPlugin;
}

export type {
	BoardsInput,
	BoardsResponse,
	CountInput,
	CountResponse,
	CoverageResponse,
	CreditsBalanceInput,
	CreditsBalanceResponse,
	CreditsPricingInput,
	CreditsPricingResponse,
	DivisionsInput,
	DivisionsResponse,
	EnactmentsInput,
	EnactmentsResponse,
	ExtractCitationsInput,
	ExtractCitationsResponse,
	ResolveCitationInput,
	ResolveCitationResponse,
	ResolveInput,
	ResolveResponse,
	SearchHit,
	SearchInput,
	SearchResponse,
	SectionBodyInput,
	SectionBodyResponse,
	SectionChangesInput,
	SectionChangesResponse,
	SectionCitedByInput,
	SectionCitedByResponse,
	SectionCrossStateInput,
	SectionCrossStateResponse,
	SectionDefinitionsInput,
	SectionDefinitionsResponse,
	SectionInput,
	SectionRelatedInput,
	SectionRelatedResponse,
	SectionResponse,
	SectionsInput,
	SectionsResponse,
	SessionLaw,
	SessionLawBodyInput,
	SessionLawBodyResponse,
	SessionLawInput,
	SessionLawResponse,
	SessionLawsBatchInput,
	SessionLawsBatchResponse,
	SessionLawsChangesInput,
	SessionLawsChangesResponse,
	SessionLawsListInput,
	SessionLawsListResponse,
	SessionLawsSearchInput,
	SessionLawsSearchResponse,
	StatuteSection,
	VaquillEndpointInputs,
	VaquillEndpointOutputs,
	WatchChangeDiffInput,
	WatchChangeDiffResponse,
	WatchChangesInput,
	WatchChangesResponse,
	WatchDeliveriesInput,
	WatchDeliveriesResponse,
	WatchesCreateInput,
	WatchesCreateResponse,
	WatchesDeleteInput,
	WatchesDeleteResponse,
	WatchesListInput,
	WatchesListResponse,
	WatchesTestInput,
	WatchesTestResponse,
	WatchesUpdateInput,
	WatchesUpdateResponse,
} from './endpoints/types';
