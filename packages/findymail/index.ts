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
	contacts_list,
	excludedDomains_add,
	excludedDomains_list,
	excludedDomains_remove,
	exclusionLists_create,
	exclusionLists_delete,
	exclusionLists_get,
	exclusionLists_list,
	exclusionLists_update,
	intellimatch_lookalikes,
	intellimatch_results,
	intellimatch_search,
	intellimatch_status,
	lists_create,
	lists_delete,
	lists_list,
	lists_replace,
	lists_update,
	monitors_create,
	monitors_delete,
	monitors_list,
	monitors_update,
	search_businessProfile,
	search_company,
	search_employees,
	search_name,
	search_phone,
	search_reverseEmail,
	signals_get,
	signals_list,
	technologies_lookup,
	technologies_search,
	usage_credits,
	usage_summary,
	usage_teamSummary,
	verification_verify,
} from './endpoints';
import * as schemas from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FindymailSchema } from './schema';

export type FindymailPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFindymailPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof findymailEndpointsNested>;
};
export type FindymailContext = CorsairPluginContext<
	typeof FindymailSchema,
	FindymailPluginOptions
>;
export type FindymailKeyBuilderContext =
	KeyBuilderContext<FindymailPluginOptions>;
const findymailEndpointsNested = {
	verification: { verify: verification_verify },
	lists: {
		list: lists_list,
		create: lists_create,
		replace: lists_replace,
		delete: lists_delete,
		update: lists_update,
	},
	contacts: { list: contacts_list },
	search: {
		name: search_name,
		businessProfile: search_businessProfile,
		reverseEmail: search_reverseEmail,
		company: search_company,
		employees: search_employees,
		phone: search_phone,
	},
	exclusionLists: {
		list: exclusionLists_list,
		create: exclusionLists_create,
		get: exclusionLists_get,
		update: exclusionLists_update,
		delete: exclusionLists_delete,
	},
	excludedDomains: {
		list: excludedDomains_list,
		add: excludedDomains_add,
		remove: excludedDomains_remove,
	},
	intellimatch: {
		search: intellimatch_search,
		status: intellimatch_status,
		results: intellimatch_results,
		lookalikes: intellimatch_lookalikes,
	},
	signals: { list: signals_list, get: signals_get },
	monitors: {
		list: monitors_list,
		create: monitors_create,
		update: monitors_update,
		delete: monitors_delete,
	},
	technologies: { search: technologies_search, lookup: technologies_lookup },
	usage: {
		credits: usage_credits,
		summary: usage_summary,
		teamSummary: usage_teamSummary,
	},
} as const;
export type FindymailBoundEndpoints = BindEndpoints<
	typeof findymailEndpointsNested
