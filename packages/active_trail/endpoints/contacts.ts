import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error('[active_trail] missing route: ${name}');
	}
	return route;
}

const createContactRoute = getRoute('createContact');
export const createContact: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createContactRoute);
	await logActiveTrailOperation(ctx, input, createContactRoute);
	return result;
};

const deleteContactRoute = getRoute('deleteContact');
export const deleteContact: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteContactRoute);
	await logActiveTrailOperation(ctx, input, deleteContactRoute);
	return result;
};

const getCampaignReportsEmailActivityRoute = getRoute('getCampaignReportsEmailActivity');
export const getCampaignReportsEmailActivity: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignReportsEmailActivityRoute);
	await logActiveTrailOperation(ctx, input, getCampaignReportsEmailActivityRoute);
	return result;
};

const getContactActivityRoute = getRoute('getContactActivity');
export const getContactActivity: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactActivityRoute);
	await logActiveTrailOperation(ctx, input, getContactActivityRoute);
	return result;
};

const getContactDetailsRoute = getRoute('getContactDetails');
export const getContactDetails: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactDetailsRoute);
	await logActiveTrailOperation(ctx, input, getContactDetailsRoute);
	return result;
};

const getContactGroupsRoute = getRoute('getContactGroups');
export const getContactGroups: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactGroupsRoute);
	await logActiveTrailOperation(ctx, input, getContactGroupsRoute);
	return result;
};

const getContactListRoute = getRoute('getContactList');
export const getContactList: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactListRoute);
	await logActiveTrailOperation(ctx, input, getContactListRoute);
	return result;
};

const getContactsErrorsRoute = getRoute('getContactsErrors');
export const getContactsErrors: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsErrorsRoute);
	await logActiveTrailOperation(ctx, input, getContactsErrorsRoute);
	return result;
};

const getContactsMailinglistsRoute = getRoute('getContactsMailinglists');
export const getContactsMailinglists: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsMailinglistsRoute);
	await logActiveTrailOperation(ctx, input, getContactsMailinglistsRoute);
	return result;
};

const getContactsMergesRoute = getRoute('getContactsMerges');
export const getContactsMerges: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsMergesRoute);
	await logActiveTrailOperation(ctx, input, getContactsMergesRoute);
	return result;
};

const getContactSmsStatisticsRoute = getRoute('getContactSmsStatistics');
export const getContactSmsStatistics: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactSmsStatisticsRoute);
	await logActiveTrailOperation(ctx, input, getContactSmsStatisticsRoute);
	return result;
};

const getContactsStatisticsCampaignRoute = getRoute('getContactsStatisticsCampaign');
export const getContactsStatisticsCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsStatisticsCampaignRoute);
	await logActiveTrailOperation(ctx, input, getContactsStatisticsCampaignRoute);
	return result;
};

const getContactsSubscriptionAllContactsRoute = getRoute('getContactsSubscriptionAllContacts');
export const getContactsSubscriptionAllContacts: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsSubscriptionAllContactsRoute);
	await logActiveTrailOperation(ctx, input, getContactsSubscriptionAllContactsRoute);
	return result;
};

const getContactsSubscriptionCustomersStatusRoute = getRoute('getContactsSubscriptionCustomersStatus');
export const getContactsSubscriptionCustomersStatus: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsSubscriptionCustomersStatusRoute);
	await logActiveTrailOperation(ctx, input, getContactsSubscriptionCustomersStatusRoute);
	return result;
};

const getContactsSubscriptionSubscribersRoute = getRoute('getContactsSubscriptionSubscribers');
export const getContactsSubscriptionSubscribers: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsSubscriptionSubscribersRoute);
	await logActiveTrailOperation(ctx, input, getContactsSubscriptionSubscribersRoute);
	return result;
};

const getContactsSubscriptionUnsubscribersRoute = getRoute('getContactsSubscriptionUnsubscribers');
export const getContactsSubscriptionUnsubscribers: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsSubscriptionUnsubscribersRoute);
	await logActiveTrailOperation(ctx, input, getContactsSubscriptionUnsubscribersRoute);
	return result;
};

const getContactsUnsubscribersSmsRoute = getRoute('getContactsUnsubscribersSms');
export const getContactsUnsubscribersSms: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsUnsubscribersSmsRoute);
	await logActiveTrailOperation(ctx, input, getContactsUnsubscribersSmsRoute);
	return result;
};

const getContactsWithSmsStateRoute = getRoute('getContactsWithSmsState');
export const getContactsWithSmsState: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactsWithSmsStateRoute);
	await logActiveTrailOperation(ctx, input, getContactsWithSmsStateRoute);
	return result;
};

const getCustomerStatsForTransactionalMessageRoute = getRoute('getCustomerStatsForTransactionalMessage');
export const getCustomerStatsForTransactionalMessage: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCustomerStatsForTransactionalMessageRoute);
	await logActiveTrailOperation(ctx, input, getCustomerStatsForTransactionalMessageRoute);
	return result;
};

const importNewContactsRoute = getRoute('importNewContacts');
export const importNewContacts: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, importNewContactsRoute);
	await logActiveTrailOperation(ctx, input, importNewContactsRoute);
	return result;
};

const listTransactionalSmsMessagesRoute = getRoute('listTransactionalSmsMessages');
export const listTransactionalSmsMessages: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, listTransactionalSmsMessagesRoute);
	await logActiveTrailOperation(ctx, input, listTransactionalSmsMessagesRoute);
	return result;
};

export const ContactsEndpoints = {
	createContact,
	deleteContact,
	getCampaignReportsEmailActivity,
	getContactActivity,
	getContactDetails,
	getContactGroups,
	getContactList,
	getContactsErrors,
	getContactsMailinglists,
	getContactsMerges,
	getContactSmsStatistics,
	getContactsStatisticsCampaign,
	getContactsSubscriptionAllContacts,
	getContactsSubscriptionCustomersStatus,
	getContactsSubscriptionSubscribers,
	getContactsSubscriptionUnsubscribers,
	getContactsUnsubscribersSms,
	getContactsWithSmsState,
	getCustomerStatsForTransactionalMessage,
	importNewContacts,
	listTransactionalSmsMessages
} as const;
