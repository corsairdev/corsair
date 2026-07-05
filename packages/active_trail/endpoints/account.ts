import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[active_trail] missing route: ${name}`);
	}
	return route;
}

const contactGrowthRoute = getRoute('contactGrowth');
export const contactGrowth: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, contactGrowthRoute);
	await logActiveTrailOperation(ctx, input, contactGrowthRoute);
	return result;
};

const createContentCategoryRoute = getRoute('createContentCategory');
export const createContentCategory: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createContentCategoryRoute);
	await logActiveTrailOperation(ctx, input, createContentCategoryRoute);
	return result;
};

const deleteAccountContentCategoriesRoute = getRoute('deleteAccountContentCategories');
export const deleteAccountContentCategories: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteAccountContentCategoriesRoute);
	await logActiveTrailOperation(ctx, input, deleteAccountContentCategoriesRoute);
	return result;
};

const getAccountBalanceRoute = getRoute('getAccountBalance');
export const getAccountBalance: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAccountBalanceRoute);
	await logActiveTrailOperation(ctx, input, getAccountBalanceRoute);
	return result;
};

const getAccountContentCategories2Route = getRoute('getAccountContentCategories2');
export const getAccountContentCategories2: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAccountContentCategories2Route);
	await logActiveTrailOperation(ctx, input, getAccountContentCategories2Route);
	return result;
};

const getAccountIntegrationdataRoute = getRoute('getAccountIntegrationdata');
export const getAccountIntegrationdata: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAccountIntegrationdataRoute);
	await logActiveTrailOperation(ctx, input, getAccountIntegrationdataRoute);
	return result;
};

const getAccountMergeRoute = getRoute('getAccountMerge');
export const getAccountMerge: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAccountMergeRoute);
	await logActiveTrailOperation(ctx, input, getAccountMergeRoute);
	return result;
};

const getContactFieldsRoute = getRoute('getContactFields');
export const getContactFields: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContactFieldsRoute);
	await logActiveTrailOperation(ctx, input, getContactFieldsRoute);
	return result;
};

const getContentCategoriesRoute = getRoute('getContentCategories');
export const getContentCategories: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getContentCategoriesRoute);
	await logActiveTrailOperation(ctx, input, getContentCategoriesRoute);
	return result;
};

const getExecutiveReportRoute = getRoute('getExecutiveReport');
export const getExecutiveReport: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getExecutiveReportRoute);
	await logActiveTrailOperation(ctx, input, getExecutiveReportRoute);
	return result;
};

const getTwoWaySmsRepliesRoute = getRoute('getTwoWaySmsReplies');
export const getTwoWaySmsReplies: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getTwoWaySmsRepliesRoute);
	await logActiveTrailOperation(ctx, input, getTwoWaySmsRepliesRoute);
	return result;
};

const putAccountContentCategoriesRoute = getRoute('putAccountContentCategories');
export const putAccountContentCategories: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, putAccountContentCategoriesRoute);
	await logActiveTrailOperation(ctx, input, putAccountContentCategoriesRoute);
	return result;
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
