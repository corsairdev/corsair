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
	Campaigns,
	Companies,
	Customers,
	Feedback,
	Outbox,
	Reports,
	Survey,
	Templates,
} from './endpoints';
import type {
	RetentlyEndpointInputs,
	RetentlyEndpointOutputs,
} from './endpoints/types';
import {
	RetentlyEndpointInputSchemas,
	RetentlyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RetentlySchema } from './schema';

export type RetentlyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRetentlyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof retentlyEndpointsNested>;
};

export type RetentlyContext = CorsairPluginContext<
	typeof RetentlySchema,
	RetentlyPluginOptions
>;

export type RetentlyKeyBuilderContext =
	KeyBuilderContext<RetentlyPluginOptions>;

export type RetentlyBoundEndpoints = BindEndpoints<
	typeof retentlyEndpointsNested
>;

type RetentlyEndpoint<K extends keyof RetentlyEndpointOutputs> =
	CorsairEndpoint<
		RetentlyContext,
		RetentlyEndpointInputs[K],
		RetentlyEndpointOutputs[K]
	>;

export type RetentlyEndpoints = {
	accountPing: RetentlyEndpoint<'accountPing'>;
	customersList: RetentlyEndpoint<'customersList'>;
	customersGet: RetentlyEndpoint<'customersGet'>;
	customersUpsert: RetentlyEndpoint<'customersUpsert'>;
	customersUnsubscribe: RetentlyEndpoint<'customersUnsubscribe'>;
	customersResubscribe: RetentlyEndpoint<'customersResubscribe'>;
	customersDelete: RetentlyEndpoint<'customersDelete'>;
	companiesList: RetentlyEndpoint<'companiesList'>;
	companiesGet: RetentlyEndpoint<'companiesGet'>;
	feedbackList: RetentlyEndpoint<'feedbackList'>;
	feedbackGet: RetentlyEndpoint<'feedbackGet'>;
	feedbackImport: RetentlyEndpoint<'feedbackImport'>;
	campaignsList: RetentlyEndpoint<'campaignsList'>;
	reportsGet: RetentlyEndpoint<'reportsGet'>;
	outboxList: RetentlyEndpoint<'outboxList'>;
	templatesList: RetentlyEndpoint<'templatesList'>;
	templatesGet: RetentlyEndpoint<'templatesGet'>;
	surveySend: RetentlyEndpoint<'surveySend'>;
};

const retentlyEndpointsNested = {
	account: {
		ping: Account.ping,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		upsert: Customers.upsert,
		unsubscribe: Customers.unsubscribe,
		resubscribe: Customers.resubscribe,
		delete: Customers.remove,
	},
	companies: {
		list: Companies.list,
		get: Companies.get,
	},
	feedback: {
		list: Feedback.list,
		get: Feedback.get,
		import: Feedback.importFeedback,
	},
	campaigns: {
		list: Campaigns.list,
	},
	reports: {
		get: Reports.get,
	},
	outbox: {
		list: Outbox.list,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
	},
	survey: {
		send: Survey.send,
	},
} as const;

