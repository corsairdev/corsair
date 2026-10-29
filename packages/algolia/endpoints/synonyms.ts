import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const clearSynonymsRoute = getRoute('clearSynonyms');
export const clearSynonyms: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, clearSynonymsRoute);
};

const deleteSynonymRoute = getRoute('deleteSynonym');
export const deleteSynonym: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteSynonymRoute);
};

const getSynonymRoute = getRoute('getSynonym');
export const getSynonym: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getSynonymRoute);
};

const saveSynonymRoute = getRoute('saveSynonym');
export const saveSynonym: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, saveSynonymRoute);
};

const saveSynonymsRoute = getRoute('saveSynonyms');
export const saveSynonyms: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, saveSynonymsRoute);
};

const searchSynonymsRoute = getRoute('searchSynonyms');
export const searchSynonyms: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, searchSynonymsRoute);
};

export const SynonymsEndpoints = {
	clearSynonyms,
	deleteSynonym,
	getSynonym,
	saveSynonym,
	saveSynonyms,
	searchSynonyms,
} as const;
