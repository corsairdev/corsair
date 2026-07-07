import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const createFolder: CloudinaryEndpoint = createCloudinaryEndpoint(op('createFolder'));

export const deleteFolder: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteFolder'));

export const showFolder: CloudinaryEndpoint = createCloudinaryEndpoint(op('showFolder'));

export const updateFolder: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateFolder'));
