import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const computeRealtimeUserRoute = getRoute('computeRealtimeUser');
export const computeRealtimeUser: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, computeRealtimeUserRoute);
};

const deleteUserProfileRoute = getRoute('deleteUserProfile');
export const deleteUserProfile: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteUserProfileRoute);
};

const getConfig2Route = getRoute('getConfig2');
export const getConfig2: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getConfig2Route);
};

const getUsersRoute = getRoute('getUsers');
export const getUsers: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getUsersRoute);
};

const setPersonalizationStrategyRoute = getRoute('setPersonalizationStrategy');
export const setPersonalizationStrategy: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, setPersonalizationStrategyRoute);
};

export const PersonalizationEndpoints = {
	computeRealtimeUser,
	deleteUserProfile,
	getConfig2,
	getUsers,
	setPersonalizationStrategy,
} as const;
