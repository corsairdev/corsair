import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const addListRowsRoute = getRoute('addListRows');
export const addListRows: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, addListRowsRoute);
};

const deleteListRowRoute = getRoute('deleteListRow');
export const deleteListRow: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, deleteListRowRoute);
};

const deleteListRowsRoute = getRoute('deleteListRows');
export const deleteListRows: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, deleteListRowsRoute);
};

const downloadListRowsRoute = getRoute('downloadListRows');
export const downloadListRows: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, downloadListRowsRoute);
};

const getListByIdRoute = getRoute('getListById');
export const getListById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getListByIdRoute);
};

const getListRowByIdRoute = getRoute('getListRowById');
export const getListRowById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getListRowByIdRoute);
};

const listsClearRowsRoute = getRoute('listsClearRows');
export const listsClearRows: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, listsClearRowsRoute);
};

const listsControllerCreateListRoute = getRoute('listsControllerCreateList');
export const listsControllerCreateList: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, listsControllerCreateListRoute);
};

const listsDeleteByIdRoute = getRoute('listsDeleteById');
export const listsDeleteById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, listsDeleteByIdRoute);
};

const listsDownloadRoute = getRoute('listsDownload');
export const listsDownload: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, listsDownloadRoute);
};

const listsGetAllRoute = getRoute('listsGetAll');
export const listsGetAll: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, listsGetAllRoute);
};

const listsGetRowsByIdRoute = getRoute('listsGetRowsById');
export const listsGetRowsById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, listsGetRowsByIdRoute);
};

const listsUpdateByIdRoute = getRoute('listsUpdateById');
export const listsUpdateById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, listsUpdateByIdRoute);
};

const listsUploadCsvRoute = getRoute('listsUploadCsv');
export const listsUploadCsv: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, listsUploadCsvRoute);
};

const updateListRowRoute = getRoute('updateListRow');
export const updateListRow: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, updateListRowRoute);
};

export const ListsEndpoints = {
	addListRows,
	deleteListRow,
	deleteListRows,
	downloadListRows,
	getListById,
	getListRowById,
	listsClearRows,
	listsControllerCreateList,
	listsDeleteById,
	listsDownload,
	listsGetAll,
	listsGetRowsById,
	listsUpdateById,
	listsUploadCsv,
	updateListRow,
} as const;
