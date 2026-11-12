import type { RefinerEndpoints } from '..';
import { bracketQuery, listQuery } from '../client';
import { call } from './call';
import {
	RefinerEndpointInputSchemas as Inputs,
	RefinerEndpointOutputSchemas as Outputs,
} from './types';

export const list: RefinerEndpoints['responsesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.list',
			input: Inputs.responsesList,
			output: Outputs.responsesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/responses',
			query: {
				page: parsed.page,
				page_cursor: parsed.page_cursor,
				page_length: parsed.page_length,
				form_uuid: parsed.form_uuid,
				...listQuery('form_uuids', parsed.form_uuids),
				segment_uuid: parsed.segment_uuid,
				...listQuery('segment_uuids', parsed.segment_uuids),
				tag_uuid: parsed.tag_uuid,
				...listQuery('tag_uuids', parsed.tag_uuids),
				date_range_start: parsed.date_range_start,
				date_range_end: parsed.date_range_end,
				include: parsed.include,
				search: parsed.search,
				with_attributes:
					parsed.with_attributes === undefined
						? undefined
						: parsed.with_attributes
							? 1
							: 0,
				...bracketQuery('response_data', parsed.response_data),
				...bracketQuery('contact_data', parsed.contact_data),
				...bracketQuery('account_data', parsed.account_data),
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.items?.length ?? 0,
				total: result.pagination?.items_count ?? undefined,
				nextPage:
					result.pagination?.next_page_cursor !== null &&
					result.pagination?.next_page_cursor !== undefined,
			}),
		},
	);

/**
 * Store a survey response for a user, which is how historical data is imported or
 * a custom survey UI feeds Refiner.
 *
 * `form_uuid` is required: the survey must exist, though it may be empty and
 * unpublished, so a dummy survey can act as a container.
 */
export const store: RefinerEndpoints['responsesStore'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.store',
			input: Inputs.responsesStore,
			output: Outputs.responsesStore,
		},
		input,
		({
			id,
			email,
			uuid,
			form_uuid,
			date,
			prevent_duplicates,
			tags,
			account,
			...data
		}) => ({
			method: 'POST',
			path: '/responses',
			body: {
				id,
				email,
				uuid,
				form_uuid,
				date,
				prevent_duplicates,
				tags,
				account,
				// Any remaining key is a survey answer, keyed by question identifier.
				...data,
			},
			// Refiner de-duplicates by default, but a caller who disabled that would
			// get a second response from a replay, so the call is not resent.
			replayable: false,
		}),
		{
			log: (_, result) => ({ responseUuid: result.uuid ?? undefined }),
		},
	);

export const tag: RefinerEndpoints['responsesTag'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'responses.tag',
			input: Inputs.responsesTag,
			output: Outputs.responsesTag,
		},
		input,
		({ uuid, tags }) => ({
			method: 'POST',
			path: '/responses/tags',
			body: { uuid, tags },
			// Tagging adds a tag that is already there without changing anything, so a
			// replay leaves the same set.
			replayable: true,
		}),
		{
			log: (parsed) => ({ tags: parsed.tags.length }),
		},
	);

export const report: RefinerEndpoints['reportingGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reporting.get',
			input: Inputs.reportingGet,
			output: Outputs.reportingGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/reporting',
			query: {
				type: parsed.type,
				...listQuery('question_identifiers', parsed.question_identifiers),
				...listQuery('tag_uuids', parsed.tag_uuids),
				...listQuery('form_uuids', parsed.form_uuids),
				...listQuery('segment_uuids', parsed.segment_uuids),
				date_range_start: parsed.date_range_start,
				date_range_end: parsed.date_range_end,
				...bracketQuery('response_data', parsed.response_data),
				...bracketQuery('contact_data', parsed.contact_data),
				...bracketQuery('account_data', parsed.account_data),
			},
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				type: parsed.type,
				nps: result.nps ?? undefined,
				csat: result.csat ?? undefined,
				count: result.count ?? undefined,
			}),
		},
	);
