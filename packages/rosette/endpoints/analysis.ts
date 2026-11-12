import type { RosetteEndpoints } from '..';
import { call, documentBody, documentQuery } from './call';
import {
	RosetteEndpointInputSchemas as Inputs,
	RosetteEndpointOutputSchemas as Outputs,
} from './types';

/** The host reachability check. It needs no text and no key in the binding. */
export const ping: RosetteEndpoints['ping'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ping',
			input: Inputs.ping,
			output: Outputs.ping,
		},
		input,
		() => ({ method: 'GET', path: '/ping', replayable: true }),
		{
			log: (_, result) => ({ message: result.message ?? undefined }),
		},
	);

/**
 * The server build, which is worth recording when an analysis result is
 * unexpected: Rosette's models change between versions, so the version explains a
 * difference in output.
 */
export const info: RosetteEndpoints['info'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'info',
			input: Inputs.info,
			output: Outputs.info,
		},
		input,
		() => ({ method: 'GET', path: '/info', replayable: true }),
		{
			log: (_, result) => ({
				version: result.version ?? undefined,
				buildNumber: result.buildNumber ?? undefined,
			}),
		},
	);

/** The detected language, with every candidate and its confidence. */
export const language: RosetteEndpoints['language'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'language',
			input: Inputs.language,
			output: Outputs.language,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/language',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			// An analysis is a pure function of its input, so a retry returns the same
			// answer for the same text.
			replayable: true,
		}),
		{
			log: (_, result) => ({
				language: result.language ?? undefined,
				candidates: result.languageDetections?.length ?? 0,
			}),
		},
	);

/**
 * Extracted entities.
 *
 * `entityId` groups mentions of the same thing, which is what makes
 * `entities.list` usable for counting a person across a document rather than
 * counting surface strings.
 */
export const entities: RosetteEndpoints['entities'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'entities',
			input: Inputs.entities,
			output: Outputs.entities,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/entities',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				entities: result.entities?.length ?? 0,
				types: new Set(
					result.entities?.map((entity) => entity.type).filter(Boolean),
				).size,
			}),
		},
	);

/**
 * Document and entity sentiment.
 *
 * The document `label` and `score` are separate: a `neu` label can still carry a
 * score away from zero, so a caller filtering on sentiment should decide which one
 * it trusts.
 */
export const sentiment: RosetteEndpoints['sentiment'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sentiment',
			input: Inputs.sentiment,
			output: Outputs.sentiment,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/sentiment',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				label: result.document?.label ?? undefined,
				score: result.document?.score ?? undefined,
				entities: result.entities?.length ?? 0,
			}),
		},
	);

/** Tokens with their part-of-speech tags and lemmas, in matching order. */
export const tokens: RosetteEndpoints['tokens'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tokens',
			input: Inputs.tokens,
			output: Outputs.tokens,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/tokens',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ tokens: result.tokens?.length ?? 0 }),
		},
	);

/** Sentence boundaries, as offsets into the text. */
export const sentences: RosetteEndpoints['sentences'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sentences',
			input: Inputs.sentences,
			output: Outputs.sentences,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/sentences',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				sentences: result.sentenceDetections?.length ?? 0,
			}),
		},
	);

/**
 * Morphological analysis: lemmas, part-of-speech tags, compound parts and Han
 * readings. The bare `/morphology` route answers 404; the API serves one route per
 * facet, and `complete` returns every facet at once.
 */
export const morphology: RosetteEndpoints['morphology'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'morphology',
			input: Inputs.morphology,
			output: Outputs.morphology,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/morphology/complete',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				tokens: result.tokens?.length ?? 0,
				compounds:
					result.compoundComponents?.filter((parts) => parts !== null).length ??
					0,
			}),
		},
	);

/** Topic-taxonomy categories with their confidence. */
export const categories: RosetteEndpoints['categories'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories',
			input: Inputs.categories,
			output: Outputs.categories,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/categories',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ categories: result.categories?.length ?? 0 }),
		},
	);

/**
 * Topics and concepts.
 *
 * A concept is the broader theme and a topic the specific label, and both carry a
 * salience rather than a probability, so they are not comparable across documents in
 * the way a score would be.
 */
export const topics: RosetteEndpoints['topics'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'topics',
			input: Inputs.topics,
			output: Outputs.topics,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/topics',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				topics: result.topics?.length ?? 0,
				concepts: result.concepts?.length ?? 0,
			}),
		},
	);

/** Subject-verb-object triples, each with the confidence of its predicate. */
export const relationships: RosetteEndpoints['relationships'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'relationships',
			input: Inputs.relationships,
			output: Outputs.relationships,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/relationships',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				relationships: result.relationships?.length ?? 0,
			}),
		},
	);

/** Terms near the input in embedding space, in each requested language. */
export const similarTerms: RosetteEndpoints['similarTerms'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'semantics.similarTerms',
			input: Inputs.similarTerms,
			output: Outputs.similarTerms,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/semantics/similar',
			query: documentQuery(parsed),
			body: {
				...documentBody(parsed),
				options: { resultLanguages: parsed.resultLanguages },
			},
			replayable: true,
		}),
		{
			log: (_, result) => {
				const lists = Object.values(result.similarTerms ?? {});
				return {
					terms: lists.reduce((sum, list) => sum + list.length, 0),
					languages: lists.length,
				};
			},
		},
	);

/** The text embedding, with its dimension count. */
export const textEmbedding: RosetteEndpoints['textEmbedding'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'semantics.vector',
			input: Inputs.textEmbedding,
			output: Outputs.textEmbedding,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/semantics/vector',
			query: documentQuery(parsed),
			body: documentBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				dimensions: result.dimensions ?? result.embedding?.length ?? 0,
			}),
		},
	);

/**
 * Name similarity.
 *
 * The two names are not symmetric: Rosette scores how likely `name1` is to be the
 * same entity as `name2`, so swapping them can change the score.
 */
export const nameSimilarity: RosetteEndpoints['nameSimilarity'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'nameSimilarity',
			input: Inputs.nameSimilarity,
			output: Outputs.nameSimilarity,
		},
		input,
		({ name1, name2 }) => ({
			method: 'POST',
			path: '/name-similarity',
			body: { name1, name2 },
			replayable: true,
		}),
		{
			log: (_, result) => ({ score: result.score ?? undefined }),
		},
	);

/** Name translation between languages, which is not transliteration. */
export const nameTranslation: RosetteEndpoints['nameTranslation'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'nameTranslation',
			input: Inputs.nameTranslation,
			output: Outputs.nameTranslation,
		},
		input,
		({
			name,
			targetLanguage,
			entityType,
			sourceLanguageOfOrigin,
			sourceLanguageOfUse,
			sourceScript,
			targetScript,
		}) => ({
			method: 'POST',
			path: '/name-translation',
			body: {
				name,
				targetLanguage,
				entityType,
				sourceLanguageOfOrigin,
				sourceLanguageOfUse,
				sourceScript,
				targetScript,
			},
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				targetLanguage: parsed.targetLanguage,
				translated: (result.translation?.length ?? 0) > 0,
			}),
		},
	);

/** Transliteration between scripts, which keeps the words and changes the script. */
export const transliteration: RosetteEndpoints['transliteration'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transliteration',
			input: Inputs.transliteration,
			output: Outputs.transliteration,
		},
		input,
		({ content, language, targetScript }) => ({
			method: 'POST',
			path: '/transliteration',
			body: { content, language, targetScript },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				transliterated: (result.transliteration?.length ?? 0) > 0,
			}),
		},
	);
