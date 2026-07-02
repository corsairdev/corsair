import { organizationsOperations } from '../operations/organizations';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof organizationsOperations)[number]['name']) {
	const operation = organizationsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const getOrganizationDefinition = getOperation('getOrganization');
export const getOrganization: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getOrganizationDefinition,
	);
	await syncNeonOperationResult(ctx, getOrganizationDefinition, input, result);
	await logNeonOperation(ctx, input, getOrganizationDefinition);
	return result;
};

const listOrgApiKeysDefinition = getOperation('listOrgApiKeys');
export const listOrgApiKeys: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listOrgApiKeysDefinition,
	);
	await syncNeonOperationResult(ctx, listOrgApiKeysDefinition, input, result);
	await logNeonOperation(ctx, input, listOrgApiKeysDefinition);
	return result;
};

const createOrgApiKeyDefinition = getOperation('createOrgApiKey');
export const createOrgApiKey: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createOrgApiKeyDefinition,
	);
	await syncNeonOperationResult(ctx, createOrgApiKeyDefinition, input, result);
	await logNeonOperation(ctx, input, createOrgApiKeyDefinition);
	return result;
};

const revokeOrgApiKeyDefinition = getOperation('revokeOrgApiKey');
export const revokeOrgApiKey: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		revokeOrgApiKeyDefinition,
	);
	await syncNeonOperationResult(ctx, revokeOrgApiKeyDefinition, input, result);
	await logNeonOperation(ctx, input, revokeOrgApiKeyDefinition);
	return result;
};

const getOrganizationMembersDefinition = getOperation('getOrganizationMembers');
export const getOrganizationMembers: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getOrganizationMembersDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getOrganizationMembersDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getOrganizationMembersDefinition);
	return result;
};

const getOrganizationMemberDefinition = getOperation('getOrganizationMember');
export const getOrganizationMember: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getOrganizationMemberDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getOrganizationMemberDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getOrganizationMemberDefinition);
	return result;
};

const updateOrganizationMemberDefinition = getOperation(
	'updateOrganizationMember',
);
export const updateOrganizationMember: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateOrganizationMemberDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateOrganizationMemberDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateOrganizationMemberDefinition);
	return result;
};

const removeOrganizationMemberDefinition = getOperation(
	'removeOrganizationMember',
);
export const removeOrganizationMember: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		removeOrganizationMemberDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		removeOrganizationMemberDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, removeOrganizationMemberDefinition);
	return result;
};

const getOrganizationInvitationsDefinition = getOperation(
	'getOrganizationInvitations',
);
export const getOrganizationInvitations: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getOrganizationInvitationsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getOrganizationInvitationsDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getOrganizationInvitationsDefinition);
	return result;
};

const createOrganizationInvitationsDefinition = getOperation(
	'createOrganizationInvitations',
);
export const createOrganizationInvitations: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createOrganizationInvitationsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createOrganizationInvitationsDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createOrganizationInvitationsDefinition);
	return result;
};

const transferProjectsFromOrgToOrgDefinition = getOperation(
	'transferProjectsFromOrgToOrg',
);
export const transferProjectsFromOrgToOrg: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		transferProjectsFromOrgToOrgDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		transferProjectsFromOrgToOrgDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, transferProjectsFromOrgToOrgDefinition);
	return result;
};

const transferProjectsFromUserToOrgDefinition = getOperation(
	'transferProjectsFromUserToOrg',
);
export const transferProjectsFromUserToOrg: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		transferProjectsFromUserToOrgDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		transferProjectsFromUserToOrgDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, transferProjectsFromUserToOrgDefinition);
	return result;
};

export const OrganizationsEndpoints = {
	getOrganization,
	listOrgApiKeys,
	createOrgApiKey,
	revokeOrgApiKey,
	getOrganizationMembers,
	getOrganizationMember,
	updateOrganizationMember,
	removeOrganizationMember,
	getOrganizationInvitations,
	createOrganizationInvitations,
	transferProjectsFromOrgToOrg,
	transferProjectsFromUserToOrg,
} as const;
