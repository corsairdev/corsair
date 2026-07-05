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

const createCampaignRoute = getRoute('createCampaign');
export const createCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createCampaignRoute);
	await logActiveTrailOperation(ctx, input, createCampaignRoute);
	return result;
};

const deleteTemplateRoute = getRoute('deleteTemplate');
export const deleteTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteTemplateRoute);
	await logActiveTrailOperation(ctx, input, deleteTemplateRoute);
	return result;
};

const deleteTemplatesTemplateCategoryRoute = getRoute('deleteTemplatesTemplateCategory');
export const deleteTemplatesTemplateCategory: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteTemplatesTemplateCategoryRoute);
	await logActiveTrailOperation(ctx, input, deleteTemplatesTemplateCategoryRoute);
	return result;
};

const getTemplateContentRoute = getRoute('getTemplateContent');
export const getTemplateContent: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getTemplateContentRoute);
	await logActiveTrailOperation(ctx, input, getTemplateContentRoute);
	return result;
};

const getTemplatesRoute = getRoute('getTemplates');
export const getTemplates: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getTemplatesRoute);
	await logActiveTrailOperation(ctx, input, getTemplatesRoute);
	return result;
};

const getTemplatesTemplateCategoryRoute = getRoute('getTemplatesTemplateCategory');
export const getTemplatesTemplateCategory: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getTemplatesTemplateCategoryRoute);
	await logActiveTrailOperation(ctx, input, getTemplatesTemplateCategoryRoute);
	return result;
};

const postTemplatesCampaignRoute = getRoute('postTemplatesCampaign');
export const postTemplatesCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, postTemplatesCampaignRoute);
	await logActiveTrailOperation(ctx, input, postTemplatesCampaignRoute);
	return result;
};

const postTemplatesTemplateCategoryRoute = getRoute('postTemplatesTemplateCategory');
export const postTemplatesTemplateCategory: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, postTemplatesTemplateCategoryRoute);
	await logActiveTrailOperation(ctx, input, postTemplatesTemplateCategoryRoute);
	return result;
};

const updateTemplateRoute = getRoute('updateTemplate');
export const updateTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateTemplateRoute);
	await logActiveTrailOperation(ctx, input, updateTemplateRoute);
	return result;
};

const updateTemplateCategoryRoute = getRoute('updateTemplateCategory');
export const updateTemplateCategory: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateTemplateCategoryRoute);
	await logActiveTrailOperation(ctx, input, updateTemplateCategoryRoute);
	return result;
};

const updateTemplateContentRoute = getRoute('updateTemplateContent');
export const updateTemplateContent: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateTemplateContentRoute);
	await logActiveTrailOperation(ctx, input, updateTemplateContentRoute);
	return result;
};

export const TemplatesEndpoints = {
	createCampaign,
	deleteTemplate,
	deleteTemplatesTemplateCategory,
	getTemplateContent,
	getTemplates,
	getTemplatesTemplateCategory,
	postTemplatesCampaign,
	postTemplatesTemplateCategory,
	updateTemplate,
	updateTemplateCategory,
	updateTemplateContent
} as const;
