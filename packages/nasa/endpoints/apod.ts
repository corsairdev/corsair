import type { NasaEndpoints } from '..';
import { call } from './call';
import {
	NasaEndpointInputSchemas as Inputs,
	NasaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The APOD feed is a WordPress REST collection. It answers a bare array, serves
 * at most 25 entries per page whatever `per_page` says, and applies
 * `date_from`/`date_to` only as a pair.
 */
export const list: NasaEndpoints['apodList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apod.list',
			input: Inputs.apodList,
			output: Outputs.apodList,
		},
		input,
		({ page, per_page, date_from, date_to }) => ({
			method: 'GET',
			host: 'apod',
			path: '/wp-json/wp/v2/apod-basic',
			query: { page, per_page, date_from, date_to },
		}),
		{
			// WordPress answers a bare array, and `[]` for a range with no posts.
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error(
						`Expected a NASA APOD entry array, got ${typeof raw}`,
					);
				}
				return { entries: raw };
			},
			log: (_, result) => ({ count: result.entries.length }),
		},
	);

/**
 * One day is `/apod-basic/{YYMMDD}`, the legacy six-digit code. There is no
 * lookup by `YYYY-MM-DD`: the collection ignores a `date` filter and answers
 * with today's entries.
 */
export const get: NasaEndpoints['apodGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apod.get',
			input: Inputs.apodGet,
			output: Outputs.apodGet,
		},
		input,
		({ date }) => ({
			method: 'GET',
			host: 'apod',
			path: `/wp-json/wp/v2/apod-basic/${encodeURIComponent(date)}`,
		}),
		{ log: ({ date }, result) => ({ date, title: result.title ?? undefined }) },
	);
