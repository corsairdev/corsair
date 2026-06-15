import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { storageOperations } from './operation-groups/storage';

function getOperation(name: (typeof storageOperations)[number]['name']) {
	const operation = storageOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const getResumableUploadBaseOptionsOperation = getOperation(
	'getResumableUploadBaseOptions',
);
export const getResumableUploadBaseOptions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		getResumableUploadBaseOptionsOperation,
	);
};

const getResumableUploadOptionsOperation = getOperation(
	'getResumableUploadOptions',
);
export const getResumableUploadOptions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getResumableUploadOptionsOperation);
};

const listBucketsOperation = getOperation('listBuckets');
export const listBuckets: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listBucketsOperation);
};

const handleResumableUploadSignOptionsWithIdOperation = getOperation(
	'handleResumableUploadSignOptionsWithId',
);
export const handleResumableUploadSignOptionsWithId: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		handleResumableUploadSignOptionsWithIdOperation,
	);
};

const handleResumableUploadSignOptionsOperation = getOperation(
	'handleResumableUploadSignOptions',
);
export const handleResumableUploadSignOptions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		handleResumableUploadSignOptionsOperation,
	);
};

export const StorageEndpoints = {
	getResumableUploadBaseOptions,
	getResumableUploadOptions,
	listBuckets,
	handleResumableUploadSignOptionsWithId,
	handleResumableUploadSignOptions,
} as const;
