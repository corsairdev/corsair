import { logEventFromContext } from 'corsair/core';
import {
	buildAudioUrl,
	etymologyTexts,
	lookupWord,
	resolveDictionaryReference,
} from '../client';
import type { DictionaryEndpoints } from '../index';
import type { DictionaryEntry, MWRawEntry } from './types';
import {
	DictionaryEndpointInputSchemas,
	DictionaryEndpointOutputSchemas,
	MWLookupResponseSchema,
} from './types';

function toDictionaryEntry(entry: MWRawEntry): DictionaryEntry {
	const pronunciation = entry.hwi?.prs?.[0];
	const etymology = etymologyTexts(entry.et);
	return {
		id: entry.meta.id,
		headword: entry.hwi?.hw ?? entry.meta.id,
		partOfSpeech: entry.fl,
		pronunciation: pronunciation?.mw,
		audioUrl: pronunciation?.sound
			? buildAudioUrl(pronunciation.sound.audio)
			: undefined,
		shortDefinitions: entry.shortdef,
		etymology: etymology.length > 0 ? etymology : undefined,
		stems: entry.meta.stems,
		offensive: entry.meta.offensive,
	};
}

async function cacheEntries(
	ctx: Parameters<DictionaryEndpoints['wordsGet']>[0],
	reference: string,
	rawEntries: MWRawEntry[],
	mapped: DictionaryEntry[],
): Promise<void> {
	if (!ctx.db?.entries) {
		return;
	}
	for (let i = 0; i < rawEntries.length; i++) {
		const raw = rawEntries[i]!;
		const mappedEntry = mapped[i]!;
		const entityId = `${reference}:${raw.meta.uuid ?? raw.meta.id}`;
		try {
			await ctx.db.entries.upsertByEntityId(entityId, {
				id: raw.meta.id,
				uuid: raw.meta.uuid,
				src: raw.meta.src,
				section: raw.meta.section,
				stems: raw.meta.stems,
				offensive: raw.meta.offensive,
				hw: mappedEntry.headword,
				fl: raw.fl,
				shortdef: raw.shortdef,
				et: mappedEntry.etymology,
				date: raw.date,
				mw: mappedEntry.pronunciation,
				audioUrl: mappedEntry.audioUrl,
				captured_at: new Date(),
			});
		} catch (error) {
			console.warn(`[dictionary] Failed to cache entry ${entityId}:`, error);
		}
	}
}

export const get: DictionaryEndpoints['wordsGet'] = async (ctx, rawInput) => {
	const input = DictionaryEndpointInputSchemas.wordsGet.parse(rawInput);
	const reference = resolveDictionaryReference(ctx.options.reference);

	const raw = await lookupWord(input.word, ctx.key, reference);
	const parsed = MWLookupResponseSchema.parse(raw);

	const suggestions = parsed.filter(
		(item): item is string => typeof item === 'string',
	);
	const rawEntries = parsed.filter(
		(item): item is MWRawEntry => typeof item !== 'string',
	);
	const entries = rawEntries.map(toDictionaryEntry);

	await cacheEntries(ctx, reference, rawEntries, entries);

	await logEventFromContext(
		ctx,
		'dictionary.words.get',
		{ word: input.word },
		'completed',
	);

	return DictionaryEndpointOutputSchemas.wordsGet.parse({
		found: entries.length > 0,
		entries,
		suggestions,
	});
};
