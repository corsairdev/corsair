import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Natural language: sentiment, similarity, embeddings and lexical lookups.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Returns sentiment analysis score and overall sentiment for a given block
 * of text.
 */
export const sentiment: ApiNinjasEndpoints['textSentiment'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textSentiment']
	>('sentiment', ctx.key, {
		version: 'v1',
		query: {
			text: input.text,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.sentiment',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns a similarity score between 0 and 1 (1 is similar and 0 is
 * dissimilar) of two given texts.
 */
export const similarity: ApiNinjasEndpoints['textSimilarity'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textSimilarity']
	>('textsimilarity', ctx.key, {
		version: 'v1',
		method: 'POST',
		body: {
			text_1: input.text_1,
			text_2: input.text_2,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.similarity',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns a 768-dimensional vector as an array that encodes the meaning of
 * any given input text.
 */
export const embeddings: ApiNinjasEndpoints['textEmbeddings'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textEmbeddings']
	>('embeddings', ctx.key, {
		version: 'v1',
		method: 'POST',
		body: {
			text: input.text,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.embeddings',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns the language name and 2-letter ISO language code for a given
 * block of text string.
 */
export const language: ApiNinjasEndpoints['textLanguage'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textLanguage']
	>('textlanguage', ctx.key, {
		version: 'v1',
		query: {
			text: input.text,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.language',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns spelling corrections and suggestions for any given text. */
export const spellCheck: ApiNinjasEndpoints['textSpellCheck'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textSpellCheck']
	>('spellcheck', ctx.key, {
		version: 'v1',
		query: {
			text: input.text,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.spellCheck',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns the censored version (bad words replaced with asterisks) of any
 * given text and whether the text contains profanity.
 */
export const profanityFilter: ApiNinjasEndpoints['textProfanityFilter'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['textProfanityFilter']
		>('profanityfilter', ctx.key, {
			version: 'v1',
			query: {
				text: input.text,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.text.profanityFilter',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/** Returns a string containing definitions for a given word. */
export const dictionary: ApiNinjasEndpoints['textDictionary'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textDictionary']
	>('dictionary', ctx.key, {
		version: 'v1',
		query: {
			word: input.word,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.dictionary',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns a list of synonyms and a list of antonyms for a given word. */
export const thesaurus: ApiNinjasEndpoints['textThesaurus'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textThesaurus']
	>('thesaurus', ctx.key, {
		version: 'v1',
		query: {
			word: input.word,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.thesaurus',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns a list of rhyming words for any given word. */
export const rhymes: ApiNinjasEndpoints['textRhymes'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textRhymes']
	>('rhyme', ctx.key, {
		version: 'v1',
		query: {
			word: input.word,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.rhymes',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns a random word. */
export const randomWord: ApiNinjasEndpoints['textRandomWord'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textRandomWord']
	>('randomword', ctx.key, {
		version: 'v2',
		query: {
			type: input.type,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.randomWord',
		withCount(auditPayload(input, ['type', 'limit']), result),
		'completed',
	);
	return result;
};

/** Returns one or more paragraphs of lorem ipsum placeholder text. */
export const loremIpsum: ApiNinjasEndpoints['textLoremIpsum'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['textLoremIpsum']
	>('loremipsum', ctx.key, {
		version: 'v1',
		query: {
			max_length: input.max_length,
			paragraphs: input.paragraphs,
			start_with_lorem_ipsum: input.start_with_lorem_ipsum,
			random: input.random,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.text.loremIpsum',
		withCount(
			auditPayload(input, [
				'max_length',
				'paragraphs',
				'start_with_lorem_ipsum',
				'random',
			]),
			result,
		),
		'completed',
	);
	return result;
};
