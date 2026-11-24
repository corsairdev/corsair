import type { SpondyrEndpoints } from '..';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

export const send: SpondyrEndpoints['correspondenceSend'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'correspondence.send',
			input: SpondyrEndpointInputSchemas.send,
			output: SpondyrEndpointOutputSchemas.send,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'Spondyr',
			body: {
				EventType: parsed.event_type,
				IsGenerateOnly: parsed.is_generate_only ?? false,
				Data: parsed.data,
			},
		}),
		{
			log: (parsed, result) => ({
				event_type: parsed.event_type,
				is_generate_only: parsed.is_generate_only ?? false,
				reference_id: result.ReferenceID ?? undefined,
			}),
		},
	);

export const deliver: SpondyrEndpoints['correspondenceDeliver'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'correspondence.deliver',
			input: SpondyrEndpointInputSchemas.deliver,
			output: SpondyrEndpointOutputSchemas.deliver,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: 'Spondyr',
			body: {
				ReferenceID: parsed.reference_id,
				...(parsed.template === undefined ? {} : { Template: parsed.template }),
				...(parsed.original_recipients === undefined
					? {}
					: { OriginalRecipients: parsed.original_recipients }),
				...(parsed.new_recipients === undefined
					? {}
					: {
							NewRecipients: parsed.new_recipients.map((recipient) => ({
								...recipient,
							})),
						}),
			},
		}),
		{
			log: (parsed, result) => ({
				reference_id: parsed.reference_id,
				results_reference_id: result.ReferenceID ?? undefined,
			}),
		},
	);

export const status: SpondyrEndpoints['correspondenceStatus'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'correspondence.status',
			input: SpondyrEndpointInputSchemas.status,
			output: SpondyrEndpointOutputSchemas.status,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Spondyr',
			query: {
				ReferenceID: parsed.reference_id,
				IncludeData: parsed.include_data,
			},
		}),
		{
			log: (parsed, result) => ({
				reference_id: parsed.reference_id,
				status_code: result.StatusCode ?? undefined,
				correspondence: result.Correspondence?.length ?? 0,
			}),
		},
	);

export const retry: SpondyrEndpoints['correspondenceRetry'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'correspondence.retry',
			input: SpondyrEndpointInputSchemas.retry,
			output: SpondyrEndpointOutputSchemas.retry,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'Retry',
			body: {
				ReferenceID: parsed.reference_id,
				...(parsed.template === undefined ? {} : { Template: parsed.template }),
			},
		}),
		{
			log: (parsed, result) => ({
				reference_id: parsed.reference_id,
				results_reference_id: result.ReferenceID ?? undefined,
			}),
		},
	);

export const search: SpondyrEndpoints['correspondenceSearch'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'correspondence.search',
			input: SpondyrEndpointInputSchemas.search,
			output: SpondyrEndpointOutputSchemas.search,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Spondyrs',
			query: {
				BatchReferenceID: parsed.batch_reference_id,
				EventType: parsed.event_type,
				SearchName: parsed.search_name,
				SearchValue: parsed.search_value,
				Page: parsed.page,
				PageSize: parsed.page_size,
				SortColumn: parsed.sort_column,
				SortOrder: parsed.sort_order,
			},
		}),
		{
			log: (parsed, result) => ({
				event_type: parsed.event_type,
				page: parsed.page ?? 1,
				results: result.Data.length,
			}),
		},
	);
