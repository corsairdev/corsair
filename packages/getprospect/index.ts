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
import { GetProspectOperations } from './endpoints/operations';
import type {
	GetProspectEndpointInputs,
	GetProspectEndpointOutputs,
	GetProspectOperationId,
} from './endpoints/types';
import {
	GetProspectEndpointInputSchemas,
	GetProspectEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GetProspectSchema } from './schema';

export type GetProspectPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGetProspectPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof GetProspectOperations>;
};

export type GetProspectContext = CorsairPluginContext<
	typeof GetProspectSchema,
	GetProspectPluginOptions
>;
export type GetProspectKeyBuilderContext =
	KeyBuilderContext<GetProspectPluginOptions>;
export type GetProspectBoundEndpoints = BindEndpoints<
	typeof GetProspectOperations
>;
export type GetProspectEndpoints = typeof GetProspectOperations;

export const getprospectEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof GetProspectOperations
> = {
	'people.get': {
		input: GetProspectEndpointInputSchemas.people.get,
		output: GetProspectEndpointOutputSchemas.people.get,
	},
	'people.editsUpdate': {
		input: GetProspectEndpointInputSchemas.people.editsUpdate,
		output: GetProspectEndpointOutputSchemas.people.editsUpdate,
	},
	'people.bulkEnrich': {
		input: GetProspectEndpointInputSchemas.people.bulkEnrich,
		output: GetProspectEndpointOutputSchemas.people.bulkEnrich,
	},
	'people.calculateCredits': {
		input: GetProspectEndpointInputSchemas.people.calculateCredits,
		output: GetProspectEndpointOutputSchemas.people.calculateCredits,
	},
	'people.count': {
		input: GetProspectEndpointInputSchemas.people.count,
		output: GetProspectEndpointOutputSchemas.people.count,
	},
	'people.enrich': {
		input: GetProspectEndpointInputSchemas.people.enrich,
		output: GetProspectEndpointOutputSchemas.people.enrich,
	},
	'people.enrichSearch': {
		input: GetProspectEndpointInputSchemas.people.enrichSearch,
		output: GetProspectEndpointOutputSchemas.people.enrichSearch,
	},
	'people.save': {
		input: GetProspectEndpointInputSchemas.people.save,
		output: GetProspectEndpointOutputSchemas.people.save,
	},
	'people.saveSearch': {
		input: GetProspectEndpointInputSchemas.people.saveSearch,
		output: GetProspectEndpointOutputSchemas.people.saveSearch,
	},
	'people.search': {
		input: GetProspectEndpointInputSchemas.people.search,
		output: GetProspectEndpointOutputSchemas.people.search,
	},
	'companies.get': {
		input: GetProspectEndpointInputSchemas.companies.get,
		output: GetProspectEndpointOutputSchemas.companies.get,
	},
	'companies.editsUpdate': {
		input: GetProspectEndpointInputSchemas.companies.editsUpdate,
		output: GetProspectEndpointOutputSchemas.companies.editsUpdate,
	},
	'companies.bulkEnrich': {
		input: GetProspectEndpointInputSchemas.companies.bulkEnrich,
		output: GetProspectEndpointOutputSchemas.companies.bulkEnrich,
	},
	'companies.enrich': {
		input: GetProspectEndpointInputSchemas.companies.enrich,
		output: GetProspectEndpointOutputSchemas.companies.enrich,
	},
	'companies.save': {
		input: GetProspectEndpointInputSchemas.companies.save,
		output: GetProspectEndpointOutputSchemas.companies.save,
	},
	'companies.search': {
		input: GetProspectEndpointInputSchemas.companies.search,
		output: GetProspectEndpointOutputSchemas.companies.search,
	},
	'email.findGet': {
		input: GetProspectEndpointInputSchemas.email.findGet,
		output: GetProspectEndpointOutputSchemas.email.findGet,
	},
	'email.verificationsList': {
		input: GetProspectEndpointInputSchemas.email.verificationsList,
		output: GetProspectEndpointOutputSchemas.email.verificationsList,
	},
	'email.verificationsCreate': {
		input: GetProspectEndpointInputSchemas.email.verificationsCreate,
		output: GetProspectEndpointOutputSchemas.email.verificationsCreate,
	},
	'email.verificationsGet': {
		input: GetProspectEndpointInputSchemas.email.verificationsGet,
		output: GetProspectEndpointOutputSchemas.email.verificationsGet,
	},
	'email.verificationsCancel': {
		input: GetProspectEndpointInputSchemas.email.verificationsCancel,
		output: GetProspectEndpointOutputSchemas.email.verificationsCancel,
	},
	'email.verificationsResults': {
		input: GetProspectEndpointInputSchemas.email.verificationsResults,
		output: GetProspectEndpointOutputSchemas.email.verificationsResults,
	},
	'email.verificationsStart': {
		input: GetProspectEndpointInputSchemas.email.verificationsStart,
		output: GetProspectEndpointOutputSchemas.email.verificationsStart,
	},
	'email.verificationsHistoryList': {
		input: GetProspectEndpointInputSchemas.email.verificationsHistoryList,
		output: GetProspectEndpointOutputSchemas.email.verificationsHistoryList,
	},
	'email.verificationsInspect': {
		input: GetProspectEndpointInputSchemas.email.verificationsInspect,
		output: GetProspectEndpointOutputSchemas.email.verificationsInspect,
	},
	'email.verifyGet': {
		input: GetProspectEndpointInputSchemas.email.verifyGet,
		output: GetProspectEndpointOutputSchemas.email.verifyGet,
	},
	'email.find': {
		input: GetProspectEndpointInputSchemas.email.find,
		output: GetProspectEndpointOutputSchemas.email.find,
	},
	'email.verify': {
		input: GetProspectEndpointInputSchemas.email.verify,
		output: GetProspectEndpointOutputSchemas.email.verify,
	},
	'search.matchingTitles': {
		input: GetProspectEndpointInputSchemas.search.matchingTitles,
		output: GetProspectEndpointOutputSchemas.search.matchingTitles,
	},
	'search.smartJobTitles': {
		input: GetProspectEndpointInputSchemas.search.smartJobTitles,
		output: GetProspectEndpointOutputSchemas.search.smartJobTitles,
	},
	'search.suggest': {
		input: GetProspectEndpointInputSchemas.search.suggest,
		output: GetProspectEndpointOutputSchemas.search.suggest,
	},
	'enums.list': {
		input: GetProspectEndpointInputSchemas.enums.list,
		output: GetProspectEndpointOutputSchemas.enums.list,
	},
	'enums.get': {
		input: GetProspectEndpointInputSchemas.enums.get,
		output: GetProspectEndpointOutputSchemas.enums.get,
	},
	'developer.apiLogsList': {
		input: GetProspectEndpointInputSchemas.developer.apiLogsList,
		output: GetProspectEndpointOutputSchemas.developer.apiLogsList,
	},
	'developer.rateLimitsGet': {
		input: GetProspectEndpointInputSchemas.developer.rateLimitsGet,
		output: GetProspectEndpointOutputSchemas.developer.rateLimitsGet,
	},
	'lists.companiesListsRemove': {
		input: GetProspectEndpointInputSchemas.lists.companiesListsRemove,
		output: GetProspectEndpointOutputSchemas.lists.companiesListsRemove,
	},
	'lists.companiesListsSet': {
		input: GetProspectEndpointInputSchemas.lists.companiesListsSet,
		output: GetProspectEndpointOutputSchemas.lists.companiesListsSet,
	},
	'lists.list': {
		input: GetProspectEndpointInputSchemas.lists.list,
		output: GetProspectEndpointOutputSchemas.lists.list,
	},
	'lists.create': {
		input: GetProspectEndpointInputSchemas.lists.create,
		output: GetProspectEndpointOutputSchemas.lists.create,
	},
	'lists.get': {
		input: GetProspectEndpointInputSchemas.lists.get,
		output: GetProspectEndpointOutputSchemas.lists.get,
	},
	'lists.delete': {
		input: GetProspectEndpointInputSchemas.lists.delete,
		output: GetProspectEndpointOutputSchemas.lists.delete,
	},
	'lists.update': {
		input: GetProspectEndpointInputSchemas.lists.update,
		output: GetProspectEndpointOutputSchemas.lists.update,
	},
	'lists.peopleListsAdd': {
		input: GetProspectEndpointInputSchemas.lists.peopleListsAdd,
		output: GetProspectEndpointOutputSchemas.lists.peopleListsAdd,
	},
	'lists.peopleListsRemove': {
		input: GetProspectEndpointInputSchemas.lists.peopleListsRemove,
		output: GetProspectEndpointOutputSchemas.lists.peopleListsRemove,
	},
	'lists.peopleListsSet': {
		input: GetProspectEndpointInputSchemas.lists.peopleListsSet,
		output: GetProspectEndpointOutputSchemas.lists.peopleListsSet,
	},
	'exports.companiesExport': {
		input: GetProspectEndpointInputSchemas.exports.companiesExport,
		output: GetProspectEndpointOutputSchemas.exports.companiesExport,
	},
	'exports.get': {
		input: GetProspectEndpointInputSchemas.exports.get,
		output: GetProspectEndpointOutputSchemas.exports.get,
	},
	'exports.peopleExport': {
		input: GetProspectEndpointInputSchemas.exports.peopleExport,
		output: GetProspectEndpointOutputSchemas.exports.peopleExport,
	},
	'jobs.get': {
		input: GetProspectEndpointInputSchemas.jobs.get,
		output: GetProspectEndpointOutputSchemas.jobs.get,
	},
	'enrichments.companiesEnrichmentsCreate': {
		input:
			GetProspectEndpointInputSchemas.enrichments.companiesEnrichmentsCreate,
		output:
			GetProspectEndpointOutputSchemas.enrichments.companiesEnrichmentsCreate,
	},
	'enrichments.list': {
		input: GetProspectEndpointInputSchemas.enrichments.list,
		output: GetProspectEndpointOutputSchemas.enrichments.list,
	},
	'enrichments.get': {
		input: GetProspectEndpointInputSchemas.enrichments.get,
		output: GetProspectEndpointOutputSchemas.enrichments.get,
	},
	'enrichments.cancel': {
		input: GetProspectEndpointInputSchemas.enrichments.cancel,
		output: GetProspectEndpointOutputSchemas.enrichments.cancel,
	},
	'enrichments.results': {
		input: GetProspectEndpointInputSchemas.enrichments.results,
		output: GetProspectEndpointOutputSchemas.enrichments.results,
	},
	'enrichments.peopleEnrichmentsCreate': {
		input: GetProspectEndpointInputSchemas.enrichments.peopleEnrichmentsCreate,
		output:
			GetProspectEndpointOutputSchemas.enrichments.peopleEnrichmentsCreate,
	},
	'trash.list': {
		input: GetProspectEndpointInputSchemas.trash.list,
		output: GetProspectEndpointOutputSchemas.trash.list,
	},
	'trash.companiesAdd': {
		input: GetProspectEndpointInputSchemas.trash.companiesAdd,
		output: GetProspectEndpointOutputSchemas.trash.companiesAdd,
	},
	'trash.peopleAdd': {
		input: GetProspectEndpointInputSchemas.trash.peopleAdd,
		output: GetProspectEndpointOutputSchemas.trash.peopleAdd,
	},
	'trash.restore': {
		input: GetProspectEndpointInputSchemas.trash.restore,
		output: GetProspectEndpointOutputSchemas.trash.restore,
	},
	'account.meGet': {
		input: GetProspectEndpointInputSchemas.account.meGet,
		output: GetProspectEndpointOutputSchemas.account.meGet,
	},
	'billing.subscriptionGet': {
		input: GetProspectEndpointInputSchemas.billing.subscriptionGet,
		output: GetProspectEndpointOutputSchemas.billing.subscriptionGet,
	},
	'billing.creditsGet': {
		input: GetProspectEndpointInputSchemas.billing.creditsGet,
		output: GetProspectEndpointOutputSchemas.billing.creditsGet,
	},
	'billing.usageSummaryGet': {
		input: GetProspectEndpointInputSchemas.billing.usageSummaryGet,
		output: GetProspectEndpointOutputSchemas.billing.usageSummaryGet,
	},
	'blocklist.companiesList': {
		input: GetProspectEndpointInputSchemas.blocklist.companiesList,
		output: GetProspectEndpointOutputSchemas.blocklist.companiesList,
	},
	'blocklist.companiesDelete': {
		input: GetProspectEndpointInputSchemas.blocklist.companiesDelete,
		output: GetProspectEndpointOutputSchemas.blocklist.companiesDelete,
	},
	'blocklist.companiesAdd': {
		input: GetProspectEndpointInputSchemas.blocklist.companiesAdd,
		output: GetProspectEndpointOutputSchemas.blocklist.companiesAdd,
	},
	'blocklist.peopleList': {
		input: GetProspectEndpointInputSchemas.blocklist.peopleList,
		output: GetProspectEndpointOutputSchemas.blocklist.peopleList,
	},
	'blocklist.peopleDelete': {
		input: GetProspectEndpointInputSchemas.blocklist.peopleDelete,
		output: GetProspectEndpointOutputSchemas.blocklist.peopleDelete,
	},
	'blocklist.peopleAdd': {
		input: GetProspectEndpointInputSchemas.blocklist.peopleAdd,
		output: GetProspectEndpointOutputSchemas.blocklist.peopleAdd,
	},
	'notifications.list': {
		input: GetProspectEndpointInputSchemas.notifications.list,
		output: GetProspectEndpointOutputSchemas.notifications.list,
	},
	'notifications.markRead': {
		input: GetProspectEndpointInputSchemas.notifications.markRead,
		output: GetProspectEndpointOutputSchemas.notifications.markRead,
	},
} satisfies RequiredPluginEndpointSchemas<typeof GetProspectOperations>;

