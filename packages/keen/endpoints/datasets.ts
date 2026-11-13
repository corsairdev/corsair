import { asRecord } from 'corsair/core';
import type { KeenEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, deletedResult } from './call';
import {
	KeenEndpointInputSchemas as Inputs,
	KeenEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Keen pages datasets with a cursor, and the cursor arrives only inside
 * `next_page_url`, so it is read out of that URL and returned as
 * `next_after_name`. The URL is a full Keen URL, so its query string is all
 * that is needed.
 */
// unknown: the raw body is an untyped envelope until the output schema runs.
function listShape(raw: unknown) {
	const record = asRecord(raw) ?? {};
	// Keen omits `next_page_url` on the last page, so an absent key is not a
	// failure; the datasets array itself is still required by the schema.
	const nextUrl = record.next_page_url;
	if (typeof nextUrl !== 'string' || nextUrl.length === 0) {
		return { ...record, next_after_name: null };
	}
	let cursor: string | null = null;
	try {
		// An empty `after_name` means there is no next page, so `''` is treated
		// as no cursor rather than a truthy-but-empty value a caller would send.
		cursor =
			new URL(nextUrl, 'https://api.keen.io').searchParams.get('after_name') ||
			null;
	} catch {
		cursor = null;
	}
	return { ...record, next_after_name: cursor };
}

export const list: KeenEndpoints['datasetsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.list',
			input: Inputs.datasetsList,
			output: Outputs.datasetsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/datasets',
			query: definedQuery({
				limit: parsed.limit,
				after_name: parsed.after_name,
			}),
		}),
		{
			shape: listShape,
			log: (_, result) => ({ count: result.datasets.length }),
		},
	);

export const get: KeenEndpoints['datasetsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.get',
			input: Inputs.datasetsGet,
			output: Outputs.datasetsGet,
		},
		input,
		({ datasetName }) => ({
			method: 'GET',
			path: `/datasets/${segment(datasetName)}`,
		}),
		{ log: (_, result) => ({ datasetName: result.dataset_name }) },
	);

// Reading a dataset's rows is a GET with two required parameters: `index_by`
// and `timeframe`. A single string index value goes as it is; several values,
// or a value that is not a string, go as one JSON object, as Keen documents.
export const result: KeenEndpoints['datasetsResult'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.result',
			input: Inputs.datasetsResult,
			output: Outputs.datasetsResult,
		},
		input,
		({ datasetName, index_by, timeframe }) => ({
			method: 'GET',
			path: `/datasets/${segment(datasetName)}/results`,
			query: {
				index_by:
					typeof index_by === 'string' ? index_by : JSON.stringify(index_by),
				// A relative timeframe is a string; an absolute one is an object,
				// which Keen takes JSON-encoded in the query string.
				timeframe:
					typeof timeframe === 'string' ? timeframe : JSON.stringify(timeframe),
			},
		}),
		{ log: ({ datasetName }) => ({ datasetName }) },
	);

export const remove: KeenEndpoints['datasetsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.delete',
			input: Inputs.datasetsRemove,
			output: Outputs.datasetsRemove,
		},
		input,
		({ datasetName }) => ({
			method: 'DELETE',
			path: `/datasets/${segment(datasetName)}`,
		}),
		{
			shape: () => deletedResult(),
			log: ({ datasetName }) => ({ datasetName }),
		},
	);
