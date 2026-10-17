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
} from 'corsair/core';
import {
	Account,
	AccountStats,
	ApiKeys,
	Companies,
	CompanyListFolders,
	CompanyLists,
	CompanyTags,
	ConnectedApps,
	CustomAttributes,
	Discover,
	DiscoverViews,
	DomainCount,
	DomainFinder,
	DomainSearch,
	DomainsSuggestion,
	EmailAccounts,
	EmailCount,
	EmailFinder,
	EmailInsight,
	EmailVerifier,
	Enrichment,
	Feedback,
	Leads,
	LeadsListFolders,
	LeadsLists,
	LeadTags,
	Lookalikes,
	Messages,
	MessageTemplates,
	MultiDomainSearch,
	SequenceFollowUps,
	SequenceRecipients,
	SequenceStats,
	Sequences,
	Tags,
	TeamMembers,
	Usage,
	Webhooks,
} from './endpoints';
import type {
	HunterioEndpointInputs,
	HunterioEndpointOutputs,
} from './endpoints/types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HunterioSchema } from './schema';

export type HunterioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHunterioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Hunter.io plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Hunter.io endpoint tree —
	 * invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof hunterioEndpointsNested>;
};

export type HunterioContext = CorsairPluginContext<
	typeof HunterioSchema,
	HunterioPluginOptions
>;

export type HunterioKeyBuilderContext =
	KeyBuilderContext<HunterioPluginOptions>;

export type HunterioBoundEndpoints = BindEndpoints<
	typeof hunterioEndpointsNested
>;

type HunterioEndpoint<K extends keyof HunterioEndpointOutputs> =
	CorsairEndpoint<
		HunterioContext,
		HunterioEndpointInputs[K],
		HunterioEndpointOutputs[K]
	>;

export type HunterioEndpoints = {
	[K in keyof HunterioEndpointOutputs]: HunterioEndpoint<K>;
};

const hunterioEndpointsNested = {
	account: {
		get: Account.get,
		update: Account.update,
	},
	accountStats: {
		get: AccountStats.get,
	},
	usage: {
		get: Usage.get,
		history: Usage.history,
	},
	teamMembers: {
		list: TeamMembers.list,
	},
	apiKeys: {
		list: ApiKeys.list,
		create: ApiKeys.create,
		update: ApiKeys.update,
		replace: ApiKeys.replace,
		delete: ApiKeys.delete,
	},
	connectedApps: {
		list: ConnectedApps.list,
		get: ConnectedApps.get,
		push: ConnectedApps.push,
	},
	feedback: {
		create: Feedback.create,
	},
	discover: {
		companies: Discover.companies,
		people: Discover.people,
		peoplePost: Discover.peoplePost,
	},
	discoverViews: {
		list: DiscoverViews.list,
		create: DiscoverViews.create,
		get: DiscoverViews.get,
		delete: DiscoverViews.delete,
	},
	domainCount: {
		get: DomainCount.get,
	},
	domainFinder: {
		find: DomainFinder.find,
		findPost: DomainFinder.findPost,
	},
	domainsSuggestion: {
		get: DomainsSuggestion.get,
	},
	domainSearch: {
		search: DomainSearch.search,
		searchPost: DomainSearch.searchPost,
	},
	multiDomainSearch: {
		search: MultiDomainSearch.search,
		reveal: MultiDomainSearch.reveal,
	},
	emailFinder: {
		find: EmailFinder.find,
		findFound: EmailFinder.findFound,
		findFoundPost: EmailFinder.findFoundPost,
	},
	emailVerifier: {
		verify: EmailVerifier.verify,
	},
	emailInsight: {
		get: EmailInsight.get,
	},
	emailCount: {
		get: EmailCount.get,
	},
	enrichment: {
		person: Enrichment.person,
		company: Enrichment.company,
		combined: Enrichment.combined,
	},
	lookalikes: {
		list: Lookalikes.list,
	},
	leads: {
		list: Leads.list,
		create: Leads.create,
		upsert: Leads.upsert,
		get: Leads.get,
		update: Leads.update,
		replace: Leads.replace,
		delete: Leads.delete,
		enrich: Leads.enrich,
		exist: Leads.exist,
		bulkExist: Leads.bulkExist,
		bulkUpsert: Leads.bulkUpsert,
		bulkMove: Leads.bulkMove,
		bulkDelete: Leads.bulkDelete,
		importCsv: Leads.importCsv,
	},
	tags: {
		list: Tags.list,
		create: Tags.create,
		get: Tags.get,
		update: Tags.update,
		replace: Tags.replace,
		delete: Tags.delete,
	},
	leadTags: {
		attach: LeadTags.attach,
		detach: LeadTags.detach,
	},
	customAttributes: {
		list: CustomAttributes.list,
		create: CustomAttributes.create,
		get: CustomAttributes.get,
		update: CustomAttributes.update,
		replace: CustomAttributes.replace,
		delete: CustomAttributes.delete,
	},
	leadsLists: {
		list: LeadsLists.list,
		create: LeadsLists.create,
		get: LeadsLists.get,
		update: LeadsLists.update,
		replace: LeadsLists.replace,
		delete: LeadsLists.delete,
		favorite: LeadsLists.favorite,
		unfavorite: LeadsLists.unfavorite,
		merge: LeadsLists.merge,
	},
	leadsListFolders: {
		list: LeadsListFolders.list,
		create: LeadsListFolders.create,
		get: LeadsListFolders.get,
		update: LeadsListFolders.update,
		replace: LeadsListFolders.replace,
		delete: LeadsListFolders.delete,
	},
	companies: {
		list: Companies.list,
		create: Companies.create,
		get: Companies.get,
		delete: Companies.delete,
		tag: Companies.tag,
		untag: Companies.untag,
		bulkMove: Companies.bulkMove,
		bulkCopy: Companies.bulkCopy,
		bulkDelete: Companies.bulkDelete,
		bulkTag: Companies.bulkTag,
	},
	companyLists: {
		list: CompanyLists.list,
		create: CompanyLists.create,
		get: CompanyLists.get,
		update: CompanyLists.update,
		replace: CompanyLists.replace,
		delete: CompanyLists.delete,
		addCompany: CompanyLists.addCompany,
		removeCompany: CompanyLists.removeCompany,
		favorite: CompanyLists.favorite,
		unfavorite: CompanyLists.unfavorite,
	},
	companyListFolders: {
		list: CompanyListFolders.list,
		create: CompanyListFolders.create,
		get: CompanyListFolders.get,
		update: CompanyListFolders.update,
		replace: CompanyListFolders.replace,
		delete: CompanyListFolders.delete,
	},
	companyTags: {
		list: CompanyTags.list,
		create: CompanyTags.create,
		get: CompanyTags.get,
		update: CompanyTags.update,
		replace: CompanyTags.replace,
		delete: CompanyTags.delete,
	},
	sequences: {
		list: Sequences.list,
		create: Sequences.create,
		get: Sequences.get,
		update: Sequences.update,
		replace: Sequences.replace,
		delete: Sequences.delete,
		start: Sequences.start,
		pause: Sequences.pause,
		resume: Sequences.resume,
		archive: Sequences.archive,
		test: Sequences.test,
	},
	sequenceRecipients: {
		list: SequenceRecipients.list,
		add: SequenceRecipients.add,
		remove: SequenceRecipients.remove,
	},
	sequenceFollowUps: {
		list: SequenceFollowUps.list,
		create: SequenceFollowUps.create,
		get: SequenceFollowUps.get,
		update: SequenceFollowUps.update,
		replace: SequenceFollowUps.replace,
		delete: SequenceFollowUps.delete,
	},
	sequenceStats: {
		get: SequenceStats.get,
	},
	messages: {
		list: Messages.list,
		send: Messages.send,
	},
	messageTemplates: {
		list: MessageTemplates.list,
		create: MessageTemplates.create,
		get: MessageTemplates.get,
		update: MessageTemplates.update,
		replace: MessageTemplates.replace,
		delete: MessageTemplates.delete,
	},
	emailAccounts: {
		list: EmailAccounts.list,
		get: EmailAccounts.get,
		update: EmailAccounts.update,
		replace: EmailAccounts.replace,
		capacities: EmailAccounts.capacities,
		healthReport: EmailAccounts.healthReport,
		usage: EmailAccounts.usage,
		warmupReport: EmailAccounts.warmupReport,
		sequences: EmailAccounts.sequences,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		get: Webhooks.get,
		update: Webhooks.update,
		replace: Webhooks.replace,
		delete: Webhooks.delete,
		deleteLegacy: Webhooks.deleteLegacy,
	},
} as const;