export const getprospectEndpointMeta: RequiredPluginEndpointMeta<
	typeof GetProspectOperations
> = {
	'people.get': {
		riskLevel: 'read',
		description: 'Get a Person. Credit cost: none.',
	},
	'people.editsUpdate': {
		riskLevel: 'write',
		description: 'Edit a Saved Person. Credit cost: none.',
	},
	'people.bulkEnrich': {
		riskLevel: 'destructive',
		description:
			'People Bulk Enrich. Credit cost: newly revealed email; phone number found (enrich_email (on by default) / enrich_phone, per item).',
	},
	'people.calculateCredits': {
		riskLevel: 'read',
		description: 'Preview Save Credits. Credit cost: none.',
	},
	'people.count': {
		riskLevel: 'read',
		description: 'People Count. Credit cost: none.',
	},
	'people.enrich': {
		riskLevel: 'destructive',
		description:
			'People Enrich. Credit cost: newly revealed email; phone number found (enrich_email (on by default) / enrich_phone).',
	},
	'people.enrichSearch': {
		riskLevel: 'destructive',
		description:
			'Enrich Mobiles for a Search. Credit cost: phone number found (always, until the balance runs out).',
	},
	'people.save': {
		riskLevel: 'destructive',
		description:
			'Save People. Credit cost: person whose valid email is handed over and was not already owned (always; a re-save of a person already paid for is free. A person answered `searching` costs nothing until the refreshed search finds an email and the balance allows it).',
	},
	'people.saveSearch': {
		riskLevel: 'destructive',
		description:
			'Save a Whole Search. Credit cost: person whose stored valid email is handed over and was not already owned (always, in search order, until the balance runs out).',
	},
	'people.search': {
		riskLevel: 'destructive',
		description:
			'People Search. Credit cost: newly revealed email; phone number found (only with enrich_email / enrich_phone).',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Companies Get. Credit cost: none.',
	},
	'companies.editsUpdate': {
		riskLevel: 'write',
		description: 'Edit Saved Company. Credit cost: none.',
	},
	'companies.bulkEnrich': {
		riskLevel: 'read',
		description: 'Companies Bulk Enrich. Credit cost: none.',
	},
	'companies.enrich': {
		riskLevel: 'read',
		description: 'Companies Enrich. Credit cost: none.',
	},
	'companies.save': {
		riskLevel: 'write',
		description: 'Companies Save. Credit cost: none.',
	},
	'companies.search': {
		riskLevel: 'read',
		description: 'Companies Search. Credit cost: none.',
	},
	'email.findGet': {
		riskLevel: 'destructive',
		description:
			'Find Email (GET). Credit cost: served_address (a valid address is served that the workspace does not already own (the email of a revealed or saved person, and an address charged before, are free)).',
	},
	'email.verificationsList': {
		riskLevel: 'read',
		description: 'List Email Verifications. Credit cost: none.',
	},
	'email.verificationsCreate': {
		riskLevel: 'destructive',
		description:
			'Create Email Verification. Credit cost: billable_row (when a `data.emails` job starts on its own after counting, for `counts.billable`; `unknown` rows and rows never verified are refunded when the job ends (a `file_key` job charges at `email_verifications_start`)).',
	},
	'email.verificationsGet': {
		riskLevel: 'read',
		description: 'Get Email Verification. Credit cost: none.',
	},
	'email.verificationsCancel': {
		riskLevel: 'destructive',
		description: 'Cancel Email Verification. Credit cost: none.',
	},
	'email.verificationsResults': {
		riskLevel: 'read',
		description: 'Get Email Verification Results. Credit cost: none.',
	},
	'email.verificationsStart': {
		riskLevel: 'destructive',
		description:
			'Start Email Verification. Credit cost: billable_row (at start, for `counts.billable`; `unknown` rows and rows never verified are refunded when the job ends).',
	},
	'email.verificationsHistoryList': {
		riskLevel: 'read',
		description: 'List Verification History. Credit cost: none.',
	},
	'email.verificationsInspect': {
		riskLevel: 'read',
		description: 'Inspect Email File. Credit cost: none.',
	},
	'email.verifyGet': {
		riskLevel: 'destructive',
		description:
			'Verify Email (GET). Credit cost: address (a valid, invalid or accept_all verdict, once per address per workspace).',
	},
	'email.find': {
		riskLevel: 'destructive',
		description:
			'Find Email. Credit cost: served_address (a valid address is served that the workspace does not already own (the email of a revealed or saved person, and an address charged before, are free)).',
	},
	'email.verify': {
		riskLevel: 'destructive',
		description:
			'Verify Email. Credit cost: address (a valid, invalid or accept_all verdict, once per address per workspace).',
	},
	'search.matchingTitles': {
		riskLevel: 'read',
		description: 'Matching Job Titles. Credit cost: none.',
	},
	'search.smartJobTitles': {
		riskLevel: 'read',
		description: 'Smart Job Titles. Credit cost: none.',
	},
	'search.suggest': {
		riskLevel: 'read',
		description: 'Search Suggestions. Credit cost: none.',
	},
	'enums.list': {
		riskLevel: 'read',
		description: 'List Filter Enums. Credit cost: none.',
	},
	'enums.get': {
		riskLevel: 'read',
		description: 'Get Filter Enum. Credit cost: none.',
	},
	'developer.apiLogsList': {
		riskLevel: 'read',
		description: 'List Request Logs. Credit cost: none.',
	},
	'developer.rateLimitsGet': {
		riskLevel: 'read',
		description: 'Get Rate Limits. Credit cost: none.',
	},
	'lists.companiesListsRemove': {
		riskLevel: 'write',
		description: 'Remove Companies from List. Credit cost: none.',
	},
	'lists.companiesListsSet': {
		riskLevel: 'destructive',
		description: 'Set Company Lists. Credit cost: none.',
	},
	'lists.list': {
		riskLevel: 'read',
		description: 'List Lists. Credit cost: none.',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create List. Credit cost: none.',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Get List. Credit cost: none.',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete List. Credit cost: none.',
	},
	'lists.update': {
		riskLevel: 'write',
		description: 'Rename List. Credit cost: none.',
	},
	'lists.peopleListsAdd': {
		riskLevel: 'write',
		description: 'Add People to List. Credit cost: none.',
	},
	'lists.peopleListsRemove': {
		riskLevel: 'write',
		description: 'Remove People from List. Credit cost: none.',
	},
	'lists.peopleListsSet': {
		riskLevel: 'destructive',
		description: 'Set People Lists. Credit cost: none.',
	},
	'exports.companiesExport': {
		riskLevel: 'write',
		description: 'Export Companies. Credit cost: none.',
	},
	'exports.get': {
		riskLevel: 'read',
		description: 'Get an Export. Credit cost: none.',
	},
	'exports.peopleExport': {
		riskLevel: 'destructive',
		description:
			'Export People. Credit cost: revealed profile not already owned (per chunk during the run, against the balance read at that chunk; emails past it are withheld).',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Get a Job. Credit cost: none.',
	},
	'enrichments.companiesEnrichmentsCreate': {
		riskLevel: 'write',
		description: 'Create Companies Enrichment. Credit cost: none.',
	},
	'enrichments.list': {
		riskLevel: 'read',
		description: 'List Enrichments. Credit cost: none.',
	},
	'enrichments.get': {
		riskLevel: 'read',
		description: 'Get Enrichment. Credit cost: none.',
	},
	'enrichments.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel Enrichment. Credit cost: none.',
	},
	'enrichments.results': {
		riskLevel: 'read',
		description: 'Get Enrichment Results. Credit cost: none.',
	},
	'enrichments.peopleEnrichmentsCreate': {
		riskLevel: 'destructive',
		description:
			'Create People Enrichment. Credit cost: revealed profile not already owned / address found / mobile number found (during the job).',
	},
	'trash.list': {
		riskLevel: 'read',
		description: 'List Trash. Credit cost: none.',
	},
	'trash.companiesAdd': {
		riskLevel: 'destructive',
		description: 'Delete Companies to Trash. Credit cost: none.',
	},
	'trash.peopleAdd': {
		riskLevel: 'destructive',
		description: 'Delete People to Trash. Credit cost: none.',
	},
	'trash.restore': {
		riskLevel: 'write',
		description: 'Restore from Trash. Credit cost: none.',
	},
	'account.meGet': {
		riskLevel: 'read',
		description: 'Get Current User. Credit cost: none.',
	},
	'billing.subscriptionGet': {
		riskLevel: 'read',
		description: 'Get Subscription. Credit cost: none.',
	},
	'billing.creditsGet': {
		riskLevel: 'read',
		description: 'Get Credit Balances. Credit cost: none.',
	},
	'billing.usageSummaryGet': {
		riskLevel: 'read',
		description: 'Get Usage Summary. Credit cost: none.',
	},
	'blocklist.companiesList': {
		riskLevel: 'read',
		description: 'List Blocked Companies. Credit cost: none.',
	},
	'blocklist.companiesDelete': {
		riskLevel: 'destructive',
		description: 'Unblock Company. Credit cost: none.',
	},
	'blocklist.companiesAdd': {
		riskLevel: 'write',
		description: 'Block Companies. Credit cost: none.',
	},
	'blocklist.peopleList': {
		riskLevel: 'read',
		description: 'List Blocked People. Credit cost: none.',
	},
	'blocklist.peopleDelete': {
		riskLevel: 'destructive',
		description: 'Unblock Person. Credit cost: none.',
	},
	'blocklist.peopleAdd': {
		riskLevel: 'write',
		description: 'Block People. Credit cost: none.',
	},
	'notifications.list': {
		riskLevel: 'read',
		description: 'List Notifications. Credit cost: none.',
	},
	'notifications.markRead': {
		riskLevel: 'write',
		description: 'Mark Notifications Read. Credit cost: none.',
	},
} satisfies RequiredPluginEndpointMeta<typeof GetProspectOperations>;

