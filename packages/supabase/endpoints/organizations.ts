import { organizationsOperations } from '../operations/organizations';
import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';

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
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createOrganizationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createOrganizationOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createOrganizationOperation);
	return result;
};

const getOrganizationOperation = getOperation('getOrganization');
export const getOrganization: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getOrganizationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getOrganizationOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getOrganizationOperation);
	return result;
};

const listAllOrganizationsOperation = getOperation('listAllOrganizations');
export const listAllOrganizations: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listAllOrganizationsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listAllOrganizationsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, listAllOrganizationsOperation);
	return result;
};

const listOrganizationMembersOperation = getOperation(
	'listOrganizationMembers',
);
export const listOrganizationMembers: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listOrganizationMembersOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listOrganizationMembersOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, listOrganizationMembersOperation);
	return result;
};

export const OrganizationsEndpoints = {
	createOrganization,
	getOrganization,
	listAllOrganizations,
	listOrganizationMembers,
} as const;
