import { cloudinaryOperations } from '../operations';
import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';

function op(name: string) {
	const operation = cloudinaryOperations.find(
		(candidate) => candidate.key === name,
	);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const getResourceByAssetId: CloudinaryEndpoint =
	createCloudinaryEndpoint(op('getResourceByAssetId'));

export const getResourceByPublicId: CloudinaryEndpoint =
	createCloudinaryEndpoint(op('getResourceByPublicId'));

export const listResourceTypes: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('listResourceTypes'),
);

export const explicitResource: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('explicitResource'),
);

export const explodeResource: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('explodeResource'),
);

export const renameResource: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('renameResource'),
);

export const updateResourceByAssetId: CloudinaryEndpoint =
	createCloudinaryEndpoint(op('updateResourceByAssetId'));

export const updateResourceByPublicId: CloudinaryEndpoint =
	createCloudinaryEndpoint(op('updateResourceByPublicId'));

export const updateResourceTags: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('updateResourceTags'),
);
