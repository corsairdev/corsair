import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createDataSourceRoute = getRoute('createDataSource');
export const createDataSource: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createDataSourceRoute);
};

const createDataSourceValueRoute = getRoute('createDataSourceValue');
export const createDataSourceValue: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createDataSourceValueRoute);
};

const deleteDataSourceRoute = getRoute('deleteDataSource');
export const deleteDataSource: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteDataSourceRoute);
};

const deleteDataSourceValueRoute = getRoute('deleteDataSourceValue');
export const deleteDataSourceValue: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, deleteDataSourceValueRoute);
};

const getDataSourceRoute = getRoute('getDataSource');
export const getDataSource: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDataSourceRoute);
};

const getDataSourceValueRoute = getRoute('getDataSourceValue');
export const getDataSourceValue: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDataSourceValueRoute);
};

const getDataSourceValuesRoute = getRoute('getDataSourceValues');
export const getDataSourceValues: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDataSourceValuesRoute);
};

const listDataSourcesRoute = getRoute('listDataSources');
export const listDataSources: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, listDataSourcesRoute);
};

const replaceDataSourceValuesRoute = getRoute('replaceDataSourceValues');
export const replaceDataSourceValues: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, replaceDataSourceValuesRoute);
};

const updateDataSourceValueRoute = getRoute('updateDataSourceValue');
export const updateDataSourceValue: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, updateDataSourceValueRoute);
};

export const DataSourcesEndpoints = {
	createDataSource,
	createDataSourceValue,
	deleteDataSource,
	deleteDataSourceValue,
	getDataSource,
	getDataSourceValue,
	getDataSourceValues,
	listDataSources,
	replaceDataSourceValues,
	updateDataSourceValue,
} as const;
