import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { advisorsOperations } from './operation-groups/advisors';

function getOperation(name: (typeof advisorsOperations)[number]['name']) {
	const operation = advisorsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const getSecurityAdvisorsOperation = getOperation('getSecurityAdvisors');
export const getSecurityAdvisors: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getSecurityAdvisorsOperation);
};

const getPerformanceAdvisorsOperation = getOperation('getPerformanceAdvisors');
export const getPerformanceAdvisors: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getPerformanceAdvisorsOperation);
};

export const AdvisorsEndpoints = {
	getSecurityAdvisors,
	getPerformanceAdvisors,
} as const;
