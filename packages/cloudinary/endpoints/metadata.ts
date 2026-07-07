import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const createMetadataField: CloudinaryEndpoint = createCloudinaryEndpoint(op('createMetadataField'));

export const createMetadataRule: CloudinaryEndpoint = createCloudinaryEndpoint(op('createMetadataRule'));

export const deleteMetadataField: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteMetadataField'));

export const deleteMetadataRule: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteMetadataRule'));

export const getMetadataFieldById: CloudinaryEndpoint = createCloudinaryEndpoint(op('getMetadataFieldById'));

export const listMetadataFields: CloudinaryEndpoint = createCloudinaryEndpoint(op('listMetadataFields'));

export const listMetadataRules: CloudinaryEndpoint = createCloudinaryEndpoint(op('listMetadataRules'));

export const orderMetadataFieldDatasource: CloudinaryEndpoint = createCloudinaryEndpoint(op('orderMetadataFieldDatasource'));

export const reorderMetadataField: CloudinaryEndpoint = createCloudinaryEndpoint(op('reorderMetadataField'));

export const reorderMetadataFields: CloudinaryEndpoint = createCloudinaryEndpoint(op('reorderMetadataFields'));

export const searchMetadataFieldDatasource: CloudinaryEndpoint = createCloudinaryEndpoint(op('searchMetadataFieldDatasource'));

export const updateMetadataField: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateMetadataField'));

export const updateMetadataFieldDatasource: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateMetadataFieldDatasource'));

export const updateMetadataRule: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateMetadataRule'));
