import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const createProfileRoute = getRoute('createProfile');
export const createProfile: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, createProfileRoute);
};

const deleteProfileRoute = getRoute('deleteProfile');
export const deleteProfile: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, deleteProfileRoute);
};

const getProfile2Route = getRoute('getProfile2');
export const getProfile2: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, getProfile2Route);
};

const listProfilesRoute = getRoute('listProfiles');
export const listProfiles: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, listProfilesRoute);
};

const updateProfileRoute = getRoute('updateProfile');
export const updateProfile: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, updateProfileRoute);
};

export const ProfilesEndpoints = {
	createProfile,
	deleteProfile,
	getProfile2,
	listProfiles,
	updateProfile
} as const;
