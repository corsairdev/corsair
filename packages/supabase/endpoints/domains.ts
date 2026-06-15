import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
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
	return runSupabaseOperation(ctx, input, activateVanitySubdomainOperation);
};

const activateCustomHostnameOperation = getOperation('activateCustomHostname');
export const activateCustomHostname: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, activateCustomHostnameOperation);
};

const getProjectCustomHostnameConfigOperation = getOperation(
	'getProjectCustomHostnameConfig',
);
export const getProjectCustomHostnameConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		getProjectCustomHostnameConfigOperation,
	);
};

const checkVanitySubdomainAvailabilityOperation = getOperation(
	'checkVanitySubdomainAvailability',
);
export const checkVanitySubdomainAvailability: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		checkVanitySubdomainAvailabilityOperation,
	);
};

const deleteCustomHostnameConfigOperation = getOperation(
	'deleteCustomHostnameConfig',
);
export const deleteCustomHostnameConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, deleteCustomHostnameConfigOperation);
};

const deleteProjectVanitySubdomainOperation = getOperation(
	'deleteProjectVanitySubdomain',
);
export const deleteProjectVanitySubdomain: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		deleteProjectVanitySubdomainOperation,
	);
};

const getVanitySubdomainConfigOperation = getOperation(
	'getVanitySubdomainConfig',
);
export const getVanitySubdomainConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getVanitySubdomainConfigOperation);
};

const verifyCustomHostnameDnsOperation = getOperation(
	'verifyCustomHostnameDns',
);
export const verifyCustomHostnameDns: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, verifyCustomHostnameDnsOperation);
};

const updateProjectCustomHostnameOperation = getOperation(
	'updateProjectCustomHostname',
);
export const updateProjectCustomHostname: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateProjectCustomHostnameOperation);
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
