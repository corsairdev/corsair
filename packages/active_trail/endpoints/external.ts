import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error('[active_trail] missing route: ${name}');
	}
	return route;
}

const createSmsOperationalMessageRoute = getRoute('createSmsOperationalMessage');
export const createSmsOperationalMessage: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createSmsOperationalMessageRoute);
	await logActiveTrailOperation(ctx, input, createSmsOperationalMessageRoute);
	return result;
};

const deleteMailingListRoute = getRoute('deleteMailingList');
export const deleteMailingList: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteMailingListRoute);
	await logActiveTrailOperation(ctx, input, deleteMailingListRoute);
	return result;
};

const getExternalSchemaRoute = getRoute('getExternalSchema');
export const getExternalSchema: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getExternalSchemaRoute);
	await logActiveTrailOperation(ctx, input, getExternalSchemaRoute);
	return result;
};

const getSendingProfilesRoute = getRoute('getSendingProfiles');
export const getSendingProfiles: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSendingProfilesRoute);
	await logActiveTrailOperation(ctx, input, getSendingProfilesRoute);
	return result;
};

const getSmsSendingProfilesRoute = getRoute('getSmsSendingProfiles');
export const getSmsSendingProfiles: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsSendingProfilesRoute);
	await logActiveTrailOperation(ctx, input, getSmsSendingProfilesRoute);
	return result;
};

const removeExternalContactFromGroupRoute = getRoute('removeExternalContactFromGroup');
export const removeExternalContactFromGroup: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, removeExternalContactFromGroupRoute);
	await logActiveTrailOperation(ctx, input, removeExternalContactFromGroupRoute);
	return result;
};

const sendOperationalMessageRoute = getRoute('sendOperationalMessage');
export const sendOperationalMessage: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, sendOperationalMessageRoute);
	await logActiveTrailOperation(ctx, input, sendOperationalMessageRoute);
	return result;
};

const sendOperationalMessageEmailRoute = getRoute('sendOperationalMessageEmail');
export const sendOperationalMessageEmail: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, sendOperationalMessageEmailRoute);
	await logActiveTrailOperation(ctx, input, sendOperationalMessageEmailRoute);
	return result;
};

const updateContactRoute = getRoute('updateContact');
export const updateContact: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateContactRoute);
	await logActiveTrailOperation(ctx, input, updateContactRoute);
	return result;
};

export const ExternalEndpoints = {
	createSmsOperationalMessage,
	deleteMailingList,
	getExternalSchema,
	getSendingProfiles,
	getSmsSendingProfiles,
	removeExternalContactFromGroup,
	sendOperationalMessage,
	sendOperationalMessageEmail,
	updateContact
} as const;
