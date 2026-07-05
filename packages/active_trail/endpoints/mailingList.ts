import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[active_trail] missing route: ${name}`);
	}
	return route;
}

const addMailinglistMemberRoute = getRoute('addMailinglistMember');
export const addMailinglistMember: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, addMailinglistMemberRoute);
	await logActiveTrailOperation(ctx, input, addMailinglistMemberRoute);
	return result;
};

const createNewMailingListRoute = getRoute('createNewMailingList');
export const createNewMailingList: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createNewMailingListRoute);
	await logActiveTrailOperation(ctx, input, createNewMailingListRoute);
	return result;
};

const getMailingListRoute = getRoute('getMailingList');
export const getMailingList: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getMailingListRoute);
	await logActiveTrailOperation(ctx, input, getMailingListRoute);
	return result;
};

const getMailingListMembersRoute = getRoute('getMailingListMembers');
export const getMailingListMembers: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getMailingListMembersRoute);
	await logActiveTrailOperation(ctx, input, getMailingListMembersRoute);
	return result;
};

const getMailingListsRoute = getRoute('getMailingLists');
export const getMailingLists: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getMailingListsRoute);
	await logActiveTrailOperation(ctx, input, getMailingListsRoute);
	return result;
};

const removeAContactFromAMailingListRoute = getRoute('removeAContactFromAMailingList');
export const removeAContactFromAMailingList: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, removeAContactFromAMailingListRoute);
	await logActiveTrailOperation(ctx, input, removeAContactFromAMailingListRoute);
	return result;
};

export const MailingListEndpoints = {
	addMailinglistMember,
	createNewMailingList,
	getMailingList,
	getMailingListMembers,
	getMailingLists,
	removeAContactFromAMailingList
} as const;
