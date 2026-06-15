import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { analyticsOperations } from './operation-groups/analytics';

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
	return runSupabaseOperation(ctx, input, getProjectLogsOperation);
};

export const AnalyticsEndpoints = {
	getProjectLogs,
} as const;
