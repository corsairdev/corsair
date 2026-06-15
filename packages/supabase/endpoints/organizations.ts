import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { organizationsOperations } from './operation-groups/organizations';

function getOperation(name: (typeof organizationsOperations)[number]['name']) {
	const operation = organizationsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const createOrganizationOperation = getOperation('createOrganization');
export const createOrganization: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createOrganizationOperation);
};

const getOrganizationOperation = getOperation('getOrganization');
export const getOrganization: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getOrganizationOperation);
};

const listAllOrganizationsOperation = getOperation('listAllOrganizations');
export const listAllOrganizations: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, listAllOrganizationsOperation);
};

const listOrganizationMembersOperation = getOperation(
	'listOrganizationMembers',
);
export const listOrganizationMembers: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, listOrganizationMembersOperation);
};

export const OrganizationsEndpoints = {
	createOrganization,
	getOrganization,
	listAllOrganizations,
	listOrganizationMembers,
} as const;
