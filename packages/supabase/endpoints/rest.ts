import { restOperations } from '../operations/rest';
import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';

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
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectPostgrestConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectPostgrestConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectPostgrestConfigOperation);
	return result;
};

const updateProjectPostgrestConfigOperation = getOperation(
	'updateProjectPostgrestConfig',
);
export const updateProjectPostgrestConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectPostgrestConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateProjectPostgrestConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateProjectPostgrestConfigOperation);
	return result;
};

export const RestEndpoints = {
	getProjectPostgrestConfig,
	updateProjectPostgrestConfig,
} as const;