export const hunterioEndpointSchemas = {
	'account.get': {
		input: HunterioEndpointInputSchemas.accountGet,
		output: HunterioEndpointOutputSchemas.accountGet,
	},
	'account.update': {
		input: HunterioEndpointInputSchemas.accountUpdate,
		output: HunterioEndpointOutputSchemas.accountUpdate,
	},
	'accountStats.get': {
		input: HunterioEndpointInputSchemas.accountStatsGet,
		output: HunterioEndpointOutputSchemas.accountStatsGet,
	},
	'usage.get': {
		input: HunterioEndpointInputSchemas.usageGet,
		output: HunterioEndpointOutputSchemas.usageGet,
	},
	'usage.history': {
		input: HunterioEndpointInputSchemas.usageHistory,
		output: HunterioEndpointOutputSchemas.usageHistory,
	},
	'teamMembers.list': {
		input: HunterioEndpointInputSchemas.teamMembersList,
		output: HunterioEndpointOutputSchemas.teamMembersList,
	},
	'apiKeys.list': {
		input: HunterioEndpointInputSchemas.apiKeysList,
		output: HunterioEndpointOutputSchemas.apiKeysList,
	},
	'apiKeys.create': {
		input: HunterioEndpointInputSchemas.apiKeysCreate,
		output: HunterioEndpointOutputSchemas.apiKeysCreate,
	},
	'apiKeys.update': {
		input: HunterioEndpointInputSchemas.apiKeysUpdate,
		output: HunterioEndpointOutputSchemas.apiKeysUpdate,
	},
	'apiKeys.replace': {
		input: HunterioEndpointInputSchemas.apiKeysReplace,
		output: HunterioEndpointOutputSchemas.apiKeysReplace,
	},
	'apiKeys.delete': {
		input: HunterioEndpointInputSchemas.apiKeysDelete,
		output: HunterioEndpointOutputSchemas.apiKeysDelete,
	},
	'connectedApps.list': {
		input: HunterioEndpointInputSchemas.connectedAppsList,
		output: HunterioEndpointOutputSchemas.connectedAppsList,
	},
	'connectedApps.get': {
		input: HunterioEndpointInputSchemas.connectedAppsGet,
		output: HunterioEndpointOutputSchemas.connectedAppsGet,
	},
	'connectedApps.push': {
		input: HunterioEndpointInputSchemas.connectedAppsPush,
		output: HunterioEndpointOutputSchemas.connectedAppsPush,
	},
	'feedback.create': {
		input: HunterioEndpointInputSchemas.feedbackCreate,
		output: HunterioEndpointOutputSchemas.feedbackCreate,
	},
	'discover.companies': {
		input: HunterioEndpointInputSchemas.discoverCompanies,
		output: HunterioEndpointOutputSchemas.discoverCompanies,
	},
	'discover.people': {
		input: HunterioEndpointInputSchemas.discoverPeople,
		output: HunterioEndpointOutputSchemas.discoverPeople,
	},
	'discover.peoplePost': {
		input: HunterioEndpointInputSchemas.discoverPeoplePost,
		output: HunterioEndpointOutputSchemas.discoverPeoplePost,
	},
	'discoverViews.list': {
		input: HunterioEndpointInputSchemas.discoverViewsList,
		output: HunterioEndpointOutputSchemas.discoverViewsList,
	},
	'discoverViews.create': {
		input: HunterioEndpointInputSchemas.discoverViewsCreate,
		output: HunterioEndpointOutputSchemas.discoverViewsCreate,
	},
	'discoverViews.get': {
		input: HunterioEndpointInputSchemas.discoverViewsGet,
		output: HunterioEndpointOutputSchemas.discoverViewsGet,
	},
	'discoverViews.delete': {
		input: HunterioEndpointInputSchemas.discoverViewsDelete,
		output: HunterioEndpointOutputSchemas.discoverViewsDelete,
	},
	'domainCount.get': {
		input: HunterioEndpointInputSchemas.domainCountGet,
		output: HunterioEndpointOutputSchemas.domainCountGet,
	},
	'domainFinder.find': {
		input: HunterioEndpointInputSchemas.domainFinderFind,
		output: HunterioEndpointOutputSchemas.domainFinderFind,
	},
	'domainFinder.findPost': {
		input: HunterioEndpointInputSchemas.domainFinderFindPost,
		output: HunterioEndpointOutputSchemas.domainFinderFindPost,
	},
	'domainsSuggestion.get': {
		input: HunterioEndpointInputSchemas.domainsSuggestionGet,
		output: HunterioEndpointOutputSchemas.domainsSuggestionGet,
	},
	'domainSearch.search': {
		input: HunterioEndpointInputSchemas.domainSearchSearch,
		output: HunterioEndpointOutputSchemas.domainSearchSearch,
	},
	'domainSearch.searchPost': {
		input: HunterioEndpointInputSchemas.domainSearchSearchPost,
		output: HunterioEndpointOutputSchemas.domainSearchSearchPost,
	},
	'multiDomainSearch.search': {
		input: HunterioEndpointInputSchemas.multiDomainSearchSearch,
		output: HunterioEndpointOutputSchemas.multiDomainSearchSearch,
	},
	'multiDomainSearch.reveal': {
		input: HunterioEndpointInputSchemas.multiDomainSearchReveal,
		output: HunterioEndpointOutputSchemas.multiDomainSearchReveal,
	},
	'emailFinder.find': {
		input: HunterioEndpointInputSchemas.emailFinderFind,
		output: HunterioEndpointOutputSchemas.emailFinderFind,
	},
	'emailFinder.findFound': {
		input: HunterioEndpointInputSchemas.emailFinderFindFound,
		output: HunterioEndpointOutputSchemas.emailFinderFindFound,
	},
	'emailFinder.findFoundPost': {
		input: HunterioEndpointInputSchemas.emailFinderFindFoundPost,
		output: HunterioEndpointOutputSchemas.emailFinderFindFoundPost,
	},
	'emailVerifier.verify': {
		input: HunterioEndpointInputSchemas.emailVerifierVerify,
		output: HunterioEndpointOutputSchemas.emailVerifierVerify,
	},
	'emailInsight.get': {
		input: HunterioEndpointInputSchemas.emailInsightGet,
		output: HunterioEndpointOutputSchemas.emailInsightGet,
	},
	'emailCount.get': {
		input: HunterioEndpointInputSchemas.emailCountGet,
		output: HunterioEndpointOutputSchemas.emailCountGet,
	},
	'enrichment.person': {
		input: HunterioEndpointInputSchemas.enrichmentPerson,
		output: HunterioEndpointOutputSchemas.enrichmentPerson,
	},
	'enrichment.company': {
		input: HunterioEndpointInputSchemas.enrichmentCompany,
		output: HunterioEndpointOutputSchemas.enrichmentCompany,
	},
	'enrichment.combined': {
		input: HunterioEndpointInputSchemas.enrichmentCombined,
		output: HunterioEndpointOutputSchemas.enrichmentCombined,
	},
	'lookalikes.list': {
		input: HunterioEndpointInputSchemas.lookalikesList,
		output: HunterioEndpointOutputSchemas.lookalikesList,
	},
	'leads.list': {
		input: HunterioEndpointInputSchemas.leadsList,
		output: HunterioEndpointOutputSchemas.leadsList,
	},
	'leads.create': {
		input: HunterioEndpointInputSchemas.leadsCreate,
		output: HunterioEndpointOutputSchemas.leadsCreate,
	},
	'leads.upsert': {
		input: HunterioEndpointInputSchemas.leadsUpsert,
		output: HunterioEndpointOutputSchemas.leadsUpsert,
	},
	'leads.get': {
		input: HunterioEndpointInputSchemas.leadsGet,
		output: HunterioEndpointOutputSchemas.leadsGet,
	},
	'leads.update': {
		input: HunterioEndpointInputSchemas.leadsUpdate,
		output: HunterioEndpointOutputSchemas.leadsUpdate,
	},
	'leads.replace': {
		input: HunterioEndpointInputSchemas.leadsReplace,
		output: HunterioEndpointOutputSchemas.leadsReplace,
	},
	'leads.delete': {
		input: HunterioEndpointInputSchemas.leadsDelete,
		output: HunterioEndpointOutputSchemas.leadsDelete,
	},
	'leads.enrich': {
		input: HunterioEndpointInputSchemas.leadsEnrich,
		output: HunterioEndpointOutputSchemas.leadsEnrich,
	},
	'leads.exist': {
		input: HunterioEndpointInputSchemas.leadsExist,
		output: HunterioEndpointOutputSchemas.leadsExist,
	},
	'leads.bulkExist': {
		input: HunterioEndpointInputSchemas.leadsBulkExist,
		output: HunterioEndpointOutputSchemas.leadsBulkExist,
	},
	'leads.bulkUpsert': {
		input: HunterioEndpointInputSchemas.leadsBulkUpsert,
		output: HunterioEndpointOutputSchemas.leadsBulkUpsert,
	},
	'leads.bulkMove': {
		input: HunterioEndpointInputSchemas.leadsBulkMove,
		output: HunterioEndpointOutputSchemas.leadsBulkMove,
	},
	'leads.bulkDelete': {
		input: HunterioEndpointInputSchemas.leadsBulkDelete,
		output: HunterioEndpointOutputSchemas.leadsBulkDelete,
	},
	'leads.importCsv': {
		input: HunterioEndpointInputSchemas.leadsImportCsv,
		output: HunterioEndpointOutputSchemas.leadsImportCsv,
	},
	'tags.list': {
		input: HunterioEndpointInputSchemas.tagsList,
		output: HunterioEndpointOutputSchemas.tagsList,
	},
	'tags.create': {
		input: HunterioEndpointInputSchemas.tagsCreate,
		output: HunterioEndpointOutputSchemas.tagsCreate,
	},
	'tags.get': {
		input: HunterioEndpointInputSchemas.tagsGet,
		output: HunterioEndpointOutputSchemas.tagsGet,
	},
	'tags.update': {
		input: HunterioEndpointInputSchemas.tagsUpdate,
		output: HunterioEndpointOutputSchemas.tagsUpdate,
	},
	'tags.replace': {
		input: HunterioEndpointInputSchemas.tagsReplace,
		output: HunterioEndpointOutputSchemas.tagsReplace,
	},
	'tags.delete': {
		input: HunterioEndpointInputSchemas.tagsDelete,
		output: HunterioEndpointOutputSchemas.tagsDelete,
	},
	'leadTags.attach': {
		input: HunterioEndpointInputSchemas.leadTagsAttach,
		output: HunterioEndpointOutputSchemas.leadTagsAttach,
	},
	'leadTags.detach': {
		input: HunterioEndpointInputSchemas.leadTagsDetach,
		output: HunterioEndpointOutputSchemas.leadTagsDetach,
	},
	'customAttributes.list': {
		input: HunterioEndpointInputSchemas.customAttributesList,
		output: HunterioEndpointOutputSchemas.customAttributesList,
	},
	'customAttributes.create': {
		input: HunterioEndpointInputSchemas.customAttributesCreate,
		output: HunterioEndpointOutputSchemas.customAttributesCreate,
	},
	'customAttributes.get': {
		input: HunterioEndpointInputSchemas.customAttributesGet,
		output: HunterioEndpointOutputSchemas.customAttributesGet,
	},
	'customAttributes.update': {
		input: HunterioEndpointInputSchemas.customAttributesUpdate,
		output: HunterioEndpointOutputSchemas.customAttributesUpdate,
	},
	'customAttributes.replace': {
		input: HunterioEndpointInputSchemas.customAttributesReplace,
		output: HunterioEndpointOutputSchemas.customAttributesReplace,
	},
	'customAttributes.delete': {
		input: HunterioEndpointInputSchemas.customAttributesDelete,
		output: HunterioEndpointOutputSchemas.customAttributesDelete,
	},
	'leadsLists.list': {
		input: HunterioEndpointInputSchemas.leadsListsList,
		output: HunterioEndpointOutputSchemas.leadsListsList,
	},
	'leadsLists.create': {
		input: HunterioEndpointInputSchemas.leadsListsCreate,
		output: HunterioEndpointOutputSchemas.leadsListsCreate,
	},
	'leadsLists.get': {
		input: HunterioEndpointInputSchemas.leadsListsGet,
		output: HunterioEndpointOutputSchemas.leadsListsGet,
	},
	'leadsLists.update': {
		input: HunterioEndpointInputSchemas.leadsListsUpdate,
		output: HunterioEndpointOutputSchemas.leadsListsUpdate,
	},
	'leadsLists.replace': {
		input: HunterioEndpointInputSchemas.leadsListsReplace,
		output: HunterioEndpointOutputSchemas.leadsListsReplace,
	},
	'leadsLists.delete': {
		input: HunterioEndpointInputSchemas.leadsListsDelete,
		output: HunterioEndpointOutputSchemas.leadsListsDelete,
	},
	'leadsLists.favorite': {
		input: HunterioEndpointInputSchemas.leadsListsFavorite,
		output: HunterioEndpointOutputSchemas.leadsListsFavorite,
	},
	'leadsLists.unfavorite': {
		input: HunterioEndpointInputSchemas.leadsListsUnfavorite,
		output: HunterioEndpointOutputSchemas.leadsListsUnfavorite,
	},
	'leadsLists.merge': {
		input: HunterioEndpointInputSchemas.leadsListsMerge,
		output: HunterioEndpointOutputSchemas.leadsListsMerge,
	},
	'leadsListFolders.list': {
		input: HunterioEndpointInputSchemas.leadsListFoldersList,
		output: HunterioEndpointOutputSchemas.leadsListFoldersList,
	},
	'leadsListFolders.create': {
		input: HunterioEndpointInputSchemas.leadsListFoldersCreate,
		output: HunterioEndpointOutputSchemas.leadsListFoldersCreate,
	},
	'leadsListFolders.get': {
		input: HunterioEndpointInputSchemas.leadsListFoldersGet,
		output: HunterioEndpointOutputSchemas.leadsListFoldersGet,
	},
	'leadsListFolders.update': {
		input: HunterioEndpointInputSchemas.leadsListFoldersUpdate,
		output: HunterioEndpointOutputSchemas.leadsListFoldersUpdate,
	},
	'leadsListFolders.replace': {
		input: HunterioEndpointInputSchemas.leadsListFoldersReplace,
		output: HunterioEndpointOutputSchemas.leadsListFoldersReplace,
	},
	'leadsListFolders.delete': {
		input: HunterioEndpointInputSchemas.leadsListFoldersDelete,
		output: HunterioEndpointOutputSchemas.leadsListFoldersDelete,
	},
	'companies.list': {
		input: HunterioEndpointInputSchemas.companiesList,
		output: HunterioEndpointOutputSchemas.companiesList,
	},
	'companies.create': {
		input: HunterioEndpointInputSchemas.companiesCreate,
		output: HunterioEndpointOutputSchemas.companiesCreate,
	},
	'companies.get': {
		input: HunterioEndpointInputSchemas.companiesGet,
		output: HunterioEndpointOutputSchemas.companiesGet,
	},
	'companies.delete': {
		input: HunterioEndpointInputSchemas.companiesDelete,
		output: HunterioEndpointOutputSchemas.companiesDelete,
	},
	'companies.tag': {
		input: HunterioEndpointInputSchemas.companiesTag,
		output: HunterioEndpointOutputSchemas.companiesTag,
	},
	'companies.untag': {
		input: HunterioEndpointInputSchemas.companiesUntag,
		output: HunterioEndpointOutputSchemas.companiesUntag,
	},
	'companies.bulkMove': {
		input: HunterioEndpointInputSchemas.companiesBulkMove,
		output: HunterioEndpointOutputSchemas.companiesBulkMove,
	},
	'companies.bulkCopy': {
		input: HunterioEndpointInputSchemas.companiesBulkCopy,
		output: HunterioEndpointOutputSchemas.companiesBulkCopy,
	},
	'companies.bulkDelete': {
		input: HunterioEndpointInputSchemas.companiesBulkDelete,
		output: HunterioEndpointOutputSchemas.companiesBulkDelete,
	},
	'companies.bulkTag': {
		input: HunterioEndpointInputSchemas.companiesBulkTag,
		output: HunterioEndpointOutputSchemas.companiesBulkTag,
	},
	'companyLists.list': {
		input: HunterioEndpointInputSchemas.companyListsList,
		output: HunterioEndpointOutputSchemas.companyListsList,
	},
	'companyLists.create': {
		input: HunterioEndpointInputSchemas.companyListsCreate,
		output: HunterioEndpointOutputSchemas.companyListsCreate,
	},
	'companyLists.get': {
		input: HunterioEndpointInputSchemas.companyListsGet,
		output: HunterioEndpointOutputSchemas.companyListsGet,
	},
	'companyLists.update': {
		input: HunterioEndpointInputSchemas.companyListsUpdate,
		output: HunterioEndpointOutputSchemas.companyListsUpdate,
	},
	'companyLists.replace': {
		input: HunterioEndpointInputSchemas.companyListsReplace,
		output: HunterioEndpointOutputSchemas.companyListsReplace,
	},
	'companyLists.delete': {
		input: HunterioEndpointInputSchemas.companyListsDelete,
		output: HunterioEndpointOutputSchemas.companyListsDelete,
	},
	'companyLists.addCompany': {
		input: HunterioEndpointInputSchemas.companyListsAddCompany,
		output: HunterioEndpointOutputSchemas.companyListsAddCompany,
	},
	'companyLists.removeCompany': {
		input: HunterioEndpointInputSchemas.companyListsRemoveCompany,
		output: HunterioEndpointOutputSchemas.companyListsRemoveCompany,
	},
	'companyLists.favorite': {
		input: HunterioEndpointInputSchemas.companyListsFavorite,
		output: HunterioEndpointOutputSchemas.companyListsFavorite,
	},
	'companyLists.unfavorite': {
		input: HunterioEndpointInputSchemas.companyListsUnfavorite,
		output: HunterioEndpointOutputSchemas.companyListsUnfavorite,
	},
	'companyListFolders.list': {
		input: HunterioEndpointInputSchemas.companyListFoldersList,
		output: HunterioEndpointOutputSchemas.companyListFoldersList,
	},
	'companyListFolders.create': {
		input: HunterioEndpointInputSchemas.companyListFoldersCreate,
		output: HunterioEndpointOutputSchemas.companyListFoldersCreate,
	},
	'companyListFolders.get': {
		input: HunterioEndpointInputSchemas.companyListFoldersGet,
		output: HunterioEndpointOutputSchemas.companyListFoldersGet,
	},
	'companyListFolders.update': {
		input: HunterioEndpointInputSchemas.companyListFoldersUpdate,
		output: HunterioEndpointOutputSchemas.companyListFoldersUpdate,
	},
	'companyListFolders.replace': {
		input: HunterioEndpointInputSchemas.companyListFoldersReplace,
		output: HunterioEndpointOutputSchemas.companyListFoldersReplace,
	},
	'companyListFolders.delete': {
		input: HunterioEndpointInputSchemas.companyListFoldersDelete,
		output: HunterioEndpointOutputSchemas.companyListFoldersDelete,
	},
	'companyTags.list': {
		input: HunterioEndpointInputSchemas.companyTagsList,
		output: HunterioEndpointOutputSchemas.companyTagsList,
	},
	'companyTags.create': {
		input: HunterioEndpointInputSchemas.companyTagsCreate,
		output: HunterioEndpointOutputSchemas.companyTagsCreate,
	},
	'companyTags.get': {
		input: HunterioEndpointInputSchemas.companyTagsGet,
		output: HunterioEndpointOutputSchemas.companyTagsGet,
	},
	'companyTags.update': {
		input: HunterioEndpointInputSchemas.companyTagsUpdate,
		output: HunterioEndpointOutputSchemas.companyTagsUpdate,
	},
	'companyTags.replace': {
		input: HunterioEndpointInputSchemas.companyTagsReplace,
		output: HunterioEndpointOutputSchemas.companyTagsReplace,
	},
	'companyTags.delete': {
		input: HunterioEndpointInputSchemas.companyTagsDelete,
		output: HunterioEndpointOutputSchemas.companyTagsDelete,
	},
	'sequences.list': {
		input: HunterioEndpointInputSchemas.sequencesList,
		output: HunterioEndpointOutputSchemas.sequencesList,
	},
	'sequences.create': {
		input: HunterioEndpointInputSchemas.sequencesCreate,
		output: HunterioEndpointOutputSchemas.sequencesCreate,
	},
	'sequences.get': {
		input: HunterioEndpointInputSchemas.sequencesGet,
		output: HunterioEndpointOutputSchemas.sequencesGet,
	},
	'sequences.update': {
		input: HunterioEndpointInputSchemas.sequencesUpdate,
		output: HunterioEndpointOutputSchemas.sequencesUpdate,
	},
	'sequences.replace': {
		input: HunterioEndpointInputSchemas.sequencesReplace,
		output: HunterioEndpointOutputSchemas.sequencesReplace,
	},
	'sequences.delete': {
		input: HunterioEndpointInputSchemas.sequencesDelete,
		output: HunterioEndpointOutputSchemas.sequencesDelete,
	},
	'sequences.start': {
		input: HunterioEndpointInputSchemas.sequencesStart,
		output: HunterioEndpointOutputSchemas.sequencesStart,
	},
	'sequences.pause': {
		input: HunterioEndpointInputSchemas.sequencesPause,
		output: HunterioEndpointOutputSchemas.sequencesPause,
	},
	'sequences.resume': {
		input: HunterioEndpointInputSchemas.sequencesResume,
		output: HunterioEndpointOutputSchemas.sequencesResume,
	},
	'sequences.archive': {
		input: HunterioEndpointInputSchemas.sequencesArchive,
		output: HunterioEndpointOutputSchemas.sequencesArchive,
	},
	'sequences.test': {
		input: HunterioEndpointInputSchemas.sequencesTest,
		output: HunterioEndpointOutputSchemas.sequencesTest,
	},
	'sequenceRecipients.list': {
		input: HunterioEndpointInputSchemas.sequenceRecipientsList,
		output: HunterioEndpointOutputSchemas.sequenceRecipientsList,
	},
	'sequenceRecipients.add': {
		input: HunterioEndpointInputSchemas.sequenceRecipientsAdd,
		output: HunterioEndpointOutputSchemas.sequenceRecipientsAdd,
	},
	'sequenceRecipients.remove': {
		input: HunterioEndpointInputSchemas.sequenceRecipientsRemove,
		output: HunterioEndpointOutputSchemas.sequenceRecipientsRemove,
	},
	'sequenceFollowUps.list': {
		input: HunterioEndpointInputSchemas.sequenceFollowUpsList,
		output: HunterioEndpointOutputSchemas.sequenceFollowUpsList,
	},
	'sequenceFollowUps.create': {
		input: HunterioEndpointInputSchemas.sequenceFollowUpsCreate,
		output: HunterioEndpointOutputSchemas.sequenceFollowUpsCreate,
	},
	'sequenceFollowUps.get': {
		input: HunterioEndpointInputSchemas.sequenceFollowUpsGet,
		output: HunterioEndpointOutputSchemas.sequenceFollowUpsGet,
	},
	'sequenceFollowUps.update': {
		input: HunterioEndpointInputSchemas.sequenceFollowUpsUpdate,
		output: HunterioEndpointOutputSchemas.sequenceFollowUpsUpdate,
	},
	'sequenceFollowUps.replace': {
		input: HunterioEndpointInputSchemas.sequenceFollowUpsReplace,
		output: HunterioEndpointOutputSchemas.sequenceFollowUpsReplace,
	},
	'sequenceFollowUps.delete': {
		input: HunterioEndpointInputSchemas.sequenceFollowUpsDelete,
		output: HunterioEndpointOutputSchemas.sequenceFollowUpsDelete,
	},
	'sequenceStats.get': {
		input: HunterioEndpointInputSchemas.sequenceStatsGet,
		output: HunterioEndpointOutputSchemas.sequenceStatsGet,
	},
	'messages.list': {
		input: HunterioEndpointInputSchemas.messagesList,
		output: HunterioEndpointOutputSchemas.messagesList,
	},
	'messages.send': {
		input: HunterioEndpointInputSchemas.messagesSend,
		output: HunterioEndpointOutputSchemas.messagesSend,
	},
	'messageTemplates.list': {
		input: HunterioEndpointInputSchemas.messageTemplatesList,
		output: HunterioEndpointOutputSchemas.messageTemplatesList,
	},
	'messageTemplates.create': {
		input: HunterioEndpointInputSchemas.messageTemplatesCreate,
		output: HunterioEndpointOutputSchemas.messageTemplatesCreate,
	},
	'messageTemplates.get': {
		input: HunterioEndpointInputSchemas.messageTemplatesGet,
		output: HunterioEndpointOutputSchemas.messageTemplatesGet,
	},
	'messageTemplates.update': {
		input: HunterioEndpointInputSchemas.messageTemplatesUpdate,
		output: HunterioEndpointOutputSchemas.messageTemplatesUpdate,
	},
	'messageTemplates.replace': {
		input: HunterioEndpointInputSchemas.messageTemplatesReplace,
		output: HunterioEndpointOutputSchemas.messageTemplatesReplace,
	},
	'messageTemplates.delete': {
		input: HunterioEndpointInputSchemas.messageTemplatesDelete,
		output: HunterioEndpointOutputSchemas.messageTemplatesDelete,
	},
	'emailAccounts.list': {
		input: HunterioEndpointInputSchemas.emailAccountsList,
		output: HunterioEndpointOutputSchemas.emailAccountsList,
	},
	'emailAccounts.get': {
		input: HunterioEndpointInputSchemas.emailAccountsGet,
		output: HunterioEndpointOutputSchemas.emailAccountsGet,
	},
	'emailAccounts.update': {
		input: HunterioEndpointInputSchemas.emailAccountsUpdate,
		output: HunterioEndpointOutputSchemas.emailAccountsUpdate,
	},
	'emailAccounts.replace': {
		input: HunterioEndpointInputSchemas.emailAccountsReplace,
		output: HunterioEndpointOutputSchemas.emailAccountsReplace,
	},
	'emailAccounts.capacities': {
		input: HunterioEndpointInputSchemas.emailAccountsCapacities,
		output: HunterioEndpointOutputSchemas.emailAccountsCapacities,
	},
	'emailAccounts.healthReport': {
		input: HunterioEndpointInputSchemas.emailAccountsHealthReport,
		output: HunterioEndpointOutputSchemas.emailAccountsHealthReport,
	},
	'emailAccounts.usage': {
		input: HunterioEndpointInputSchemas.emailAccountsUsage,
		output: HunterioEndpointOutputSchemas.emailAccountsUsage,
	},
	'emailAccounts.warmupReport': {
		input: HunterioEndpointInputSchemas.emailAccountsWarmupReport,
		output: HunterioEndpointOutputSchemas.emailAccountsWarmupReport,
	},
	'emailAccounts.sequences': {
		input: HunterioEndpointInputSchemas.emailAccountsSequences,
		output: HunterioEndpointOutputSchemas.emailAccountsSequences,
	},
	'webhooks.list': {
		input: HunterioEndpointInputSchemas.webhooksList,
		output: HunterioEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: HunterioEndpointInputSchemas.webhooksCreate,
		output: HunterioEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.get': {
		input: HunterioEndpointInputSchemas.webhooksGet,
		output: HunterioEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.update': {
		input: HunterioEndpointInputSchemas.webhooksUpdate,
		output: HunterioEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.replace': {
		input: HunterioEndpointInputSchemas.webhooksReplace,
		output: HunterioEndpointOutputSchemas.webhooksReplace,
	},
	'webhooks.delete': {
		input: HunterioEndpointInputSchemas.webhooksDelete,
		output: HunterioEndpointOutputSchemas.webhooksDelete,
	},
	'webhooks.deleteLegacy': {
		input: HunterioEndpointInputSchemas.webhooksDeleteLegacy,
		output: HunterioEndpointOutputSchemas.webhooksDeleteLegacy,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof hunterioEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hunterioEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get the Hunter.io account profile',
	},
	'account.update': {
		riskLevel: 'write',
		description: 'Update the Hunter.io account profile',
	},
	'accountStats.get': {
		riskLevel: 'read',
		description: 'Get global account statistics and credit usage',
	},
	'usage.get': {
		riskLevel: 'read',
		description: 'Get account usage and plan limits',
	},
	'usage.history': {
		riskLevel: 'read',
		description: 'Get the daily API usage history for this billing period',
	},
	'teamMembers.list': {
		riskLevel: 'read',
		description: 'List the team members on the account',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description: 'List the API keys on the account',
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description: 'Create a new API key',
	},
	'apiKeys.update': {
		riskLevel: 'write',
		description: 'Update an API key',
	},
	'apiKeys.replace': {
		riskLevel: 'write',
		description: 'Replace an API key definition',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an API key permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'connectedApps.list': {
		riskLevel: 'read',
		description: 'List the connected apps on the account',
	},
	'connectedApps.get': {
		riskLevel: 'read',
		description: 'Get a connected app',
	},
	'connectedApps.push': {
		riskLevel: 'write',
		description: 'Push leads to a connected app',
	},
	'feedback.create': {
		riskLevel: 'write',
		description: 'Send product feedback to Hunter',
	},
	'discover.companies': {
		riskLevel: 'read',
		description: 'Discover companies matching the given filters',
	},
	'discover.people': {
		riskLevel: 'read',
		description: 'Discover people matching the given filters',
	},
	'discover.peoplePost': {
		riskLevel: 'read',
		description: 'Discover people with nested filters (POST form)',
	},
	'discoverViews.list': {
		riskLevel: 'read',
		description: 'List saved discover views',
	},
	'discoverViews.create': {
		riskLevel: 'write',
		description: 'Save the current discover filters as a view',
	},
	'discoverViews.get': {
		riskLevel: 'read',
		description: 'Get a saved discover view',
	},
	'discoverViews.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a saved discover view permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'domainCount.get': {
		riskLevel: 'read',
		description: 'Count the email addresses available for a domain',
	},
	'domainFinder.find': {
		riskLevel: 'read',
		description: 'Find the domain of a company by name',
	},
	'domainFinder.findPost': {
		riskLevel: 'read',
		description: 'Find the domain of a company by name (POST form)',
	},
	'domainsSuggestion.get': {
		riskLevel: 'read',
		description: 'Suggest similar company domains',
	},
	'domainSearch.search': {
		riskLevel: 'read',
		description: 'List the email addresses found for a domain',
	},
	'domainSearch.searchPost': {
		riskLevel: 'read',
		description: 'List the email addresses found for a domain (POST form)',
	},
	'multiDomainSearch.search': {
		riskLevel: 'read',
		description: 'Find email addresses across multiple domains',
	},
	'multiDomainSearch.reveal': {
		riskLevel: 'read',
		description: 'Reveal the verified email addresses of a multi-domain search',
	},
	'emailFinder.find': {
		riskLevel: 'read',
		description: 'Find the most likely email of a person',
	},
	'emailFinder.findFound': {
		riskLevel: 'read',
		description: 'Check whether an email was already found for a person',
	},
	'emailFinder.findFoundPost': {
		riskLevel: 'read',
		description: 'Check whether an email was already found (POST form)',
	},
	'emailVerifier.verify': {
		riskLevel: 'read',
		description: 'Verify the deliverability of an email address',
	},
	'emailInsight.get': {
		riskLevel: 'read',
		description: 'Get insight data for an email address',
	},
	'emailCount.get': {
		riskLevel: 'read',
		description: 'Count the email addresses found for a domain',
	},
	'enrichment.person': {
		riskLevel: 'read',
		description: 'Enrich a person profile from an email or name',
	},
	'enrichment.company': {
		riskLevel: 'read',
		description: 'Enrich a company profile from a domain or name',
	},
	'enrichment.combined': {
		riskLevel: 'read',
		description: 'Enrich a person and their company together',
	},
	'lookalikes.list': {
		riskLevel: 'read',
		description: 'Find companies similar to a seed company',
	},
	'leads.list': {
		riskLevel: 'read',
		description: 'List leads with filters',
	},
	'leads.create': {
		riskLevel: 'write',
		description: 'Create a lead',
	},
	'leads.upsert': {
		riskLevel: 'write',
		description: 'Create or update a lead',
	},
	'leads.get': {
		riskLevel: 'read',
		description: 'Get a lead',
	},
	'leads.update': {
		riskLevel: 'write',
		description: 'Update a lead',
	},
	'leads.replace': {
		riskLevel: 'write',
		description: 'Replace a lead',
	},
	'leads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a lead permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'leads.enrich': {
		riskLevel: 'write',
		description: 'Enrich a lead with data found by Hunter',
	},
	'leads.exist': {
		riskLevel: 'read',
		description: 'Check whether an email exists as a lead',
	},
	'leads.bulkExist': {
		riskLevel: 'read',
		description: 'Check which of the given emails exist as leads',
	},
	'leads.bulkUpsert': {
		riskLevel: 'write',
		description: 'Create or update up to 1000 leads in a single call',
	},
	'leads.bulkMove': {
		riskLevel: 'write',
		description: 'Move leads to another leads list',
	},
	'leads.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete leads in bulk permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'leads.importCsv': {
		riskLevel: 'write',
		description: 'Create a CSV import job for leads',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the lead tags on the account',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a lead tag',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get a lead tag',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Update a lead tag',
	},
	'tags.replace': {
		riskLevel: 'write',
		description: 'Replace a lead tag',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a lead tag permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'leadTags.attach': {
		riskLevel: 'write',
		description: 'Attach a tag to a lead',
	},
	'leadTags.detach': {
		riskLevel: 'destructive',
		description: 'Detach a tag from a lead [DESTRUCTIVE]',
	},
	'customAttributes.list': {
		riskLevel: 'read',
		description: 'List the custom attributes on the account',
	},
	'customAttributes.create': {
		riskLevel: 'write',
		description: 'Create a custom attribute',
	},
	'customAttributes.get': {
		riskLevel: 'read',
		description: 'Get a custom attribute',
	},
	'customAttributes.update': {
		riskLevel: 'write',
		description: 'Update a custom attribute',
	},
	'customAttributes.replace': {
		riskLevel: 'write',
		description: 'Replace a custom attribute',
	},
	'customAttributes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom attribute permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'leadsLists.list': {
		riskLevel: 'read',
		description: 'List the leads lists on the account',
	},
	'leadsLists.create': {
		riskLevel: 'write',
		description: 'Create a leads list',
	},
	'leadsLists.get': {
		riskLevel: 'read',
		description: 'Get a leads list and its leads',
	},
	'leadsLists.update': {
		riskLevel: 'write',
		description: 'Update a leads list',
	},
	'leadsLists.replace': {
		riskLevel: 'write',
		description: 'Replace a leads list',
	},
	'leadsLists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a leads list permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'leadsLists.favorite': {
		riskLevel: 'write',
		description: 'Mark a leads list as favorite',
	},
	'leadsLists.unfavorite': {
		riskLevel: 'write',
		description: 'Remove the favorite mark from a leads list',
	},
	'leadsLists.merge': {
		riskLevel: 'destructive',
		description: 'Merge a leads list into another list [DESTRUCTIVE]',
	},
	'leadsListFolders.list': {
		riskLevel: 'read',
		description: 'List the leads list folders',
	},
	'leadsListFolders.create': {
		riskLevel: 'write',
		description: 'Create a leads list folder',
	},
	'leadsListFolders.get': {
		riskLevel: 'read',
		description: 'Get a leads list folder',
	},
	'leadsListFolders.update': {
		riskLevel: 'write',
		description: 'Update a leads list folder',
	},
	'leadsListFolders.replace': {
		riskLevel: 'write',
		description: 'Replace a leads list folder',
	},
	'leadsListFolders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a leads list folder permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'List companies with filters',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Add a company to the account from a domain',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Get a company',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a company permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'companies.tag': {
		riskLevel: 'write',
		description: 'Assign a tag to a company',
	},
	'companies.untag': {
		riskLevel: 'destructive',
		description: 'Remove a tag from a company [DESTRUCTIVE]',
	},
	'companies.bulkMove': {
		riskLevel: 'write',
		description: 'Move companies to another company list',
	},
	'companies.bulkCopy': {
		riskLevel: 'write',
		description: 'Copy companies to another company list',
	},
	'companies.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete companies in bulk permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'companies.bulkTag': {
		riskLevel: 'write',
		description: 'Assign a tag to companies in bulk',
	},
	'companyLists.list': {
		riskLevel: 'read',
		description: 'List the company lists on the account',
	},
	'companyLists.create': {
		riskLevel: 'write',
		description: 'Create a company list',
	},
	'companyLists.get': {
		riskLevel: 'read',
		description: 'Get a company list and its companies',
	},
	'companyLists.update': {
		riskLevel: 'write',
		description: 'Update a company list',
	},
	'companyLists.replace': {
		riskLevel: 'write',
		description: 'Replace a company list',
	},
	'companyLists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a company list permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'companyLists.addCompany': {
		riskLevel: 'write',
		description: 'Add a company to a company list',
	},
	'companyLists.removeCompany': {
		riskLevel: 'destructive',
		description: 'Remove a company from a company list [DESTRUCTIVE]',
	},
	'companyLists.favorite': {
		riskLevel: 'write',
		description: 'Mark a company list as favorite',
	},
	'companyLists.unfavorite': {
		riskLevel: 'write',
		description: 'Remove the favorite mark from a company list',
	},
	'companyListFolders.list': {
		riskLevel: 'read',
		description: 'List the company list folders',
	},
	'companyListFolders.create': {
		riskLevel: 'write',
		description: 'Create a company list folder',
	},
	'companyListFolders.get': {
		riskLevel: 'read',
		description: 'Get a company list folder',
	},
	'companyListFolders.update': {
		riskLevel: 'write',
		description: 'Update a company list folder',
	},
	'companyListFolders.replace': {
		riskLevel: 'write',
		description: 'Replace a company list folder',
	},
	'companyListFolders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a company list folder permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'companyTags.list': {
		riskLevel: 'read',
		description: 'List the company tags on the account',
	},
	'companyTags.create': {
		riskLevel: 'write',
		description: 'Create a company tag',
	},
	'companyTags.get': {
		riskLevel: 'read',
		description: 'Get a company tag',
	},
	'companyTags.update': {
		riskLevel: 'write',
		description: 'Update a company tag',
	},
	'companyTags.replace': {
		riskLevel: 'write',
		description: 'Replace a company tag',
	},
	'companyTags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a company tag permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'sequences.list': {
		riskLevel: 'read',
		description: 'List sequences',
	},
	'sequences.create': {
		riskLevel: 'write',
		description: 'Create a sequence draft',
	},
	'sequences.get': {
		riskLevel: 'read',
		description: 'Get a sequence',
	},
	'sequences.update': {
		riskLevel: 'write',
		description: 'Update a sequence',
	},
	'sequences.replace': {
		riskLevel: 'write',
		description: 'Replace a sequence',
	},
	'sequences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a sequence draft permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'sequences.start': {
		riskLevel: 'write',
		description: 'Start a sequence',
	},
	'sequences.pause': {
		riskLevel: 'write',
		description: 'Pause an active sequence',
	},
	'sequences.resume': {
		riskLevel: 'write',
		description: 'Resume a paused sequence',
	},
	'sequences.archive': {
		riskLevel: 'write',
		description: 'Archive a sequence',
	},
	'sequences.test': {
		riskLevel: 'write',
		description: 'Send test emails for every step of a sequence',
	},
	'sequenceRecipients.list': {
		riskLevel: 'read',
		description: 'List the recipients of a sequence',
	},
	'sequenceRecipients.add': {
		riskLevel: 'write',
		description: 'Add recipients to a sequence',
	},
	'sequenceRecipients.remove': {
		riskLevel: 'destructive',
		description:
			'Remove recipients from a sequence and cancel their messages [DESTRUCTIVE]',
	},
	'sequenceFollowUps.list': {
		riskLevel: 'read',
		description: 'List the follow-up steps of a sequence',
	},
	'sequenceFollowUps.create': {
		riskLevel: 'write',
		description: 'Add a follow-up step to a sequence',
	},
	'sequenceFollowUps.get': {
		riskLevel: 'read',
		description: 'Get a follow-up step',
	},
	'sequenceFollowUps.update': {
		riskLevel: 'write',
		description: 'Update a follow-up step',
	},
	'sequenceFollowUps.replace': {
		riskLevel: 'write',
		description: 'Replace a follow-up step',
	},
	'sequenceFollowUps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the last follow-up step permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'sequenceStats.get': {
		riskLevel: 'read',
		description: 'Get performance statistics for a sequence',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages sent or received',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a message from a connected email account',
	},
	'messageTemplates.list': {
		riskLevel: 'read',
		description: 'List message templates',
	},
	'messageTemplates.create': {
		riskLevel: 'write',
		description: 'Create a message template',
	},
	'messageTemplates.get': {
		riskLevel: 'read',
		description: 'Get a message template',
	},
	'messageTemplates.update': {
		riskLevel: 'write',
		description: 'Update a message template',
	},
	'messageTemplates.replace': {
		riskLevel: 'write',
		description: 'Replace a message template',
	},
	'messageTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a message template permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'emailAccounts.list': {
		riskLevel: 'read',
		description: 'List the connected email accounts',
	},
	'emailAccounts.get': {
		riskLevel: 'read',
		description: 'Get a connected email account',
	},
	'emailAccounts.update': {
		riskLevel: 'write',
		description: 'Update email account settings',
	},
	'emailAccounts.replace': {
		riskLevel: 'write',
		description: 'Replace email account settings',
	},
	'emailAccounts.capacities': {
		riskLevel: 'read',
		description: 'Get the sending capacities of all email accounts',
	},
	'emailAccounts.healthReport': {
		riskLevel: 'read',
		description: 'Get the deliverability health report of an email account',
	},
	'emailAccounts.usage': {
		riskLevel: 'read',
		description: 'Get sending usage and limits of an email account',
	},
	'emailAccounts.warmupReport': {
		riskLevel: 'read',
		description: 'Get the warmup report of an email account',
	},
	'emailAccounts.sequences': {
		riskLevel: 'read',
		description: 'List the sequences using an email account',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the configured webhooks',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get a webhook',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a webhook',
	},
	'webhooks.replace': {
		riskLevel: 'write',
		description: 'Replace a webhook',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook permanently [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'webhooks.deleteLegacy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook permanently via the legacy endpoint [DESTRUCTIVE · IRREVERSIBLE]',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hunterioEndpointsNested>;

export const hunterioAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseHunterioPlugin<T extends HunterioPluginOptions> = CorsairPlugin<
	'hunterio',
	typeof HunterioSchema,
	typeof hunterioEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalHunterioPlugin = BaseHunterioPlugin<HunterioPluginOptions>;

export type ExternalHunterioPlugin<T extends HunterioPluginOptions> =
	BaseHunterioPlugin<T>;

export function hunterio<const T extends HunterioPluginOptions>(
	incomingOptions: HunterioPluginOptions & T = {} as HunterioPluginOptions & T,
): ExternalHunterioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'hunterio',
		authConfig: hunterioAuthConfig,
		schema: HunterioSchema,
		options,
		hooks: options.hooks,
		endpoints: hunterioEndpointsNested,
		// Hunter.io exposes outbound webhooks (configured per account through the
		// API, covered by the webhooks.* endpoints), but no inbound webhook
		// delivery with a verification spec to handle.
		webhooks: {},
		endpointMeta: hunterioEndpointMeta,
		endpointSchemas: hunterioEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		// A missing stored key resolves to an empty string; the request client
		// turns that into AuthMissingError before any network call.
		keyBuilder: async (ctx: HunterioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				return (await ctx.keys.get_api_key()) ?? '';
			}

			return '';
		},
	} satisfies InternalHunterioPlugin;
}

export type {
	HunterioEndpointInputs,
	HunterioEndpointOutputs,
} from './endpoints/types';
