import { pagesOperations } from '../operations/pages';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof pagesOperations)[number]['name']) {
	const operation = pagesOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listPagesDefinition = getOperation('listPages');
export const listPages: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(ctx, input, listPagesDefinition);
	await syncWebflowOperationResult(ctx, listPagesDefinition, input, result);
	await logWebflowOperation(ctx, input, listPagesDefinition);
	return result;
};

const getPageDefinition = getOperation('getPage');
export const getPage: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(ctx, input, getPageDefinition);
	await syncWebflowOperationResult(ctx, getPageDefinition, input, result);
	await logWebflowOperation(ctx, input, getPageDefinition);
	return result;
};

const getPageDomDefinition = getOperation('getPageDom');
export const getPageDom: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getPageDomDefinition,
	);
	await syncWebflowOperationResult(ctx, getPageDomDefinition, input, result);
	await logWebflowOperation(ctx, input, getPageDomDefinition);
	return result;
};

const updatePageMetadataDefinition = getOperation('updatePageMetadata');
export const updatePageMetadata: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updatePageMetadataDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		updatePageMetadataDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, updatePageMetadataDefinition);
	return result;
};

export const PagesEndpoints = {
	listPages,
	getPage,
	getPageDom,
	updatePageMetadata,
} as const;
