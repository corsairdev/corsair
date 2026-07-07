import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const deleteTransformation2: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteTransformation2'));

export const updateTransformation2: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateTransformation2'));
