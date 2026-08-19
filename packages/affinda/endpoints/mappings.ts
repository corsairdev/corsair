import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createMappingRoute = getRoute('createMapping');
export const createMapping: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createMappingRoute);
};

const deleteMappingRoute = getRoute('deleteMapping');
export const deleteMapping: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteMappingRoute);
};

const getMappingRoute = getRoute('getMapping');
export const getMapping: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getMappingRoute);
};

const listMappingsRoute = getRoute('listMappings');
export const listMappings: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, listMappingsRoute);
};

const updateMappingRoute = getRoute('updateMapping');
export const updateMapping: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateMappingRoute);
};

export const MappingsEndpoints = {
	createMapping,
	deleteMapping,
	getMapping,
	listMappings,
	updateMapping,
} as const;
