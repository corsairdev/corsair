import { asRecord } from 'corsair/core';
import type { NasaEndpoints } from '..';
import { call } from './call';
import {
	NasaEndpointInputSchemas as Inputs,
	NasaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Reads the page number out of a `rel: next` link. NASA does not echo the page
 * it served, so this is the only way to tell a caller another one exists.
 */
// unknown: the value comes out of the provider's link array, so it is checked
// for being a string before the page number is read.
export function readNextPage(
	href: unknown, // unknown: a link out of the provider's array
): number | undefined {
	if (typeof href !== 'string') return undefined;
	const match = /[?&]page=(\d+)/.exec(href);
	if (!match) return undefined;
	const page = Number(match[1]);
	return Number.isInteger(page) && page > 0 ? page : undefined;
}

/**
 * The search page is Collection+JSON: `collection.items` holds the records and
 * `collection.metadata.total_hits` the size of the whole query. Both are lifted
 * out so a caller can page without re-reading the envelope.
 */
export const search: NasaEndpoints['imageSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.search',
			input: Inputs.imageSearch,
			output: Outputs.imageSearch,
		},
		input,
		({ keywords, ...rest }) => ({
			method: 'GET',
			host: 'images',
			path: '/search',
			query: { ...rest, keywords: keywords?.join(',') },
		}),
		{
			shape: (raw) => {
				const collection = asRecord(asRecord(raw)?.collection);
				if (!collection) {
					throw new Error(
						`Expected a NASA collection envelope, got ${typeof raw}`,
					);
				}
				const items = collection.items;
				const metadata = asRecord(collection.metadata);
				const links = collection.links;
				const nextHref = Array.isArray(links)
					? links
							.map((entry) => asRecord(entry))
							.find((entry) => entry?.rel === 'next')?.href
					: undefined;
				return {
					// Passed through as sent: a missing or malformed list fails the
					// output schema rather than reading as an empty search.
					items,
					total_hits:
						typeof metadata?.total_hits === 'number'
							? metadata.total_hits
							: undefined,
					next_page: readNextPage(nextHref),
					href:
						typeof collection.href === 'string' ? collection.href : undefined,
				};
			},
			log: (_, result) => ({
				count: result.items.length,
				totalHits: result.total_hits ?? undefined,
			}),
		},
	);

/**
 * `/asset/{nasa_id}` answers a bare list of file URLs. `metadata.json` is one
 * entry in that list rather than its own field, so it is lifted out here.
 */
export const asset: NasaEndpoints['imageAsset'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.asset',
			input: Inputs.imageAsset,
			output: Outputs.imageAsset,
		},
		input,
		({ nasa_id }) => ({
			method: 'GET',
			host: 'images',
			path: `/asset/${encodeURIComponent(nasa_id)}`,
		}),
		{
			shape: (raw, { nasa_id }) => {
				const collection = asRecord(asRecord(raw)?.collection);
				const items = collection?.items;
				if (!Array.isArray(items)) {
					throw new Error(
						`Expected a NASA asset manifest for ${nasa_id}, got ${typeof raw}`,
					);
				}
				// An entry without a string href is kept as it came, so the output
				// schema rejects the manifest instead of dropping a file from it.
				const manifest = items.map((entry) => {
					const href = asRecord(entry)?.href;
					return typeof href === 'string' ? href : entry;
				});
				return {
					manifest,
					metadata_url: manifest.find(
						(href): href is string =>
							typeof href === 'string' && href.endsWith('metadata.json'),
					),
				};
			},
			log: ({ nasa_id }, result) => ({
				nasaId: nasa_id,
				files: result.manifest.length,
			}),
		},
	);

/**
 * Answers only the location of the asset's `metadata.json`, not the metadata
 * itself. Fetching it means a plain GET to the returned URL.
 */
export const metadata: NasaEndpoints['imageMetadata'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.metadata',
			input: Inputs.imageMetadata,
			output: Outputs.imageMetadata,
		},
		input,
		({ nasa_id }) => ({
			method: 'GET',
			host: 'images',
			path: `/metadata/${encodeURIComponent(nasa_id)}`,
		}),
		{ log: ({ nasa_id }) => ({ nasaId: nasa_id }) },
	);
