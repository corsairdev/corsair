import { analyticsOperations } from '../operations/analytics';
import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';

function getOperation(name: (typeof analyticsOperations)[number]['name']) {
	const operation = analyticsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const getProjectLogsOperation = getOperation('getProjectLogs');
export const getProjectLogs: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectLogsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectLogsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectLogsOperation);
	return result;
};

export const AnalyticsEndpoints = {
	getProjectLogs,
} as const;
