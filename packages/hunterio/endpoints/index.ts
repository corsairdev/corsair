import { get as accountGet, update as accountUpdate } from './account';
import { get as accountStatsGet } from './account-stats';
import {
	create as apiKeysCreate,
	list as apiKeysList,
	remove as apiKeysRemove,
	replace as apiKeysReplace,
	update as apiKeysUpdate,
} from './api-keys';
import {
	bulkCopy as companiesBulkCopy,
	bulkDelete as companiesBulkDelete,
	bulkMove as companiesBulkMove,
	bulkTag as companiesBulkTag,
	create as companiesCreate,
	get as companiesGet,
	list as companiesList,
	remove as companiesRemove,
	tag as companiesTag,
	untag as companiesUntag,
} from './companies';
import {
	create as companyListFoldersCreate,
	get as companyListFoldersGet,
	list as companyListFoldersList,
	remove as companyListFoldersRemove,
	replace as companyListFoldersReplace,
	update as companyListFoldersUpdate,
} from './company-list-folders';
import {
	addCompany as companyListsAddCompany,
	create as companyListsCreate,
	favorite as companyListsFavorite,
	get as companyListsGet,
	list as companyListsList,
	remove as companyListsRemove,
	removeCompany as companyListsRemoveCompany,
	replace as companyListsReplace,
	unfavorite as companyListsUnfavorite,
	update as companyListsUpdate,
} from './company-lists';
import {
	create as companyTagsCreate,
	get as companyTagsGet,
	list as companyTagsList,
	remove as companyTagsRemove,
	replace as companyTagsReplace,
	update as companyTagsUpdate,
} from './company-tags';
import {
	get as connectedAppsGet,
	list as connectedAppsList,
	push as connectedAppsPush,
} from './connected-apps';
import {
	create as customAttributesCreate,
	get as customAttributesGet,
	list as customAttributesList,
	remove as customAttributesRemove,
	replace as customAttributesReplace,
	update as customAttributesUpdate,
} from './custom-attributes';
import {
	companies as discoverCompanies,
	people as discoverPeople,
	peoplePost as discoverPeoplePost,
} from './discover';
import {
	create as discoverViewsCreate,
	get as discoverViewsGet,
	list as discoverViewsList,
	remove as discoverViewsRemove,
} from './discover-views';
import { get as domainCountGet } from './domain-count';
import {
	find as domainFinderFind,
	findPost as domainFinderFindPost,
} from './domain-finder';
import {
	search as domainSearchSearch,
	searchPost as domainSearchSearchPost,
} from './domain-search';
import { get as domainsSuggestionGet } from './domains-suggestion';
import {
	capacities as emailAccountsCapacities,
	get as emailAccountsGet,
	healthReport as emailAccountsHealthReport,
	list as emailAccountsList,
	replace as emailAccountsReplace,
	sequences as emailAccountsSequences,
	update as emailAccountsUpdate,
	usage as emailAccountsUsage,
	warmupReport as emailAccountsWarmupReport,
} from './email-accounts';
import { get as emailCountGet } from './email-count';
import {
	find as emailFinderFind,
	findFound as emailFinderFindFound,
	findFoundPost as emailFinderFindFoundPost,
} from './email-finder';
import { get as emailInsightGet } from './email-insight';
import { verify as emailVerifierVerify } from './email-verifier';
import {
	combined as enrichmentCombined,
	company as enrichmentCompany,
	person as enrichmentPerson,
} from './enrichment';
import { create as feedbackCreate } from './feedback';
import {
	attach as leadTagsAttach,
	detach as leadTagsDetach,
} from './lead-tags';
import {
	bulkDelete as leadsBulkDelete,
	bulkExist as leadsBulkExist,
	bulkMove as leadsBulkMove,
	bulkUpsert as leadsBulkUpsert,
	create as leadsCreate,
	enrich as leadsEnrich,
	exist as leadsExist,
	get as leadsGet,
	importCsv as leadsImportCsv,
	list as leadsList,
	remove as leadsRemove,
	replace as leadsReplace,
	update as leadsUpdate,
	upsert as leadsUpsert,
} from './leads';
import {
	create as leadsListFoldersCreate,
	get as leadsListFoldersGet,
	list as leadsListFoldersList,
	remove as leadsListFoldersRemove,
	replace as leadsListFoldersReplace,
	update as leadsListFoldersUpdate,
} from './leads-list-folders';
import {
	create as leadsListsCreate,
	favorite as leadsListsFavorite,
	get as leadsListsGet,
	list as leadsListsList,
	merge as leadsListsMerge,
	remove as leadsListsRemove,
	replace as leadsListsReplace,
	unfavorite as leadsListsUnfavorite,
	update as leadsListsUpdate,
} from './leads-lists';
import { list as lookalikesList } from './lookalikes';
import {
	create as messageTemplatesCreate,
	get as messageTemplatesGet,
	list as messageTemplatesList,
	remove as messageTemplatesRemove,
	replace as messageTemplatesReplace,
	update as messageTemplatesUpdate,
} from './message-templates';
import { list as messagesList, send as messagesSend } from './messages';
import {
	reveal as multiDomainSearchReveal,
	search as multiDomainSearchSearch,
} from './multi-domain-search';
import {
	create as sequenceFollowUpsCreate,
	get as sequenceFollowUpsGet,
	list as sequenceFollowUpsList,
	remove as sequenceFollowUpsRemove,
	replace as sequenceFollowUpsReplace,
	update as sequenceFollowUpsUpdate,
} from './sequence-follow-ups';
import {
	add as sequenceRecipientsAdd,
	list as sequenceRecipientsList,
	remove as sequenceRecipientsRemove,
} from './sequence-recipients';
import { get as sequenceStatsGet } from './sequence-stats';
import {
	archive as sequencesArchive,
	create as sequencesCreate,
	get as sequencesGet,
	list as sequencesList,
	pause as sequencesPause,
	remove as sequencesRemove,
	replace as sequencesReplace,
	resume as sequencesResume,
	start as sequencesStart,
	test as sequencesTest,
	update as sequencesUpdate,
} from './sequences';
import {
	create as tagsCreate,
	get as tagsGet,
	list as tagsList,
	remove as tagsRemove,
	replace as tagsReplace,
	update as tagsUpdate,
} from './tags';
import { list as teamMembersList } from './team-members';
import { get as usageGet, history as usageHistory } from './usage';
import {
	create as webhooksCreate,
	deleteLegacy as webhooksDeleteLegacy,
	get as webhooksGet,
	list as webhooksList,
	remove as webhooksRemove,
	replace as webhooksReplace,
	update as webhooksUpdate,
} from './webhooks';

