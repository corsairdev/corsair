import { logEventFromContext } from '../../utils/events';
import type { PagerdutyEndpoints } from '..';
import { makePagerdutyRequest } from '../client';
import type { PagerdutyEndpointOutputs } from './types';

export const create: PagerdutyEndpoints['incidentNotesCreate'] = async (ctx, input) => {
	const result = await makePagerdutyRequest<PagerdutyEndpointOutputs['incidentNotesCreate']>(
		`incidents/${input.incident_id}/notes`,
		ctx.key,
		{
			method: 'POST',
			body: {
				note: {
					content: input.content,
				},
			},
		},
	);

	await logEventFromContext(
		ctx,
		'pagerduty.incidentNotes.create',
		{ incident_id: input.incident_id },
		'completed',
	);
	return result;
};

export const list: PagerdutyEndpoints['incidentNotesList'] = async (ctx, input) => {
	const result = await makePagerdutyRequest<PagerdutyEndpointOutputs['incidentNotesList']>(
		`incidents/${input.incident_id}/notes`,
		ctx.key,
		{
			query: {
				limit: input.limit,
				offset: input.offset,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'pagerduty.incidentNotes.list',
		{ incident_id: input.incident_id },
		'completed',
	);
	return result;
};
