import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const createDestinationRoute = getRoute('createDestination');
export const createDestination: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, createDestinationRoute);
};

const deleteDestinationRoute = getRoute('deleteDestination');
export const deleteDestination: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteDestinationRoute);
};

const getDestinationRoute = getRoute('getDestination');
export const getDestination: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getDestinationRoute);
};

const listDestinationsRoute = getRoute('listDestinations');
export const listDestinations: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listDestinationsRoute);
};

const searchDestinationsRoute = getRoute('searchDestinations');
export const searchDestinations: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, searchDestinationsRoute);
};

const updateDestinationRoute = getRoute('updateDestination');
export const updateDestination: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, updateDestinationRoute);
};

export const DestinationsEndpoints = {
	createDestination,
	deleteDestination,
	getDestination,
	listDestinations,
	searchDestinations,
	updateDestination,
} as const;
