import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const createAuthenticationRoute = getRoute('createAuthentication');
export const createAuthentication: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, createAuthenticationRoute);
};

const deleteAuthenticationRoute = getRoute('deleteAuthentication');
export const deleteAuthentication: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, deleteAuthenticationRoute);
};

const getAuthenticationRoute = getRoute('getAuthentication');
export const getAuthentication: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getAuthenticationRoute);
};

const listAuthenticationsRoute = getRoute('listAuthentications');
export const listAuthentications: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listAuthenticationsRoute);
};

const searchAuthenticationsRoute = getRoute('searchAuthentications');
export const searchAuthentications: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, searchAuthenticationsRoute);
};

const updateAuthenticationRoute = getRoute('updateAuthentication');
export const updateAuthentication: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, updateAuthenticationRoute);
};

export const AuthenticationsEndpoints = {
	createAuthentication,
	deleteAuthentication,
	getAuthentication,
	listAuthentications,
	searchAuthentications,
	updateAuthentication,
} as const;
