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

const addGroupMemberRoute = getRoute('addGroupMember');
export const addGroupMember: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, addGroupMemberRoute);
	await logActiveTrailOperation(ctx, input, addGroupMemberRoute);
	return result;
};

const createANewGroupRoute = getRoute('createANewGroup');
export const createANewGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createANewGroupRoute);
	await logActiveTrailOperation(ctx, input, createANewGroupRoute);
	return result;
};

const deleteAMemberInAGroupRoute = getRoute('deleteAMemberInAGroup');
export const deleteAMemberInAGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteAMemberInAGroupRoute);
	await logActiveTrailOperation(ctx, input, deleteAMemberInAGroupRoute);
	return result;
};

const deleteGroupByIdRoute = getRoute('deleteGroupById');
export const deleteGroupById: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteGroupByIdRoute);
	await logActiveTrailOperation(ctx, input, deleteGroupByIdRoute);
	return result;
};

const getAllGroupsRoute = getRoute('getAllGroups');
export const getAllGroups: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAllGroupsRoute);
	await logActiveTrailOperation(ctx, input, getAllGroupsRoute);
	return result;
};

const getGroupRoute = getRoute('getGroup');
export const getGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getGroupRoute);
	await logActiveTrailOperation(ctx, input, getGroupRoute);
	return result;
};

const getGroupContentsByIdRoute = getRoute('getGroupContentsById');
export const getGroupContentsById: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getGroupContentsByIdRoute);
	await logActiveTrailOperation(ctx, input, getGroupContentsByIdRoute);
	return result;
};

const getGroupsEventsRoute = getRoute('getGroupsEvents');
export const getGroupsEvents: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getGroupsEventsRoute);
	await logActiveTrailOperation(ctx, input, getGroupsEventsRoute);
	return result;
};

const updateGroupRoute = getRoute('updateGroup');
export const updateGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateGroupRoute);
	await logActiveTrailOperation(ctx, input, updateGroupRoute);
	return result;
};

export const GroupsEndpoints = {
	addGroupMember,
	createANewGroup,
	deleteAMemberInAGroup,
	deleteGroupById,
	getAllGroups,
	getGroup,
	getGroupContentsById,
	getGroupsEvents,
	updateGroup
} as const;
