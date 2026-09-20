import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Jokes, facts, quotes, trivia and puzzles.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Returns one (or more) random funny jokes. Free users have access to 100
 * jokes - premium users have access to over 20,000 jokes.
 */
export const jokes: ApiNinjasEndpoints['entertainmentJokes'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentJokes']
	>('jokes', ctx.key, {
		version: 'v1',
		query: {
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.jokes',
		withCount(auditPayload(input, ['limit']), result),
		'completed',
	);
	return result;
};

/**
 * Returns one (or more) random dad jokes. Free users have access to 100
 * jokes - premium users have access to over 15,000 dad jokes.
 */
export const dadJokes: ApiNinjasEndpoints['entertainmentDadJokes'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentDadJokes']
	>('dadjokes', ctx.key, {
		version: 'v1',
		query: {
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.dadJokes',
		withCount(auditPayload(input, ['limit']), result),
		'completed',
	);
	return result;
};

/** Returns a Chuck Norris joke. */
export const chuckNorris: ApiNinjasEndpoints['entertainmentChuckNorris'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentChuckNorris']
		>('chucknorris', ctx.key, {
			version: 'v1',
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.chuckNorris',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/**
 * Returns a single joke for the current day. The same joke is returned for
 * all requests on the same day, and changes each day. Perfect for
 * displaying on your website or app. No parameters are available for this
 * endpoint to ensure everyone sees the same joke of the day.
 */
export const jokeOfTheDay: ApiNinjasEndpoints['entertainmentJokeOfTheDay'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentJokeOfTheDay']
		>('jokeoftheday', ctx.key, {
			version: 'v1',
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.jokeOfTheDay',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/**
 * Returns one (or more) random facts. Free users have access to 100 facts
 * - premium users have access to over 500,000 facts.
 */
export const facts: ApiNinjasEndpoints['entertainmentFacts'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentFacts']
	>('facts', ctx.key, {
		version: 'v1',
		query: {
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.facts',
		withCount(auditPayload(input, ['limit']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a single fact for the current day. The same fact is returned for
 * all requests on the same day, and changes each day. Perfect for
 * displaying on your website or app. No parameters are available for this
 * endpoint to ensure everyone sees the same fact of the day.
 */
export const factOfTheDay: ApiNinjasEndpoints['entertainmentFactOfTheDay'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentFactOfTheDay']
		>('factoftheday', ctx.key, {
			version: 'v1',
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.factOfTheDay',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/**
 * Returns high-quality quotes with advanced filtering by categories
 * (include/exclude), author, work, and pagination support. Returns quotes
 * in deterministic order. For random quotes, use /v2/randomquotes or
 * /v2/quoteoftheday.
 */
export const quotes: ApiNinjasEndpoints['entertainmentQuotes'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentQuotes']
	>('quotes', ctx.key, {
		version: 'v2',
		query: {
			categories: input.categories,
			exclude_categories: input.exclude_categories,
			author: input.author,
			work: input.work,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.quotes',
		withCount(
			auditPayload(input, [
				'categories',
				'exclude_categories',
				'author',
				'work',
				'limit',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns random high-quality quotes with advanced filtering by categories
 * (include/exclude), author, and work. Each request returns different
 * random quotes.
 */
export const randomQuotes: ApiNinjasEndpoints['entertainmentRandomQuotes'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentRandomQuotes']
		>('randomquotes', ctx.key, {
			version: 'v2',
			query: {
				categories: input.categories,
				exclude_categories: input.exclude_categories,
				author: input.author,
				work: input.work,
				limit: input.limit,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.randomQuotes',
			withCount(
				auditPayload(input, [
					'categories',
					'exclude_categories',
					'author',
					'work',
					'limit',
				]),
				result,
			),
			'completed',
		);
		return result;
	};

/**
 * Returns a single aphoristic quote for the current day. The same
 * pre-vetted, high-quality quote is returned for all requests on the same
 * day, and changes each day. Perfect for displaying on your website or
 * app. No filtering parameters are available for this endpoint to ensure
 * everyone sees the same quote of the day.
 */
export const quoteOfTheDay: ApiNinjasEndpoints['entertainmentQuoteOfTheDay'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentQuoteOfTheDay']
		>('quoteoftheday', ctx.key, {
			version: 'v2',
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.quoteOfTheDay',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/** Returns a random piece of life advice. */
export const advice: ApiNinjasEndpoints['entertainmentAdvice'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentAdvice']
	>('advice', ctx.key, {
		version: 'v1',
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.advice',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns a random bucket list idea. */
export const bucketList: ApiNinjasEndpoints['entertainmentBucketList'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentBucketList']
	>('bucketlist', ctx.key, {
		version: 'v1',
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.bucketList',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/** Returns a random hobby and a Wikipedia link detailing the hobby. */
export const hobbies: ApiNinjasEndpoints['entertainmentHobbies'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentHobbies']
	>('hobbies', ctx.key, {
		version: 'v1',
		query: {
			category: input.category,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.hobbies',
		withCount(auditPayload(input, ['category']), result),
		'completed',
	);
	return result;
};

/**
 * Returns the daily horoscope for a specific zodiac sign. Optionally, you
 * can provide a date parameter to get historical horoscopes.
 */
export const horoscope: ApiNinjasEndpoints['entertainmentHoroscope'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentHoroscope']
	>('horoscope', ctx.key, {
		version: 'v1',
		query: {
			zodiac: input.zodiac,
			date: input.date,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.horoscope',
		withCount(auditPayload(input, ['zodiac', 'date']), result),
		'completed',
	);
	return result;
};

/** Returns one or more random riddles. */
export const riddles: ApiNinjasEndpoints['entertainmentRiddles'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentRiddles']
	>('riddles', ctx.key, {
		version: 'v1',
		query: {
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.riddles',
		withCount(auditPayload(input, ['limit']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a random trivia question and answer. Free users have access to
 * 100 trivia questions - premium users have access to over 100,000 trivia
 * questions.
 */
export const trivia: ApiNinjasEndpoints['entertainmentTrivia'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['entertainmentTrivia']
	>('trivia', ctx.key, {
		version: 'v1',
		query: {
			category: input.category,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.entertainment.trivia',
		withCount(auditPayload(input, ['category', 'limit']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a single trivia question and answer for the current day. The
 * same question is returned for all requests on the same day, and changes
 * each day. Perfect for displaying on your website or app. No filtering
 * parameters are available for this endpoint to ensure everyone sees the
 * same trivia of the day.
 */
export const triviaOfTheDay: ApiNinjasEndpoints['entertainmentTriviaOfTheDay'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentTriviaOfTheDay']
		>('triviaoftheday', ctx.key, {
			version: 'v1',
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.triviaOfTheDay',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/** Generate a new Sudoku puzzle with specified parameters. */
export const generateSudoku: ApiNinjasEndpoints['entertainmentGenerateSudoku'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentGenerateSudoku']
		>('sudokugenerate', ctx.key, {
			version: 'v1',
			query: {
				width: input.width,
				height: input.height,
				difficulty: input.difficulty,
				seed: input.seed,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.generateSudoku',
			withCount(
				auditPayload(input, ['width', 'height', 'difficulty', 'seed']),
				result,
			),
			'completed',
		);
		return result;
	};

/** Solve an existing Sudoku puzzle. */
export const solveSudoku: ApiNinjasEndpoints['entertainmentSolveSudoku'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['entertainmentSolveSudoku']
		>('sudokusolve', ctx.key, {
			version: 'v1',
			query: {
				puzzle: input.puzzle,
				width: input.width,
				height: input.height,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.entertainment.solveSudoku',
			withCount(auditPayload(input, ['width', 'height']), result),
			'completed',
		);
		return result;
	};
