import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createDataPointRoute = getRoute('createDataPoint');
export const createDataPoint: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createDataPointRoute);
};

const deleteDataPointRoute = getRoute('deleteDataPoint');
export const deleteDataPoint: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteDataPointRoute);
};

const getDataPointRoute = getRoute('getDataPoint');
export const getDataPoint: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDataPointRoute);
};

const listDataPointsRoute = getRoute('listDataPoints');
export const listDataPoints: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, listDataPointsRoute);
};

const updateDataPointRoute = getRoute('updateDataPoint');
export const updateDataPoint: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateDataPointRoute);
};

export const DataPointsEndpoints = {
	createDataPoint,
	deleteDataPoint,
	getDataPoint,
	listDataPoints,
	updateDataPoint,
} as const;
