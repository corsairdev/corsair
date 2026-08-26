import { sitesOperations } from '../operations/sites';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof sitesOperations)[number]['name']) {
	const operation = sitesOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listSitesDefinition = getOperation('listSites');
export const listSites: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(ctx, input, listSitesDefinition);
	await syncWebflowOperationResult(ctx, listSitesDefinition, input, result);
	await logWebflowOperation(ctx, input, listSitesDefinition);
	return result;
};

const getSiteDefinition = getOperation('getSite');
export const getSite: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(ctx, input, getSiteDefinition);
	await syncWebflowOperationResult(ctx, getSiteDefinition, input, result);
	await logWebflowOperation(ctx, input, getSiteDefinition);
	return result;
};

const updateSiteDefinition = getOperation('updateSite');
export const updateSite: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateSiteDefinition,
	);
	await syncWebflowOperationResult(ctx, updateSiteDefinition, input, result);
	await logWebflowOperation(ctx, input, updateSiteDefinition);
	return result;
};

const publishSiteDefinition = getOperation('publishSite');
export const publishSite: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		publishSiteDefinition,
	);
	await syncWebflowOperationResult(ctx, publishSiteDefinition, input, result);
	await logWebflowOperation(ctx, input, publishSiteDefinition);
	return result;
};

const getCustomDomainsDefinition = getOperation('getCustomDomains');
export const getCustomDomains: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getCustomDomainsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		getCustomDomainsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, getCustomDomainsDefinition);
	return result;
};

export const SitesEndpoints = {
	listSites,
	getSite,
	updateSite,
	publishSite,
	getCustomDomains,
} as const;
