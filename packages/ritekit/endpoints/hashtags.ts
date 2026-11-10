import type { RiteKitEndpoints } from '..';
import { call, tagList } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

export const stats: RiteKitEndpoints['hashtagsStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'hashtags.stats',
			input: Inputs.hashtagsStats,
			output: Outputs.hashtagsStats,
		},
		input,
		({ tags }) => ({
			method: 'GET',
			path: '/v1/stats/multiple-hashtags',
			query: { tags: tagList(tags) },
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				requested: parsed.tags.length,
				returned: result.stats?.length ?? 0,
			}),
		},
	);

export const auto: RiteKitEndpoints['hashtagsAuto'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'hashtags.auto',
			input: Inputs.hashtagsAuto,
			output: Outputs.hashtagsAuto,
		},
		input,
		({ post, maxHashtags, hashtagPosition }) => ({
			method: 'GET',
			path: '/v1/stats/auto-hashtag',
			query: { post, maxHashtags, hashtagPosition },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				length: result.post?.length ?? 0,
			}),
		},
	);

export const suggestions: RiteKitEndpoints['hashtagsSuggestions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'hashtags.suggestions',
			input: Inputs.hashtagsSuggestions,
			output: Outputs.hashtagsSuggestions,
		},
		input,
		({ text }) => ({
			method: 'GET',
			path: '/v1/stats/hashtag-suggestions',
			query: { text },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.data?.length ?? 0 }),
		},
	);

export const forUrl: RiteKitEndpoints['hashtagsForUrl'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'hashtags.forUrl',
			input: Inputs.hashtagsForUrl,
			output: Outputs.hashtagsForUrl,
		},
		input,
		({ url }) => ({
			method: 'GET',
			path: '/v2/stats/hashtags-for-url',
			query: { url },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.hashtags?.length ?? 0 }),
		},
	);

export const forImage: RiteKitEndpoints['hashtagsForImage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'hashtags.forImage',
			input: Inputs.hashtagsForImage,
			output: Outputs.hashtagsForImage,
		},
		input,
		({ image }) => ({
			method: 'GET',
			path: '/v1/stats/hashtag-suggestions-image',
			query: { image },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.data?.length ?? 0 }),
		},
	);

export const trending: RiteKitEndpoints['hashtagsTrending'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'hashtags.trending',
			input: Inputs.hashtagsTrending,
			output: Outputs.hashtagsTrending,
		},
		input,
		({ green, latin }) => ({
			method: 'GET',
			path: '/v1/search/trending',
			// The API reads 1 and 0 rather than true and false.
			query: {
				green: green === undefined ? undefined : green ? 1 : 0,
				latin: latin === undefined ? undefined : latin ? 1 : 0,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.tags?.length ?? 0 }),
		},
	);

export const cleanInstagram: RiteKitEndpoints['hashtagsCleanInstagram'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'hashtags.cleanInstagram',
			input: Inputs.hashtagsCleanInstagram,
			output: Outputs.hashtagsCleanInstagram,
		},
		input,
		({ post }) => ({
			method: 'GET',
			path: '/v2/instagram/hashtags-cleaner',
			query: { post },
			replayable: true,
		}),
		{
			log: (_, result) => ({ removed: result.bannedHashtags?.length ?? 0 }),
		},
	);
