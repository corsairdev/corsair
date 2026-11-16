import type { RetentlyEndpoints } from '..';
import { segment } from '../client';
import { attributesQuery, call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const list: RetentlyEndpoints['feedbackList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'feedback.list',
			input: Inputs.feedbackList,
			output: Outputs.feedbackList,
		},
		input,
		({
			email,
			customerId,
			campaignId,
			page,
			limit,
			sort,
			startDate,
			endDate,
			attributes,
			match,
		}) => ({
			method: 'GET',
			path: '/feedback',
			query: {
				email,
				customerId,
				campaignId,
				page,
				limit,
				sort,
				startDate,
				endDate,
				match,
				...attributesQuery(attributes),
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.data?.responses?.length ?? 0,
				total: result.data?.total ?? undefined,
			}),
		},
	);

export const get: RetentlyEndpoints['feedbackGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'feedback.get',
			input: Inputs.feedbackGet,
			output: Outputs.feedbackGet,
		},
		input,
		({ feedbackId }) => ({
			method: 'GET',
			path: `/feedback/${segment(feedbackId)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				found: (result.data?.responses?.length ?? 0) > 0,
			}),
		},
	);

export const importFeedback: RetentlyEndpoints['feedbackImport'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'feedback.import',
			input: Inputs.feedbackImport,
			output: Outputs.feedbackImport,
		},
		input,
		({ campaign_id, feedback, options }) => ({
			method: 'POST',
			path: '/import',
			body:
				options === undefined
					? { campaign_id, feedback }
					: { campaign_id, feedback, options },
			// Imported responses are live as soon as they land, and only
			// skip_duplicates (on by default) would notice a replay. A caller who
			// turns it off would double every response, so the batch is not resent.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				imported: result.data?.imported ?? 0,
				skipped: result.data?.skipped ?? 0,
				failed: result.data?.failed ?? 0,
			}),
		},
	);
