import { asRecord } from 'corsair/core';
import type { z } from 'zod';
import type { MixpanelEndpoints } from '..';
import { resolveProjectId } from '../client';
import { call } from './call';
import {
	MixpanelEndpointInputSchemas as Inputs,
	nextPageFromEngageResponse,
	MixpanelEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Builds the form-encoded body /engage takes. `distinct_ids`,
 * `output_properties` and `filter_by_cohort` are JSON-encoded strings on the
 * wire, so callers pass plain arrays and the cohort id.
 */
function engageForm(input: z.output<typeof Inputs.profilesQuery>): string {
	const form = new URLSearchParams();
	if (input.where !== undefined) form.set('where', input.where);
	if (input.distinct_id !== undefined)
		form.set('distinct_id', input.distinct_id);
	if (input.distinct_ids) {
		form.set('distinct_ids', JSON.stringify(input.distinct_ids));
	}
	if (input.data_group_id !== undefined) {
		form.set('data_group_id', input.data_group_id);
	}
	if (input.output_properties) {
		form.set('output_properties', JSON.stringify(input.output_properties));
	}
	if (input.session_id !== undefined) form.set('session_id', input.session_id);
	if (input.page !== undefined) form.set('page', String(input.page));
	if (input.behaviors !== undefined) {
		form.set('behaviors', String(input.behaviors));
	}
	if (input.as_of_timestamp !== undefined) {
		form.set('as_of_timestamp', String(input.as_of_timestamp));
	}
	if (input.filter_by_cohort !== undefined) {
		form.set(
			'filter_by_cohort',
			JSON.stringify({ id: input.filter_by_cohort }),
		);
	}
	if (input.include_all_users !== undefined) {
		form.set('include_all_users', String(input.include_all_users));
	}
	return form.toString();
}

/**
 * Queries user or group profiles, paged with the session_id from each
 * response: repeat the same query with `page` set to `next_page` until that
 * comes back null.
 */
export const query: MixpanelEndpoints['profilesQuery'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.query',
			input: Inputs.profilesQuery,
			output: Outputs.profilesQuery,
		},
		input,
		async (parsed) => ({
			service: 'query',
			// A query only reads, so a retry after a transport failure is safe.
			replayable: true,
			method: 'POST',
			path: '/engage',
			query: {
				project_id: await resolveProjectId(ctx),
				workspace_id: parsed.workspace_id,
			},
			body: engageForm(parsed),
			mediaType: 'application/x-www-form-urlencoded',
		}),
		{
			shape: (raw) => {
				const body = asRecord(raw);
				if (!body) {
					throw new Error('Mixpanel engage returned no JSON object');
				}
				return { ...body, next_page: nextPageFromEngageResponse(body) };
			},
			log: (_, result) => ({ profiles: result.results.length }),
		},
	);
