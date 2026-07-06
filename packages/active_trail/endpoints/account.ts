import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { executeActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[active_trail] missing route: ${name}`);
	}
	return route;
}

const contactGrowthRoute = getRoute('contactGrowth');
export const contactGrowth: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, contactGrowthRoute);
};

const createContentCategoryRoute = getRoute('createContentCategory');
export const createContentCategory: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, createContentCategoryRoute);
};

const deleteAccountContentCategoriesRoute = getRoute('deleteAccountContentCategories');
export const deleteAccountContentCategories: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, deleteAccountContentCategoriesRoute);
};

const getAccountBalanceRoute = getRoute('getAccountBalance');
export const getAccountBalance: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAccountBalanceRoute);
};

const getAccountContentCategories2Route = getRoute('getAccountContentCategories2');
export const getAccountContentCategories2: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAccountContentCategories2Route);
};

const getAccountIntegrationdataRoute = getRoute('getAccountIntegrationdata');
export const getAccountIntegrationdata: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAccountIntegrationdataRoute);
};

const getAccountMergeRoute = getRoute('getAccountMerge');
export const getAccountMerge: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAccountMergeRoute);
};

const getContactFieldsRoute = getRoute('getContactFields');
export const getContactFields: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getContactFieldsRoute);
};

const getContentCategoriesRoute = getRoute('getContentCategories');
export const getContentCategories: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getContentCategoriesRoute);
};

const getExecutiveReportRoute = getRoute('getExecutiveReport');
export const getExecutiveReport: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getExecutiveReportRoute);
};

const getTwoWaySmsRepliesRoute = getRoute('getTwoWaySmsReplies');
export const getTwoWaySmsReplies: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getTwoWaySmsRepliesRoute);
};

const putAccountContentCategoriesRoute = getRoute('putAccountContentCategories');
export const putAccountContentCategories: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, putAccountContentCategoriesRoute);
};

export const AccountEndpoints = {
	contactGrowth,
	createContentCategory,
	deleteAccountContentCategories,
	getAccountBalance,
	getAccountContentCategories2,
	getAccountIntegrationdata,
	getAccountMerge,
	getContactFields,
	getContentCategories,
	getExecutiveReport,
	getTwoWaySmsReplies,
	putAccountContentCategories
} as const;
