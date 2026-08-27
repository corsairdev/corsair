import type { TextrazorEndpoints } from '../index';
import { textrazorCall } from './call';
import {
	AddDictionaryEntriesInputSchema,
	AddDictionaryEntriesOutputSchema,
	CreateDictionaryInputSchema,
	CreateDictionaryOutputSchema,
	DeleteDictionaryEntryInputSchema,
	DeleteDictionaryEntryOutputSchema,
	DeleteDictionaryInputSchema,
	DeleteDictionaryOutputSchema,
	GetDictionaryEntryInputSchema,
	GetDictionaryEntryOutputSchema,
	GetDictionaryInputSchema,
	GetDictionaryOutputSchema,
	ListDictionariesInputSchema,
	ListDictionariesOutputSchema,
	ListDictionaryEntriesInputSchema,
	ListDictionaryEntriesOutputSchema,
} from './types';

function dictionaryPath(id: string): string {
	return `entities/${encodeURIComponent(id)}`;
}

export const create: TextrazorEndpoints['createDictionary'] = async (
	ctx,
	input,
) => {
	const parsed = CreateDictionaryInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.create',
		dictionaryPath(parsed.id),
		'PUT',
		parsed,
		{
			json: {
				matchType: parsed.matchType,
				caseInsensitive: parsed.caseInsensitive,
				language: parsed.language,
			},
		},
	);
	const output = CreateDictionaryOutputSchema.parse(result);
	try {
		await ctx.db.dictionaries.upsertByEntityId(parsed.id, {
			id: parsed.id,
			matchType: parsed.matchType,
			caseInsensitive: parsed.caseInsensitive,
			language: parsed.language,
			fetchedAt: new Date(),
		});
	} catch (error) {
		console.warn('[textrazor] Failed to cache dictionary:', error);
	}
	return output;
};

export const list: TextrazorEndpoints['listDictionaries'] = async (
	ctx,
	input,
) => {
	const parsed = ListDictionariesInputSchema.parse(input ?? {});
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.list',
		'entities/',
		'GET',
		parsed,
	);
	return ListDictionariesOutputSchema.parse(result);
};

export const get: TextrazorEndpoints['getDictionary'] = async (ctx, input) => {
	const parsed = GetDictionaryInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.get',
		dictionaryPath(parsed.id),
		'GET',
		parsed,
	);
	return GetDictionaryOutputSchema.parse(result);
};

export const remove: TextrazorEndpoints['deleteDictionary'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteDictionaryInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.delete',
		dictionaryPath(parsed.id),
		'DELETE',
		parsed,
	);
	return DeleteDictionaryOutputSchema.parse(result);
};

export const listEntries: TextrazorEndpoints['listDictionaryEntries'] = async (
	ctx,
	input,
) => {
	const parsed = ListDictionaryEntriesInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.listEntries',
		`${dictionaryPath(parsed.id)}/_all`,
		'GET',
		parsed,
		{
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
			},
		},
	);
	return ListDictionaryEntriesOutputSchema.parse(result);
};

export const addEntries: TextrazorEndpoints['addDictionaryEntries'] = async (
	ctx,
	input,
) => {
	const parsed = AddDictionaryEntriesInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.addEntries',
		`${dictionaryPath(parsed.id)}/`,
		'POST',
		parsed,
		{ json: parsed.entries },
	);
	return AddDictionaryEntriesOutputSchema.parse(result);
};

export const getEntry: TextrazorEndpoints['getDictionaryEntry'] = async (
	ctx,
	input,
) => {
	const parsed = GetDictionaryEntryInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.getEntry',
		`${dictionaryPath(parsed.id)}/${encodeURIComponent(parsed.entryId)}`,
		'GET',
		parsed,
	);
	return GetDictionaryEntryOutputSchema.parse(result);
};

export const deleteEntry: TextrazorEndpoints['deleteDictionaryEntry'] = async (
	ctx,
	input,
) => {
	const parsed = DeleteDictionaryEntryInputSchema.parse(input);
	const result = await textrazorCall(
		ctx,
		'textrazor.dictionaries.deleteEntry',
		`${dictionaryPath(parsed.id)}/${encodeURIComponent(parsed.entryId)}`,
		'DELETE',
		parsed,
	);
	return DeleteDictionaryEntryOutputSchema.parse(result);
};
