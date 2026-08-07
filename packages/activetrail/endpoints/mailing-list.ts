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

const addMailinglistMemberRoute = getRoute('addMailinglistMember');
export const addMailinglistMember: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, addMailinglistMemberRoute);
};

const createNewMailingListRoute = getRoute('createNewMailingList');
export const createNewMailingList: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, createNewMailingListRoute);
};

const getMailingListRoute = getRoute('getMailingList');
export const getMailingList: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getMailingListRoute);
};

const getMailingListMembersRoute = getRoute('getMailingListMembers');
export const getMailingListMembers: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getMailingListMembersRoute);
};

const getMailingListsRoute = getRoute('getMailingLists');
export const getMailingLists: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getMailingListsRoute);
};

const removeAContactFromAMailingListRoute = getRoute(
	'removeAContactFromAMailingList',
);
export const removeAContactFromAMailingList: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		removeAContactFromAMailingListRoute,
	);
};

export const MailingListEndpoints = {
	addMailinglistMember,
	createNewMailingList,
	getMailingList,
	getMailingListMembers,
	getMailingLists,
	removeAContactFromAMailingList,
} as const;
