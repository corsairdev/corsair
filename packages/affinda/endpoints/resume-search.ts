import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createResumeSearchRoute = getRoute('createResumeSearch');
export const createResumeSearch: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createResumeSearchRoute);
};

const createResumeSearchEmbedUrlRoute = getRoute('createResumeSearchEmbedUrl');
export const createResumeSearchEmbedUrl: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createResumeSearchEmbedUrlRoute);
};

const listResumeSearchConfigRoute = getRoute('listResumeSearchConfig');
export const listResumeSearchConfig: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, listResumeSearchConfigRoute);
};

const listResumeSearchJobTitleSuggestionsRoute = getRoute(
	'listResumeSearchJobTitleSuggestions',
);
export const listResumeSearchJobTitleSuggestions: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(
		ctx,
		input,
		listResumeSearchJobTitleSuggestionsRoute,
	);
};

const listResumeSearchSkillSuggestionsRoute = getRoute(
	'listResumeSearchSkillSuggestions',
);
export const listResumeSearchSkillSuggestions: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(
		ctx,
		input,
		listResumeSearchSkillSuggestionsRoute,
	);
};

const updateResumeSearchConfigRoute = getRoute('updateResumeSearchConfig');
export const updateResumeSearchConfig: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, updateResumeSearchConfigRoute);
};

export const ResumeSearchEndpoints = {
	createResumeSearch,
	createResumeSearchEmbedUrl,
	listResumeSearchConfig,
	listResumeSearchJobTitleSuggestions,
	listResumeSearchSkillSuggestions,
	updateResumeSearchConfig,
} as const;
