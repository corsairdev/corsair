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

const addGroupMemberRoute = getRoute('addGroupMember');
export const addGroupMember: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, addGroupMemberRoute);
};

const createANewGroupRoute = getRoute('createANewGroup');
export const createANewGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, createANewGroupRoute);
};

const deleteAMemberInAGroupRoute = getRoute('deleteAMemberInAGroup');
export const deleteAMemberInAGroup: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, deleteAMemberInAGroupRoute);
};

const deleteGroupByIdRoute = getRoute('deleteGroupById');
export const deleteGroupById: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, deleteGroupByIdRoute);
};

const getAllGroupsRoute = getRoute('getAllGroups');
export const getAllGroups: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAllGroupsRoute);
};

const getGroupRoute = getRoute('getGroup');
export const getGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getGroupRoute);
};

const getGroupContentsByIdRoute = getRoute('getGroupContentsById');
export const getGroupContentsById: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getGroupContentsByIdRoute);
};

const getGroupsEventsRoute = getRoute('getGroupsEvents');
export const getGroupsEvents: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getGroupsEventsRoute);
};

const updateGroupRoute = getRoute('updateGroup');
export const updateGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, updateGroupRoute);
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
	updateGroup,
} as const;
