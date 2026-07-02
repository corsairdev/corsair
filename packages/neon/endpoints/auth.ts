import { authOperations } from '../operations/auth';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof authOperations)[number]['name']) {
	const operation = authOperations.find((candidate) => candidate.name === name);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const getAuthDetailsDefinition = getOperation('getAuthDetails');
export const getAuthDetails: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getAuthDetailsDefinition,
	);
	await syncNeonOperationResult(ctx, getAuthDetailsDefinition, input, result);
	await logNeonOperation(ctx, input, getAuthDetailsDefinition);
	return result;
};

const createNeonAuthDefinition = getOperation('createNeonAuth');
export const createNeonAuth: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createNeonAuthDefinition,
	);
	await syncNeonOperationResult(ctx, createNeonAuthDefinition, input, result);
	await logNeonOperation(ctx, input, createNeonAuthDefinition);
	return result;
};

const disableNeonAuthDefinition = getOperation('disableNeonAuth');
export const disableNeonAuth: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		disableNeonAuthDefinition,
	);
	await syncNeonOperationResult(ctx, disableNeonAuthDefinition, input, result);
	await logNeonOperation(ctx, input, disableNeonAuthDefinition);
	return result;
};

const listBranchNeonAuthTrustedDomainsDefinition = getOperation(
	'listBranchNeonAuthTrustedDomains',
);
export const listBranchNeonAuthTrustedDomains: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listBranchNeonAuthTrustedDomainsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listBranchNeonAuthTrustedDomainsDefinition,
		input,
		result,
	);
	await logNeonOperation(
		ctx,
		input,
		listBranchNeonAuthTrustedDomainsDefinition,
	);
	return result;
};

const deleteBranchNeonAuthTrustedDomainDefinition = getOperation(
	'deleteBranchNeonAuthTrustedDomain',
);
export const deleteBranchNeonAuthTrustedDomain: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteBranchNeonAuthTrustedDomainDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteBranchNeonAuthTrustedDomainDefinition,
		input,
		result,
	);
	await logNeonOperation(
		ctx,
		input,
		deleteBranchNeonAuthTrustedDomainDefinition,
	);
	return result;
};

const deleteNeonAuthDomainFromRedirectURIWhitelistDefinition = getOperation(
	'deleteNeonAuthDomainFromRedirectURIWhitelist',
);
export const deleteNeonAuthDomainFromRedirectURIWhitelist: NeonEndpoint =
	async (ctx, input = {}) => {
		const result = await requestNeonOperation(
			ctx,
			input,
			deleteNeonAuthDomainFromRedirectURIWhitelistDefinition,
		);
		await syncNeonOperationResult(
			ctx,
			deleteNeonAuthDomainFromRedirectURIWhitelistDefinition,
			input,
			result,
		);
		await logNeonOperation(
			ctx,
			input,
			deleteNeonAuthDomainFromRedirectURIWhitelistDefinition,
		);
		return result;
	};

const createNeonAuthProviderSDKKeysDefinition = getOperation(
	'createNeonAuthProviderSDKKeys',
);
export const createNeonAuthProviderSDKKeys: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createNeonAuthProviderSDKKeysDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createNeonAuthProviderSDKKeysDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createNeonAuthProviderSDKKeysDefinition);
	return result;
};

const createBranchNeonAuthNewUserDefinition = getOperation(
	'createBranchNeonAuthNewUser',
);
export const createBranchNeonAuthNewUser: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createBranchNeonAuthNewUserDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createBranchNeonAuthNewUserDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createBranchNeonAuthNewUserDefinition);
	return result;
};

const deleteBranchNeonAuthUserDefinition = getOperation(
	'deleteBranchNeonAuthUser',
);
export const deleteBranchNeonAuthUser: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteBranchNeonAuthUserDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteBranchNeonAuthUserDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteBranchNeonAuthUserDefinition);
	return result;
};

