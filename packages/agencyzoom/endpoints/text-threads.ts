import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const getAListOfProducerRoute = getRoute('getAListOfProducer');
export const getAListOfProducer: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfProducerRoute);
};

const removeTextThreadEndpointRoute = getRoute('removeTextThreadEndpoint');
export const removeTextThreadEndpoint: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, removeTextThreadEndpointRoute);
};

const searchSmsThreadsRoute = getRoute('searchSmsThreads');
export const searchSmsThreads: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, searchSmsThreadsRoute);
};

const textDetailThreadRoute = getRoute('textDetailThread');
export const textDetailThread: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, textDetailThreadRoute);
};

const unreadThreadRoute = getRoute('unreadThread');
export const unreadThread: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, unreadThreadRoute);
};

export const TextThreadsEndpoints = {
	getAListOfProducer,
	removeTextThreadEndpoint,
	searchSmsThreads,
	textDetailThread,
	unreadThread,
} as const;
