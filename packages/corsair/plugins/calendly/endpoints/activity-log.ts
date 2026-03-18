import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const listEntries: CalendlyEndpoints['activityLogList'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['activityLogList']
	>('activity_log_entries', ctx.key, {
		method: 'GET',
		query: {
			organization: input.organization,
			sort: input.sort,
			count: input.count,
			page_token: input.page_token,
			min_occurred_at: input.min_occurred_at,
			max_occurred_at: input.max_occurred_at,
			search_term: input.search_term,
		},
	});

	await logEventFromContext(
		ctx,
		'calendly.activityLog.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listOutgoingCommunications: CalendlyEndpoints['activityLogListOutgoingCommunications'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['activityLogListOutgoingCommunications']
		>('outgoing_calls', ctx.key, {
			method: 'GET',
			query: {
				organization: input.organization,
				count: input.count,
				page_token: input.page_token,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.activityLog.listOutgoingCommunications',
			{ ...input },
			'completed',
		);
		return result;
	};
