import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';
import { domainsOperations } from './operation-groups/domains';

function getOperation(name: (typeof domainsOperations)[number]['name']) {
	const operation = domainsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const activateVanitySubdomainOperation = getOperation(
	'activateVanitySubdomain',
);
export const activateVanitySubdomain: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		activateVanitySubdomainOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		activateVanitySubdomainOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, activateVanitySubdomainOperation);
	return result;
};

const activateCustomHostnameOperation = getOperation('activateCustomHostname');
export const activateCustomHostname: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		activateCustomHostnameOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		activateCustomHostnameOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, activateCustomHostnameOperation);
	return result;
};

const getProjectCustomHostnameConfigOperation = getOperation(
	'getProjectCustomHostnameConfig',
);
export const getProjectCustomHostnameConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectCustomHostnameConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectCustomHostnameConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		getProjectCustomHostnameConfigOperation,
	);
	return result;
};

const checkVanitySubdomainAvailabilityOperation = getOperation(
	'checkVanitySubdomainAvailability',
);
export const checkVanitySubdomainAvailability: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		checkVanitySubdomainAvailabilityOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		checkVanitySubdomainAvailabilityOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		checkVanitySubdomainAvailabilityOperation,
	);
	return result;
};

const deleteCustomHostnameConfigOperation = getOperation(
	'deleteCustomHostnameConfig',
);
export const deleteCustomHostnameConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteCustomHostnameConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deleteCustomHostnameConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, deleteCustomHostnameConfigOperation);
	return result;
};

const deleteProjectVanitySubdomainOperation = getOperation(
	'deleteProjectVanitySubdomain',
);
export const deleteProjectVanitySubdomain: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteProjectVanitySubdomainOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deleteProjectVanitySubdomainOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, deleteProjectVanitySubdomainOperation);
	return result;
};

const getVanitySubdomainConfigOperation = getOperation(
	'getVanitySubdomainConfig',
);
export const getVanitySubdomainConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getVanitySubdomainConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getVanitySubdomainConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getVanitySubdomainConfigOperation);
	return result;
};

const verifyCustomHostnameDnsOperation = getOperation(
	'verifyCustomHostnameDns',
);
export const verifyCustomHostnameDns: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		verifyCustomHostnameDnsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		verifyCustomHostnameDnsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, verifyCustomHostnameDnsOperation);
	return result;
};

const updateProjectCustomHostnameOperation = getOperation(
	'updateProjectCustomHostname',
);
export const updateProjectCustomHostname: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectCustomHostnameOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateProjectCustomHostnameOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateProjectCustomHostnameOperation);
	return result;
};

export const DomainsEndpoints = {
	activateVanitySubdomain,
	activateCustomHostname,
	getProjectCustomHostnameConfig,
	checkVanitySubdomainAvailability,
	deleteCustomHostnameConfig,
	deleteProjectVanitySubdomain,
	getVanitySubdomainConfig,
	verifyCustomHostnameDns,
	updateProjectCustomHostname,
} as const;
