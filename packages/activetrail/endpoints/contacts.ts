import type { ActiveTrailEndpoint } from './factory';
import { executeActiveTrailOperation } from './factory';
import { activeTrailRoutes } from './routes';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[activetrail] missing route: ${name}`);
	}
	return route;
}

const createContactRoute = getRoute('createContact');
export const createContact: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, createContactRoute);
};

const deleteContactRoute = getRoute('deleteContact');
export const deleteContact: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, deleteContactRoute);
};

const getCampaignReportsEmailActivityRoute = getRoute(
	'getCampaignReportsEmailActivity',
);
export const getCampaignReportsEmailActivity: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getCampaignReportsEmailActivityRoute,
	);
};

const getContactActivityRoute = getRoute('getContactActivity');
export const getContactActivity: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactActivityRoute);
};

const getContactDetailsRoute = getRoute('getContactDetails');
export const getContactDetails: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactDetailsRoute);
};

const getContactGroupsRoute = getRoute('getContactGroups');
export const getContactGroups: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactGroupsRoute);
};

const getContactListRoute = getRoute('getContactList');
export const getContactList: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getContactListRoute);
};

const getContactsErrorsRoute = getRoute('getContactsErrors');
export const getContactsErrors: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactsErrorsRoute);
};

const getContactsMailinglistsRoute = getRoute('getContactsMailinglists');
export const getContactsMailinglists: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactsMailinglistsRoute);
};

const getContactsMergesRoute = getRoute('getContactsMerges');
export const getContactsMerges: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactsMergesRoute);
};

const getContactSmsStatisticsRoute = getRoute('getContactSmsStatistics');
export const getContactSmsStatistics: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactSmsStatisticsRoute);
};

const getContactsStatisticsCampaignRoute = getRoute(
	'getContactsStatisticsCampaign',
);
export const getContactsStatisticsCampaign: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getContactsStatisticsCampaignRoute,
	);
};

const getContactsSubscriptionAllContactsRoute = getRoute(
	'getContactsSubscriptionAllContacts',
);
export const getContactsSubscriptionAllContacts: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getContactsSubscriptionAllContactsRoute,
	);
};

const getContactsSubscriptionCustomersStatusRoute = getRoute(
	'getContactsSubscriptionCustomersStatus',
);
export const getContactsSubscriptionCustomersStatus: ActiveTrailEndpoint =
	async (ctx, input = {}) => {
		return executeActiveTrailOperation(
			ctx,
			input,
			getContactsSubscriptionCustomersStatusRoute,
		);
	};

const getContactsSubscriptionSubscribersRoute = getRoute(
	'getContactsSubscriptionSubscribers',
);
export const getContactsSubscriptionSubscribers: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getContactsSubscriptionSubscribersRoute,
	);
};

const getContactsSubscriptionUnsubscribersRoute = getRoute(
	'getContactsSubscriptionUnsubscribers',
);
export const getContactsSubscriptionUnsubscribers: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getContactsSubscriptionUnsubscribersRoute,
	);
};

const getContactsUnsubscribersSmsRoute = getRoute(
	'getContactsUnsubscribersSms',
);
export const getContactsUnsubscribersSms: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getContactsUnsubscribersSmsRoute,
	);
};

const getContactsWithSmsStateRoute = getRoute('getContactsWithSmsState');
export const getContactsWithSmsState: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getContactsWithSmsStateRoute);
};

const getCustomerStatsForTransactionalMessageRoute = getRoute(
	'getCustomerStatsForTransactionalMessage',
);
export const getCustomerStatsForTransactionalMessage: ActiveTrailEndpoint =
	async (ctx, input = {}) => {
		return executeActiveTrailOperation(
			ctx,
			input,
			getCustomerStatsForTransactionalMessageRoute,
		);
	};

const importNewContactsRoute = getRoute('importNewContacts');
export const importNewContacts: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, importNewContactsRoute);
};

const listTransactionalSmsMessagesRoute = getRoute(
	'listTransactionalSmsMessages',
);
export const listTransactionalSmsMessages: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		listTransactionalSmsMessagesRoute,
	);
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
	listTransactionalSmsMessages,
} as const;
