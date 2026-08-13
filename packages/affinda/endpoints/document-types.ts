import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createDocumentTypeRoute = getRoute('createDocumentType');
export const createDocumentType: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createDocumentTypeRoute);
};

const deleteDocumentTypeRoute = getRoute('deleteDocumentType');
export const deleteDocumentType: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteDocumentTypeRoute);
};

const getDocumentTypeRoute = getRoute('getDocumentType');
export const getDocumentType: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDocumentTypeRoute);
};

const getDocumentTypeJsonSchemaRoute = getRoute('getDocumentTypeJsonSchema');
export const getDocumentTypeJsonSchema: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getDocumentTypeJsonSchemaRoute);
};

const getDocumentTypePydanticModelsRoute = getRoute(
	'getDocumentTypePydanticModels',
);
export const getDocumentTypePydanticModels: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(
		ctx,
		input,
		getDocumentTypePydanticModelsRoute,
	);
};

const getDocumentTypesRoute = getRoute('getDocumentTypes');
export const getDocumentTypes: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDocumentTypesRoute);
};

const updateDocumentTypeRoute = getRoute('updateDocumentType');
export const updateDocumentType: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateDocumentTypeRoute);
};

export const DocumentTypesEndpoints = {
	createDocumentType,
	deleteDocumentType,
	getDocumentType,
	getDocumentTypeJsonSchema,
	getDocumentTypePydanticModels,
	getDocumentTypes,
	updateDocumentType,
} as const;
