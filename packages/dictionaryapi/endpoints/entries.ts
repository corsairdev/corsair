import { logEventFromContext } from 'corsair/core';
import type { DictionaryApiEndpoints } from '..';
import { getEntry } from '../client';
import { GetEntryOutputSchema } from './types';

export const get: DictionaryApiEndpoints['entriesGet'] = async (ctx, input) => {
	const rawData = await getEntry(input.word, ctx.key);
	const response = GetEntryOutputSchema.parse(rawData);

	await logEventFromContext(
		ctx,
		'dictionaryapi.entries.get',
		{ word: input.word },
		'completed',
	);

	return response;
};
