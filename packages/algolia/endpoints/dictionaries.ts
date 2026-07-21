import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const getDictionaryLanguagesRoute = getRoute('getDictionaryLanguages');
export const getDictionaryLanguages: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getDictionaryLanguagesRoute);
};

const getDictionarySettingsRoute = getRoute('getDictionarySettings');
export const getDictionarySettings: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getDictionarySettingsRoute);
};

const searchDictionaryEntriesRoute = getRoute('searchDictionaryEntries');
export const searchDictionaryEntries: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, searchDictionaryEntriesRoute);
};

const setDictionarySettingsRoute = getRoute('setDictionarySettings');
export const setDictionarySettings: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, setDictionarySettingsRoute);
};

const updateDictionaryEntriesRoute = getRoute('updateDictionaryEntries');
export const updateDictionaryEntries: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, updateDictionaryEntriesRoute);
};

export const DictionariesEndpoints = {
	getDictionaryLanguages,
	getDictionarySettings,
	searchDictionaryEntries,
	setDictionarySettings,
	updateDictionaryEntries,
} as const;