export const getProspectAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

type DefaultAuth = 'api_key';
export type BaseGetProspectPlugin<T extends GetProspectPluginOptions> =
	CorsairPlugin<
		'getprospect',
		typeof GetProspectSchema,
		typeof GetProspectOperations,
		Record<string, never>,
		T,
		DefaultAuth
	>;
export type InternalGetProspectPlugin =
	BaseGetProspectPlugin<GetProspectPluginOptions>;
export type ExternalGetProspectPlugin<T extends GetProspectPluginOptions> =
	BaseGetProspectPlugin<T>;

export function getprospect<const T extends GetProspectPluginOptions>(
	incomingOptions: GetProspectPluginOptions &
		T = {} as GetProspectPluginOptions & T,
): ExternalGetProspectPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? ('api_key' as const),
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callerHandlers,
		...builtInHandlers,
		...callerHandlers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'getprospect',
		authConfig: getProspectAuthConfig,
		schema: GetProspectSchema,
		options,
		hooks: options.hooks,
		endpoints: GetProspectOperations,
		webhooks: {},
		endpointMeta: getprospectEndpointMeta,
		endpointSchemas: getprospectEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: GetProspectKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) return options.key;
			if (!ctx.keys) throw new AuthMissingError('getprospect', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('getprospect', 'api_key');
			return apiKey;
		},
	} satisfies InternalGetProspectPlugin;
}

export type {
	GetProspectEndpointInputs,
	GetProspectEndpointOutputs,
	GetProspectOperationId,
};