const listNeonAuthOauthProvidersDefinition = getOperation(
	'listNeonAuthOauthProviders',
);
export const listNeonAuthOauthProviders: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listNeonAuthOauthProvidersDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listNeonAuthOauthProvidersDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listNeonAuthOauthProvidersDefinition);
	return result;
};

const listBranchNeonAuthOauthProvidersDefinition = getOperation(
	'listBranchNeonAuthOauthProviders',
);
export const listBranchNeonAuthOauthProviders: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listBranchNeonAuthOauthProvidersDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listBranchNeonAuthOauthProvidersDefinition,
		input,
		result,
	);
	await logNeonOperation(
		ctx,
		input,
		listBranchNeonAuthOauthProvidersDefinition,
	);
	return result;
};

const updateNeonAuthOauthProviderDefinition = getOperation(
	'updateNeonAuthOauthProvider',
);
export const updateNeonAuthOauthProvider: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateNeonAuthOauthProviderDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateNeonAuthOauthProviderDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateNeonAuthOauthProviderDefinition);
	return result;
};

const deleteBranchNeonAuthOauthProviderDefinition = getOperation(
	'deleteBranchNeonAuthOauthProvider',
);
export const deleteBranchNeonAuthOauthProvider: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteBranchNeonAuthOauthProviderDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteBranchNeonAuthOauthProviderDefinition,
		input,
		result,
	);
	await logNeonOperation(
		ctx,
		input,
		deleteBranchNeonAuthOauthProviderDefinition,
	);
	return result;
};

const getNeonAuthEmailProviderDefinition = getOperation(
	'getNeonAuthEmailProvider',
);
export const getNeonAuthEmailProvider: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getNeonAuthEmailProviderDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getNeonAuthEmailProviderDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getNeonAuthEmailProviderDefinition);
	return result;
};

const updateNeonAuthEmailProviderDefinition = getOperation(
	'updateNeonAuthEmailProvider',
);
export const updateNeonAuthEmailProvider: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateNeonAuthEmailProviderDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateNeonAuthEmailProviderDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateNeonAuthEmailProviderDefinition);
	return result;
};

const sendNeonAuthTestEmailDefinition = getOperation('sendNeonAuthTestEmail');
export const sendNeonAuthTestEmail: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		sendNeonAuthTestEmailDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		sendNeonAuthTestEmailDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, sendNeonAuthTestEmailDefinition);
	return result;
};

const getNeonAuthAllowLocalhostDefinition = getOperation(
	'getNeonAuthAllowLocalhost',
);
export const getNeonAuthAllowLocalhost: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getNeonAuthAllowLocalhostDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getNeonAuthAllowLocalhostDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getNeonAuthAllowLocalhostDefinition);
	return result;
};

const updateNeonAuthAllowLocalhostDefinition = getOperation(
	'updateNeonAuthAllowLocalhost',
);
export const updateNeonAuthAllowLocalhost: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateNeonAuthAllowLocalhostDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateNeonAuthAllowLocalhostDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateNeonAuthAllowLocalhostDefinition);
	return result;
};

export const AuthEndpoints = {
	getAuthDetails,
	createNeonAuth,
	disableNeonAuth,
	listBranchNeonAuthTrustedDomains,
	deleteBranchNeonAuthTrustedDomain,
	deleteNeonAuthDomainFromRedirectURIWhitelist,
	createNeonAuthProviderSDKKeys,
	createBranchNeonAuthNewUser,
	deleteBranchNeonAuthUser,
	listNeonAuthOauthProviders,
	listBranchNeonAuthOauthProviders,
	updateNeonAuthOauthProvider,
	deleteBranchNeonAuthOauthProvider,
	getNeonAuthEmailProvider,
	updateNeonAuthEmailProvider,
	sendNeonAuthTestEmail,
	getNeonAuthAllowLocalhost,
	updateNeonAuthAllowLocalhost,
} as const;