export const Account = {
	get: accountGet,
	update: accountUpdate,
};

export const AccountStats = {
	get: accountStatsGet,
};

export const Usage = {
	get: usageGet,
	history: usageHistory,
};

export const TeamMembers = {
	list: teamMembersList,
};

export const ApiKeys = {
	list: apiKeysList,
	create: apiKeysCreate,
	update: apiKeysUpdate,
	replace: apiKeysReplace,
	delete: apiKeysRemove,
};

export const ConnectedApps = {
	list: connectedAppsList,
	get: connectedAppsGet,
	push: connectedAppsPush,
};

export const Feedback = {
	create: feedbackCreate,
};

export const Discover = {
	companies: discoverCompanies,
	people: discoverPeople,
	peoplePost: discoverPeoplePost,
};

export const DiscoverViews = {
	list: discoverViewsList,
	create: discoverViewsCreate,
	get: discoverViewsGet,
	delete: discoverViewsRemove,
};

export const DomainCount = {
	get: domainCountGet,
};

export const DomainFinder = {
	find: domainFinderFind,
	findPost: domainFinderFindPost,
};

export const DomainsSuggestion = {
	get: domainsSuggestionGet,
};

export const DomainSearch = {
	search: domainSearchSearch,
	searchPost: domainSearchSearchPost,
};

export const MultiDomainSearch = {
	search: multiDomainSearchSearch,
	reveal: multiDomainSearchReveal,
};

export const EmailFinder = {
	find: emailFinderFind,
	findFound: emailFinderFindFound,
	findFoundPost: emailFinderFindFoundPost,
};

export const EmailVerifier = {
	verify: emailVerifierVerify,
};

export const EmailInsight = {
	get: emailInsightGet,
};

export const EmailCount = {
	get: emailCountGet,
};

export const Enrichment = {
	person: enrichmentPerson,
	company: enrichmentCompany,
	combined: enrichmentCombined,
};

export const Lookalikes = {
	list: lookalikesList,
};

export const Leads = {
	list: leadsList,
	create: leadsCreate,
	upsert: leadsUpsert,
	get: leadsGet,
	update: leadsUpdate,
	replace: leadsReplace,
	delete: leadsRemove,
	enrich: leadsEnrich,
	exist: leadsExist,
	bulkExist: leadsBulkExist,
	bulkUpsert: leadsBulkUpsert,
	bulkMove: leadsBulkMove,
	bulkDelete: leadsBulkDelete,
	importCsv: leadsImportCsv,
};