export const retentlyEndpointSchemas = {
	'account.ping': {
		input: RetentlyEndpointInputSchemas.accountPing,
		output: RetentlyEndpointOutputSchemas.accountPing,
	},
	'customers.list': {
		input: RetentlyEndpointInputSchemas.customersList,
		output: RetentlyEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: RetentlyEndpointInputSchemas.customersGet,
		output: RetentlyEndpointOutputSchemas.customersGet,
	},
	'customers.upsert': {
		input: RetentlyEndpointInputSchemas.customersUpsert,
		output: RetentlyEndpointOutputSchemas.customersUpsert,
	},
	'customers.unsubscribe': {
		input: RetentlyEndpointInputSchemas.customersUnsubscribe,
		output: RetentlyEndpointOutputSchemas.customersUnsubscribe,
	},
	'customers.resubscribe': {
		input: RetentlyEndpointInputSchemas.customersResubscribe,
		output: RetentlyEndpointOutputSchemas.customersResubscribe,
	},
	'customers.delete': {
		input: RetentlyEndpointInputSchemas.customersDelete,
		output: RetentlyEndpointOutputSchemas.customersDelete,
	},
	'companies.list': {
		input: RetentlyEndpointInputSchemas.companiesList,
		output: RetentlyEndpointOutputSchemas.companiesList,
	},
	'companies.get': {
		input: RetentlyEndpointInputSchemas.companiesGet,
		output: RetentlyEndpointOutputSchemas.companiesGet,
	},
	'feedback.list': {
		input: RetentlyEndpointInputSchemas.feedbackList,
		output: RetentlyEndpointOutputSchemas.feedbackList,
	},
	'feedback.get': {
		input: RetentlyEndpointInputSchemas.feedbackGet,
		output: RetentlyEndpointOutputSchemas.feedbackGet,
	},
	'feedback.import': {
		input: RetentlyEndpointInputSchemas.feedbackImport,
		output: RetentlyEndpointOutputSchemas.feedbackImport,
	},
	'campaigns.list': {
		input: RetentlyEndpointInputSchemas.campaignsList,
		output: RetentlyEndpointOutputSchemas.campaignsList,
	},
	'reports.get': {
		input: RetentlyEndpointInputSchemas.reportsGet,
		output: RetentlyEndpointOutputSchemas.reportsGet,
	},
	'outbox.list': {
		input: RetentlyEndpointInputSchemas.outboxList,
		output: RetentlyEndpointOutputSchemas.outboxList,
	},
	'templates.list': {
		input: RetentlyEndpointInputSchemas.templatesList,
		output: RetentlyEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: RetentlyEndpointInputSchemas.templatesGet,
		output: RetentlyEndpointOutputSchemas.templatesGet,
	},
	'survey.send': {
		input: RetentlyEndpointInputSchemas.surveySend,
		output: RetentlyEndpointOutputSchemas.surveySend,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof retentlyEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const retentlyEndpointMeta = {
	'account.ping': {
		riskLevel: 'read',
		description:
			'Read the account identity, plan, remaining survey credits and usage counters in one call',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers with paging, sorting, a creation-date window, an email lookup and property filters',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Get one customer by ID, including tags, custom properties, queue state and last survey',
	},
	'customers.upsert': {
		riskLevel: 'write',
		description:
			'Create or update up to 1,000 customers in one call, setting tags and custom properties',
	},
	'customers.unsubscribe': {
		riskLevel: 'write',
		description:
			'Unsubscribe customers from future surveys, optionally recording a custom opt-out message',
	},
	'customers.resubscribe': {
		riskLevel: 'write',
		description:
			'Resubscribe previously unsubscribed customers; self-unsubscribed and bounced contacts are skipped',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete customers and all their associated data, identified by email address',
	},
	'companies.list': {
		riskLevel: 'read',
		description:
			'List companies with their domain, industry, tags, CX metrics and contact count',
	},
	'companies.get': {
		riskLevel: 'read',
		description:
			'Get one company by ID or domain, including its NPS, CSAT, CES and STAR scores',
	},
	'feedback.list': {
		riskLevel: 'read',
		description:
			'List survey responses with scores, comments, topics, tags and answers, filtered by customer, campaign, date or property',
	},
	'feedback.get': {
		riskLevel: 'read',
		description: 'Get one survey response by feedback ID',
	},
	'feedback.import': {
		riskLevel: 'write',
		description:
			'Import up to 200 historical survey responses into a campaign, with scores, comments, topics and additional answers',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List survey campaigns with their metric, template, channel, type and active state',
	},
	'reports.get': {
		riskLevel: 'read',
		description:
			'Read campaign reports with score trend, delivery stats and per-question stats, for one campaign or all',
	},
	'outbox.list': {
		riskLevel: 'read',
		description:
			'List sent surveys with their channel, sender, status and opened/responded detail, filtered by customer, campaign or date',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List survey templates with their channel and metric',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			'Get one survey template with its questions and their UUIDs, which feedback.import needs',
	},
	'survey.send': {
		riskLevel: 'write',
		description:
			'Queue a transactional survey to up to 100 customers through a transactional campaign, optionally delayed',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof retentlyEndpointsNested>;

export type BaseRetentlyPlugin<T extends RetentlyPluginOptions> = CorsairPlugin<
	'retently',
	typeof RetentlySchema,
	typeof retentlyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRetentlyPlugin = BaseRetentlyPlugin<RetentlyPluginOptions>;

export type ExternalRetentlyPlugin<T extends RetentlyPluginOptions> =
	BaseRetentlyPlugin<T>;

export function retently<const T extends RetentlyPluginOptions>(
	incomingOptions: RetentlyPluginOptions & T = {} as RetentlyPluginOptions & T,
): ExternalRetentlyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'retently',
		schema: RetentlySchema,
		options: options,
		hooks: options.hooks,
		endpoints: retentlyEndpointsNested,
		webhooks: {},
		endpointMeta: retentlyEndpointMeta,
		endpointSchemas: retentlyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RetentlyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('retently', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRetentlyPlugin;
}

export { RetentlyAPIError } from './client';

export type {
	AccountPingResponse,
	CampaignsListResponse,
	CompaniesGetResponse,
	CompaniesListResponse,
	CustomersDeleteInput,
	CustomersDeleteResponse,
	CustomersGetInput,
	CustomersGetResponse,
	CustomersListInput,
	CustomersListResponse,
	CustomersResubscribeInput,
	CustomersResubscribeResponse,
	CustomersUnsubscribeInput,
	CustomersUnsubscribeResponse,
	CustomersUpsertInput,
	CustomersUpsertResponse,
	FeedbackGetInput,
	FeedbackGetResponse,
	FeedbackImportInput,
	FeedbackImportResponse,
	FeedbackListInput,
	FeedbackListResponse,
	OutboxListInput,
	OutboxListResponse,
	ReportsGetInput,
	ReportsGetResponse,
	RetentlyAttribute,
	RetentlyCampaign,
	RetentlyCampaignReport,
	RetentlyCompany,
	RetentlyCustomer,
	RetentlyEndpointInputs,
	RetentlyEndpointOutputs,
	RetentlyFeedbackResponse,
	RetentlyImportFeedbackItem,
	RetentlyProperty,
	RetentlySubscriber,
	RetentlySurvey,
	RetentlyTemplate,
	RetentlyTemplateDetail,
	SurveySendInput,
	SurveySendResponse,
	TemplatesGetInput,
	TemplatesGetResponse,
	TemplatesListResponse,
} from './endpoints/types';
