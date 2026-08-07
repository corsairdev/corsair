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

const createSmsOperationalMessageRoute = getRoute(
	'createSmsOperationalMessage',
);
export const createSmsOperationalMessage: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		createSmsOperationalMessageRoute,
	);
};

const deleteMailingListRoute = getRoute('deleteMailingList');
export const deleteMailingList: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, deleteMailingListRoute);
};

const getExternalSchemaRoute = getRoute('getExternalSchema');
export const getExternalSchema: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getExternalSchemaRoute);
};

const getSendingProfilesRoute = getRoute('getSendingProfiles');
export const getSendingProfiles: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSendingProfilesRoute);
};

const getSmsSendingProfilesRoute = getRoute('getSmsSendingProfiles');
export const getSmsSendingProfiles: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmsSendingProfilesRoute);
};

const removeExternalContactFromGroupRoute = getRoute(
	'removeExternalContactFromGroup',
);
export const removeExternalContactFromGroup: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		removeExternalContactFromGroupRoute,
	);
};

const sendOperationalMessageRoute = getRoute('sendOperationalMessage');
export const sendOperationalMessage: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, sendOperationalMessageRoute);
};

const sendOperationalMessageEmailRoute = getRoute(
	'sendOperationalMessageEmail',
);
export const sendOperationalMessageEmail: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		sendOperationalMessageEmailRoute,
	);
};

const updateContactRoute = getRoute('updateContact');
export const updateContact: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, updateContactRoute);
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
	updateContact,
} as const;
