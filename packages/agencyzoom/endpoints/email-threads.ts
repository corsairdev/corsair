import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const deleteMessageRoute = getRoute('deleteMessage');
export const deleteMessage: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteMessageRoute);
};

const deleteThreadRoute = getRoute('deleteThread');
export const deleteThread: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteThreadRoute);
};

const getThreadDetailsRoute = getRoute('getThreadDetails');
export const getThreadDetails: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, getThreadDetailsRoute);
};

const markThreadAsUnreadApiEndpointRoute = getRoute(
	'markThreadAsUnreadApiEndpoint',
);
export const markThreadAsUnreadApiEndpoint: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		markThreadAsUnreadApiEndpointRoute,
	);
};

const searchEmailThreadsRoute = getRoute('searchEmailThreads');
export const searchEmailThreads: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, searchEmailThreadsRoute);
};

export const EmailThreadsEndpoints = {
	deleteMessage,
	deleteThread,
	getThreadDetails,
	markThreadAsUnreadApiEndpoint,
	searchEmailThreads,
} as const;
