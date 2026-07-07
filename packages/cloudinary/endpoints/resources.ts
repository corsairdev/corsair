import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const getResourcesByAssetFolder: CloudinaryEndpoint = createCloudinaryEndpoint(op('getResourcesByAssetFolder'));

export const getResourcesByContext: CloudinaryEndpoint = createCloudinaryEndpoint(op('getResourcesByContext'));

export const getResourcesInModeration: CloudinaryEndpoint = createCloudinaryEndpoint(op('getResourcesInModeration'));

export const listResourcesByAssetIds: CloudinaryEndpoint = createCloudinaryEndpoint(op('listResourcesByAssetIds'));

export const listResourcesByExternalIds: CloudinaryEndpoint = createCloudinaryEndpoint(op('listResourcesByExternalIds'));

export const listResourcesByTag: CloudinaryEndpoint = createCloudinaryEndpoint(op('listResourcesByTag'));

export const listResourcesByType: CloudinaryEndpoint = createCloudinaryEndpoint(op('listResourcesByType'));

export const publishResources: CloudinaryEndpoint = createCloudinaryEndpoint(op('publishResources'));

export const restoreResources: CloudinaryEndpoint = createCloudinaryEndpoint(op('restoreResources'));

export const restoreResourcesByAssetIds: CloudinaryEndpoint = createCloudinaryEndpoint(op('restoreResourcesByAssetIds'));

export const deleteResourcesByAssetId: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteResourcesByAssetId'));

export const deleteResourcesByPublicId: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteResourcesByPublicId'));

export const deleteResourcesByTags: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteResourcesByTags'));
