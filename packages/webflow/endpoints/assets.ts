import { assetsOperations } from '../operations/assets';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof assetsOperations)[number]['name']) {
	const operation = assetsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listAssetsDefinition = getOperation('listAssets');
export const listAssets: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listAssetsDefinition,
	);
	await syncWebflowOperationResult(ctx, listAssetsDefinition, input, result);
	await logWebflowOperation(ctx, input, listAssetsDefinition);
	return result;
};

const uploadAssetDefinition = getOperation('uploadAsset');
export const uploadAsset: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		uploadAssetDefinition,
	);
	await syncWebflowOperationResult(ctx, uploadAssetDefinition, input, result);
	await logWebflowOperation(ctx, input, uploadAssetDefinition);
	return result;
};

const getAssetDefinition = getOperation('getAsset');
export const getAsset: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(ctx, input, getAssetDefinition);
	await syncWebflowOperationResult(ctx, getAssetDefinition, input, result);
	await logWebflowOperation(ctx, input, getAssetDefinition);
	return result;
};

const deleteAssetDefinition = getOperation('deleteAsset');
export const deleteAsset: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		deleteAssetDefinition,
	);
	await syncWebflowOperationResult(ctx, deleteAssetDefinition, input, result);
	await logWebflowOperation(ctx, input, deleteAssetDefinition);
	return result;
};

const listAssetFoldersDefinition = getOperation('listAssetFolders');
export const listAssetFolders: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listAssetFoldersDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		listAssetFoldersDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, listAssetFoldersDefinition);
	return result;
};

const createAssetFolderDefinition = getOperation('createAssetFolder');
export const createAssetFolder: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		createAssetFolderDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		createAssetFolderDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, createAssetFolderDefinition);
	return result;
};

const getAssetFolderDefinition = getOperation('getAssetFolder');
export const getAssetFolder: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getAssetFolderDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		getAssetFolderDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, getAssetFolderDefinition);
	return result;
};

export const AssetsEndpoints = {
	listAssets,
	uploadAsset,
	getAsset,
	deleteAsset,
	listAssetFolders,
	createAssetFolder,
	getAssetFolder,
} as const;
