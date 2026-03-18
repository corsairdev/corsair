import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['routingFormsGet'] = async (ctx, input) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['routingFormsGet']
	>(`routing_forms/${input.uuid}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'calendly.routingForms.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSubmission: CalendlyEndpoints['routingFormsGetSubmission'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['routingFormsGetSubmission']
		>(`routing_form_submissions/${input.uuid}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'calendly.routingForms.getSubmission',
			{ ...input },
			'completed',
		);
		return result;
	};

export const list: CalendlyEndpoints['routingFormsList'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['routingFormsList']
	>('routing_forms', ctx.key, {
		method: 'GET',
		query: {
			organization: input.organization,
			count: input.count,
			page_token: input.page_token,
			sort: input.sort,
		},
	});

	await logEventFromContext(
		ctx,
		'calendly.routingForms.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSampleWebhookData: CalendlyEndpoints['routingFormsGetSampleWebhookData'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['routingFormsGetSampleWebhookData']
		>('sample_webhook_data', ctx.key, {
			method: 'GET',
			query: {
				organization: input.organization,
				scope: input.scope,
				event: input.event,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.routingForms.getSampleWebhookData',
			{ ...input },
			'completed',
		);
		return result;
	};
