import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const createUploadPreset: CloudinaryEndpoint = createCloudinaryEndpoint(op('createUploadPreset'));

export const deleteUploadPreset: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteUploadPreset'));

export const getUploadPreset: CloudinaryEndpoint = createCloudinaryEndpoint(op('getUploadPreset'));

export const updateUploadPreset: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateUploadPreset'));
