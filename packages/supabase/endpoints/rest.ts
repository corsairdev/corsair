import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { restOperations } from './operation-groups/rest';

function getOperation(name: (typeof restOperations)[number]['name']) {
	const operation = restOperations.find((candidate) => candidate.name === name);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const getProjectPostgrestConfigOperation = getOperation(
	'getProjectPostgrestConfig',
);
export const getProjectPostgrestConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectPostgrestConfigOperation);
};

const updateProjectPostgrestConfigOperation = getOperation(
	'updateProjectPostgrestConfig',
);
export const updateProjectPostgrestConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		updateProjectPostgrestConfigOperation,
	);
};

export const RestEndpoints = {
	getProjectPostgrestConfig,
	updateProjectPostgrestConfig,
} as const;