>;
export const findymailEndpointSchemas = {
	'verification.verify': {
		input: schemas.verification_verifyInput,
		output: schemas.verification_verifyOutput,
	},
	'lists.list': {
		input: schemas.lists_listInput,
		output: schemas.lists_listOutput,
	},
	'lists.create': {
		input: schemas.lists_createInput,
		output: schemas.lists_createOutput,
	},
	'lists.replace': {
		input: schemas.lists_replaceInput,
		output: schemas.lists_replaceOutput,
	},
	'lists.delete': {
		input: schemas.lists_deleteInput,
		output: schemas.lists_deleteOutput,
	},
	'contacts.list': {
		input: schemas.contacts_listInput,
		output: schemas.contacts_listOutput,
	},
	'search.name': {
		input: schemas.search_nameInput,
		output: schemas.search_nameOutput,
	},
	'search.businessProfile': {
		input: schemas.search_businessProfileInput,
		output: schemas.search_businessProfileOutput,
	},
	'exclusionLists.list': {
		input: schemas.exclusionLists_listInput,
		output: schemas.exclusionLists_listOutput,
	},
	'exclusionLists.create': {
		input: schemas.exclusionLists_createInput,
		output: schemas.exclusionLists_createOutput,
	},
	'exclusionLists.get': {
		input: schemas.exclusionLists_getInput,
		output: schemas.exclusionLists_getOutput,
	},
	'exclusionLists.update': {
		input: schemas.exclusionLists_updateInput,
		output: schemas.exclusionLists_updateOutput,
	},
	'exclusionLists.delete': {
		input: schemas.exclusionLists_deleteInput,
		output: schemas.exclusionLists_deleteOutput,
	},
	'excludedDomains.list': {
		input: schemas.excludedDomains_listInput,
		output: schemas.excludedDomains_listOutput,
	},
	'excludedDomains.add': {
		input: schemas.excludedDomains_addInput,
		output: schemas.excludedDomains_addOutput,
	},
	'excludedDomains.remove': {
		input: schemas.excludedDomains_removeInput,
		output: schemas.excludedDomains_removeOutput,
	},
	'intellimatch.search': {
		input: schemas.intellimatch_searchInput,
		output: schemas.intellimatch_searchOutput,
	},
	'intellimatch.status': {
		input: schemas.intellimatch_statusInput,
		output: schemas.intellimatch_statusOutput,
	},
	'intellimatch.results': {
		input: schemas.intellimatch_resultsInput,
		output: schemas.intellimatch_resultsOutput,
	},
	'intellimatch.lookalikes': {
		input: schemas.intellimatch_lookalikesInput,
		output: schemas.intellimatch_lookalikesOutput,
	},
	'search.reverseEmail': {
		input: schemas.search_reverseEmailInput,
		output: schemas.search_reverseEmailOutput,
	},
	'search.company': {
		input: schemas.search_companyInput,
		output: schemas.search_companyOutput,
	},
	'search.employees': {
		input: schemas.search_employeesInput,
		output: schemas.search_employeesOutput,
	},
	'search.phone': {
		input: schemas.search_phoneInput,
		output: schemas.search_phoneOutput,
	},
	'signals.list': {
		input: schemas.signals_listInput,
		output: schemas.signals_listOutput,
	},
	'monitors.list': {
		input: schemas.monitors_listInput,
		output: schemas.monitors_listOutput,
	},
	'monitors.create': {
		input: schemas.monitors_createInput,
		output: schemas.monitors_createOutput,
	},
	'monitors.update': {
		input: schemas.monitors_updateInput,
		output: schemas.monitors_updateOutput,
	},
	'monitors.delete': {
		input: schemas.monitors_deleteInput,
		output: schemas.monitors_deleteOutput,
	},
	'signals.get': {
		input: schemas.signals_getInput,
		output: schemas.signals_getOutput,
	},
	'technologies.search': {
		input: schemas.technologies_searchInput,
		output: schemas.technologies_searchOutput,
	},
	'technologies.lookup': {
		input: schemas.technologies_lookupInput,
		output: schemas.technologies_lookupOutput,
	},
	'usage.credits': {
		input: schemas.usage_creditsInput,
		output: schemas.usage_creditsOutput,
	},
	'usage.summary': {
		input: schemas.usage_summaryInput,
		output: schemas.usage_summaryOutput,
	},
	'usage.teamSummary': {
		input: schemas.usage_teamSummaryInput,
		output: schemas.usage_teamSummaryOutput,
	},
	'lists.update': {
		input: schemas.lists_updateInput,
		output: schemas.lists_updateOutput,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof findymailEndpointsNested
>;
const findymailEndpointMeta = {
	'verification.verify': { riskLevel: 'write', description: 'Verify an email' },
	'lists.list': {
		riskLevel: 'read',
		description: 'Get the list of contact lists',
	},
	'lists.create': { riskLevel: 'write', description: 'Create a new list' },
	'lists.replace': { riskLevel: 'write', description: 'Update a contact list' },
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a given list',
	},
	'contacts.list': { riskLevel: 'read', description: 'Get contacts saved' },
	'search.name': { riskLevel: 'write', description: 'Find from name' },
	'search.businessProfile': {
		riskLevel: 'write',
		description: 'Find from business profile',
	},
	'exclusionLists.list': {
		riskLevel: 'read',
		description: 'Get all exclusion lists',
	},
	'exclusionLists.create': {
		riskLevel: 'write',
		description: 'Create a new exclusion list',
	},
	'exclusionLists.get': {
		riskLevel: 'read',
		description: 'Get exclusion list details',
	},
	'exclusionLists.update': {
		riskLevel: 'write',
		description: 'Update an exclusion list',
	},
	'exclusionLists.delete': {
		riskLevel: 'destructive',
		description: 'Delete an exclusion list',
	},
	'excludedDomains.list': {
		riskLevel: 'read',
		description: 'Get excluded domains',
	},
	'excludedDomains.add': {
		riskLevel: 'write',
		description: 'Add excluded domains',
	},
	'excludedDomains.remove': {
		riskLevel: 'destructive',
		description: 'Remove excluded domains',
	},
	'intellimatch.search': { riskLevel: 'write', description: 'Search leads' },
	'intellimatch.status': {
		riskLevel: 'read',
		description: 'Get export status',
	},
	'intellimatch.results': { riskLevel: 'read', description: 'Get results' },
	'intellimatch.lookalikes': {
		riskLevel: 'write',
		description: 'Search lookalike companies',
	},
	'search.reverseEmail': {
		riskLevel: 'write',
		description: 'Reverse email lookup',
	},
	'search.company': {
		riskLevel: 'write',
		description: 'Get company information',
	},
	'search.employees': { riskLevel: 'write', description: 'Find employees' },
	'search.phone': { riskLevel: 'write', description: 'Find phone' },
	'signals.list': { riskLevel: 'read', description: 'List signals' },
	'monitors.list': { riskLevel: 'read', description: 'List monitors' },
	'monitors.create': { riskLevel: 'write', description: 'Create a monitor' },
	'monitors.update': { riskLevel: 'write', description: 'Update a monitor' },
	'monitors.delete': {
		riskLevel: 'destructive',
		description: 'Delete a monitor',
	},
	'signals.get': { riskLevel: 'read', description: 'Get a signal' },
	'technologies.search': {
		riskLevel: 'read',
		description: 'Search technologies',
	},
	'technologies.lookup': {
		riskLevel: 'write',
		description: 'Lookup technologies by domain',
	},
	'usage.credits': { riskLevel: 'read', description: 'Get remaining credits' },
	'usage.summary': { riskLevel: 'read', description: 'Get usage' },
	'usage.teamSummary': { riskLevel: 'read', description: 'Get team usage' },
	'lists.update': {
		riskLevel: 'write',
		description: 'Update a contact list (PATCH)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof findymailEndpointsNested
>;
export const findymailAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;
export type BaseFindymailPlugin<T extends FindymailPluginOptions> =
	CorsairPlugin<
		'findymail',
		typeof FindymailSchema,
		typeof findymailEndpointsNested,
		Record<string, never>,
		T,
		'api_key'
	>;
export type InternalFindymailPlugin =
	BaseFindymailPlugin<FindymailPluginOptions>;
export type ExternalFindymailPlugin<T extends FindymailPluginOptions> =
	BaseFindymailPlugin<T>;
export function findymail<const T extends FindymailPluginOptions>(
	incomingOptions: FindymailPluginOptions & T = {} as FindymailPluginOptions &
		T,
): ExternalFindymailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? ('api_key' as const),
	};
	return {
		id: 'findymail',
		authConfig: findymailAuthConfig,
		schema: FindymailSchema,
		options,
		hooks: options.hooks,
		endpoints: findymailEndpointsNested,
		webhooks: {},
		endpointMeta: findymailEndpointMeta,
		endpointSchemas: findymailEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: FindymailKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			const key = process.env.FINDYMAIL_API_KEY;
			if (key?.trim()) return key;
			throw new AuthMissingError('findymail', 'api_key');
		},
	} satisfies InternalFindymailPlugin;
}
export * from './endpoints/types';
