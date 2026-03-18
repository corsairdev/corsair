import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const create: CalendlyEndpoints['schedulingLinksCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['schedulingLinksCreate']
	>('scheduling_links', ctx.key, {
		method: 'POST',
		body: {
			max_event_count: input.max_event_count,
			owner: input.owner,
			owner_type: input.owner_type,
		},
	});

	await logEventFromContext(
		ctx,
		'calendly.schedulingLinks.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const createSingleUse: CalendlyEndpoints['schedulingLinksCreateSingleUse'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['schedulingLinksCreateSingleUse']
		>('scheduling_links', ctx.key, {
			method: 'POST',
			body: {
				max_event_count: input.max_event_count,
				owner: input.owner,
				owner_type: input.owner_type,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.schedulingLinks.createSingleUse',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createShare: CalendlyEndpoints['schedulingLinksCreateShare'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['schedulingLinksCreateShare']
		>('shares', ctx.key, {
			method: 'POST',
			body: {
				event_type: input.event_type,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.schedulingLinks.createShare',
			{ ...input },
			'completed',
		);
		return result;
	};
