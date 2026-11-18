import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	NewsDetailInput,
	NewsDetailOutput,
	NewsFeedInput,
	NewsFeedOutput,
} from './types';

export const News = {
	detail: (ctx: SurfContext, input: SurfEndpointInputs['newsDetail']) =>
		callSurf(
			ctx,
			'news.detail',
			NewsDetailInput,
			NewsDetailOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/news/detail',
				query: omitEmpty({ id: validated.id }),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	feed: (ctx: SurfContext, input: SurfEndpointInputs['newsFeed']) =>
		callSurf(
			ctx,
			'news.feed',
			NewsFeedInput,
			NewsFeedOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/news/feed',
				query: omitEmpty({
					source: validated.source,
					project: validated.project,
					from: validated.from,
					to: validated.to,
					sort_by: validated.sort_by,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ source: String(validated.source ?? '') }),
		),
};

function omitEmpty<T extends Record<string, unknown>>(value: T): T {
	// Optional query and body fields are omitted. The helper is generic over that object.
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
