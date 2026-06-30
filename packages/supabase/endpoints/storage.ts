import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';
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
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getResumableUploadBaseOptionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getResumableUploadBaseOptionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		getResumableUploadBaseOptionsOperation,
	);
	return result;
};

const getResumableUploadOptionsOperation = getOperation(
	'getResumableUploadOptions',
);
export const getResumableUploadOptions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getResumableUploadOptionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getResumableUploadOptionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getResumableUploadOptionsOperation);
	return result;
};

const listBucketsOperation = getOperation('listBuckets');
export const listBuckets: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listBucketsOperation,
	);
	await syncSupabaseOperationResult(ctx, listBucketsOperation, input, result);
	await logSupabaseOperation(ctx, input, listBucketsOperation);
	return result;
};

const handleResumableUploadSignOptionsWithIdOperation = getOperation(
	'handleResumableUploadSignOptionsWithId',
);
export const handleResumableUploadSignOptionsWithId: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		handleResumableUploadSignOptionsWithIdOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		handleResumableUploadSignOptionsWithIdOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		handleResumableUploadSignOptionsWithIdOperation,
	);
	return result;
};

const handleResumableUploadSignOptionsOperation = getOperation(
	'handleResumableUploadSignOptions',
);
export const handleResumableUploadSignOptions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		handleResumableUploadSignOptionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		handleResumableUploadSignOptionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		handleResumableUploadSignOptionsOperation,
	);
	return result;
};

export const StorageEndpoints = {
	getResumableUploadBaseOptions,
	getResumableUploadOptions,
	listBuckets,
	handleResumableUploadSignOptionsWithId,
	handleResumableUploadSignOptions,
} as const;
