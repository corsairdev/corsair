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

const getProfileRoute = getRoute('getProfile');
export const getProfile: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, getProfileRoute);
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
	getProfile,
	listProfiles,
	updateProfile,
} as const;
