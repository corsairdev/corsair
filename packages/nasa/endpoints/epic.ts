import type { NasaEndpoints } from '..';
import { call } from './call';
import {
	NasaEndpointInputSchemas as Inputs,
	NasaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * EPIC answers a bare array for a day and `[]` for a day without imagery. A
 * malformed date answers an HTML 500, not a 400, so it reaches the caller as a
 * server error.
 */
export const images: NasaEndpoints['epicImages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'epic.images',
			input: Inputs.epicImages,
			output: Outputs.epicImages,
		},
		input,
		({ collection, date }) => ({
			method: 'GET',
			host: 'epic',
			path: date
				? `/api/${collection ?? 'natural'}/date/${date}`
				: `/api/${collection ?? 'natural'}`,
		}),
		{
			// A day without imagery is `[]`; anything else that is not an array is
			// left for the output schema to reject.
			shape: (raw) => ({ images: raw }),
			log: (_, result) => ({ count: result.images.length }),
		},
	);

/**
 * Answers a bare array of `YYYY-MM-DD` strings on `/available`, and an array of
 * `{ date }` objects on `/all`. `/available` is the one wrapped here.
 */
export const availableDates: NasaEndpoints['epicAvailableDates'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'epic.availableDates',
			input: Inputs.epicAvailableDates,
			output: Outputs.epicAvailableDates,
		},
		input,
		({ collection }) => ({
			method: 'GET',
			host: 'epic',
			path: `/api/${collection ?? 'natural'}/available`,
		}),
		{
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error(`Expected a NASA EPIC date array, got ${typeof raw}`);
				}
				// /available answers strings; /all answers objects, so both are read.
				// An entry of neither form is kept as it came, so the output schema
				// rejects the response instead of returning a shorter list.
				const dates = raw.map((entry) => {
					if (typeof entry === 'string') return entry;
					// unknown: /all answers objects, but the field has no shared type
					// with the string form, so it is narrowed here.
					const date = (entry as { date?: unknown } | null)?.date; // unknown: narrowed
					return typeof date === 'string' ? date : entry;
				});
				// /available answers oldest first; sorting keeps that order for the
				// object form too. YYYY-MM-DD strings sort by date; anything else is
				// left for the output schema to reject.
				const sorted = dates.every((date) => typeof date === 'string')
					? [...dates].sort()
					: dates;
				return { dates: sorted };
			},
			log: (_, result) => ({ count: result.dates.length }),
		},
	);
