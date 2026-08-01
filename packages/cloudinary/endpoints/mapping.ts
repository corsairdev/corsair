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

export const createUploadMapping: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('createUploadMapping'),
);

export const deleteUploadMapping: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('deleteUploadMapping'),
);

export const getUploadMappingDetails: CloudinaryEndpoint =
	createCloudinaryEndpoint(op('getUploadMappingDetails'));

export const updateUploadMapping: CloudinaryEndpoint = createCloudinaryEndpoint(
	op('updateUploadMapping'),
);
