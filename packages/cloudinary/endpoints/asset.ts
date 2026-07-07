import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const createAssetRelationsByAssetId: CloudinaryEndpoint = createCloudinaryEndpoint(op('createAssetRelationsByAssetId'));

export const createAssetRelationsByPublicId: CloudinaryEndpoint = createCloudinaryEndpoint(op('createAssetRelationsByPublicId'));

export const deleteAssetRelationsByAssetId: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteAssetRelationsByAssetId'));

export const deleteAssetRelationsByPublicId: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteAssetRelationsByPublicId'));

export const updateAssetMetadata: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateAssetMetadata'));

export const destroyAsset: CloudinaryEndpoint = createCloudinaryEndpoint(op('destroyAsset'));

export const destroyAssetById: CloudinaryEndpoint = createCloudinaryEndpoint(op('destroyAssetById'));

export const uploadAsset: CloudinaryEndpoint = createCloudinaryEndpoint(op('uploadAsset'));
