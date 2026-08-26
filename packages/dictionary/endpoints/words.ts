import { logEventFromContext } from 'corsair/core';
import { buildAudioUrl, lookupWord } from '../client';
import type { DictionaryEndpoints } from '../index';
import type { DictionaryEntry, MWRawEntry } from './types';
import { MWLookupResponseSchema } from './types';

function toDictionaryEntry(entry: MWRawEntry): DictionaryEntry {
	const pronunciation = entry.hwi?.prs?.[0];
	return {
		id: entry.meta.id,
		headword: entry.hwi?.hw ?? entry.meta.id,
		partOfSpeech: entry.fl,
		pronunciation: pronunciation?.mw,
		audioUrl: pronunciation?.sound
			? buildAudioUrl(pronunciation.sound.audio)
			: undefined,
		shortDefinitions: entry.shortdef,
		stems: entry.meta.stems,
		offensive: entry.meta.offensive,
	};
}

export const get: DictionaryEndpoints['wordsGet'] = async (ctx, input) => {
	const raw = await lookupWord(input.word, ctx.key);
	const parsed = MWLookupResponseSchema.parse(raw);

	const suggestions = parsed.filter(
		(item): item is string => typeof item === 'string',
	);
	const entries = parsed
		.filter((item): item is MWRawEntry => typeof item !== 'string')
		.map(toDictionaryEntry);

	await logEventFromContext(
		ctx,
		'dictionary.words.get',
		{ word: input.word },
		'completed',
	);

	return {
		found: entries.length > 0,
		entries,
		suggestions,
	};
};