export const Tags = {
	list: tagsList,
	create: tagsCreate,
	get: tagsGet,
	update: tagsUpdate,
	replace: tagsReplace,
	delete: tagsRemove,
};

export const LeadTags = {
	attach: leadTagsAttach,
	detach: leadTagsDetach,
};

export const CustomAttributes = {
	list: customAttributesList,
	create: customAttributesCreate,
	get: customAttributesGet,
	update: customAttributesUpdate,
	replace: customAttributesReplace,
	delete: customAttributesRemove,
};

export const LeadsLists = {
	list: leadsListsList,
	create: leadsListsCreate,
	get: leadsListsGet,
	update: leadsListsUpdate,
	replace: leadsListsReplace,
	delete: leadsListsRemove,
	favorite: leadsListsFavorite,
	unfavorite: leadsListsUnfavorite,
	merge: leadsListsMerge,
};

export const LeadsListFolders = {
	list: leadsListFoldersList,
	create: leadsListFoldersCreate,
	get: leadsListFoldersGet,
	update: leadsListFoldersUpdate,
	replace: leadsListFoldersReplace,
	delete: leadsListFoldersRemove,
};

export const Companies = {
	list: companiesList,
	create: companiesCreate,
	get: companiesGet,
	delete: companiesRemove,
	tag: companiesTag,
	untag: companiesUntag,
	bulkMove: companiesBulkMove,
	bulkCopy: companiesBulkCopy,
	bulkDelete: companiesBulkDelete,
	bulkTag: companiesBulkTag,
};

export const CompanyLists = {
	list: companyListsList,
	create: companyListsCreate,
	get: companyListsGet,
	update: companyListsUpdate,
	replace: companyListsReplace,
	delete: companyListsRemove,
	addCompany: companyListsAddCompany,
	removeCompany: companyListsRemoveCompany,
	favorite: companyListsFavorite,
	unfavorite: companyListsUnfavorite,
};

export const CompanyListFolders = {
	list: companyListFoldersList,
	create: companyListFoldersCreate,
	get: companyListFoldersGet,
	update: companyListFoldersUpdate,
	replace: companyListFoldersReplace,
	delete: companyListFoldersRemove,
};

export const CompanyTags = {
	list: companyTagsList,
	create: companyTagsCreate,
	get: companyTagsGet,
	update: companyTagsUpdate,
	replace: companyTagsReplace,
	delete: companyTagsRemove,
};

export const Sequences = {
	list: sequencesList,
	create: sequencesCreate,
	get: sequencesGet,
	update: sequencesUpdate,
	replace: sequencesReplace,
	delete: sequencesRemove,
	start: sequencesStart,
	pause: sequencesPause,
	resume: sequencesResume,
	archive: sequencesArchive,
	test: sequencesTest,
};

export const SequenceRecipients = {
	list: sequenceRecipientsList,
	add: sequenceRecipientsAdd,
	remove: sequenceRecipientsRemove,
};

export const SequenceFollowUps = {
	list: sequenceFollowUpsList,
	create: sequenceFollowUpsCreate,
	get: sequenceFollowUpsGet,
	update: sequenceFollowUpsUpdate,
	replace: sequenceFollowUpsReplace,
	delete: sequenceFollowUpsRemove,
};

export const SequenceStats = {
	get: sequenceStatsGet,
};

export const Messages = {
	list: messagesList,
	send: messagesSend,
};

export const MessageTemplates = {
	list: messageTemplatesList,
	create: messageTemplatesCreate,
	get: messageTemplatesGet,
	update: messageTemplatesUpdate,
	replace: messageTemplatesReplace,
	delete: messageTemplatesRemove,
};

export const EmailAccounts = {
	list: emailAccountsList,
	get: emailAccountsGet,
	update: emailAccountsUpdate,
	replace: emailAccountsReplace,
	capacities: emailAccountsCapacities,
	healthReport: emailAccountsHealthReport,
	usage: emailAccountsUsage,
	warmupReport: emailAccountsWarmupReport,
	sequences: emailAccountsSequences,
};

export const Webhooks = {
	list: webhooksList,
	create: webhooksCreate,
	get: webhooksGet,
	update: webhooksUpdate,
	replace: webhooksReplace,
	delete: webhooksRemove,
	deleteLegacy: webhooksDeleteLegacy,
};

export * from './types';
