import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';
import { advisorsOperations } from '../operations/advisors';

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
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getSecurityAdvisorsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getSecurityAdvisorsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getSecurityAdvisorsOperation);
	return result;
};

const getPerformanceAdvisorsOperation = getOperation('getPerformanceAdvisors');
export const getPerformanceAdvisors: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getPerformanceAdvisorsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getPerformanceAdvisorsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getPerformanceAdvisorsOperation);
	return result;
};

export const AdvisorsEndpoints = {
	getSecurityAdvisors,
	getPerformanceAdvisors,
} as const;
