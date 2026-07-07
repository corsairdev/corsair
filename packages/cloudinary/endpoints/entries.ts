import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const deleteEntriesInMetadataFieldDatasource: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteEntriesInMetadataFieldDatasource'));

export const restoreEntriesInMetadataFieldDatasource: CloudinaryEndpoint = createCloudinaryEndpoint(op('restoreEntriesInMetadataFieldDatasource'));
