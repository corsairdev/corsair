import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createJobDescriptionSearchRoute = getRoute('createJobDescriptionSearch');
export const createJobDescriptionSearch: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createJobDescriptionSearchRoute);
};

const createJobDescriptionSearchEmbedUrlRoute = getRoute(
	'createJobDescriptionSearchEmbedUrl',
);
export const createJobDescriptionSearchEmbedUrl: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(
		ctx,
		input,
		createJobDescriptionSearchEmbedUrlRoute,
	);
};

const getJobDescriptionSearchConfigRoute = getRoute(
	'getJobDescriptionSearchConfig',
);
export const getJobDescriptionSearchConfig: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(
		ctx,
		input,
		getJobDescriptionSearchConfigRoute,
	);
};

const updateJobDescriptionSearchConfigRoute = getRoute(
	'updateJobDescriptionSearchConfig',
);
export const updateJobDescriptionSearchConfig: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(
		ctx,
		input,
		updateJobDescriptionSearchConfigRoute,
	);
};

export const JobDescriptionSearchEndpoints = {
	createJobDescriptionSearch,
	createJobDescriptionSearchEmbedUrl,
	getJobDescriptionSearchConfig,
	updateJobDescriptionSearchConfig,
} as const;
