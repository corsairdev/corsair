import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['routingFormsGet'] = async (ctx, input) => {
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['routingFormsGet']
	>(`routing_forms/${uuid}`, ctx.key, {
		query,
		method: 'GET',
	});

	if (result.resource && ctx.db.routingForms) {
		try {
			const uriParts = result.resource.uri.split('/');
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.routingForms.upsertByEntityId(id, {
				id,
				...result.resource,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save routing form to database:', error);
		}
	}

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
		const { uuid, ...query } = input;
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['routingFormsGetSubmission']
		>(`routing_form_submissions/${uuid}`, ctx.key, {
			query,
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
		query: input,
	});

	if (result.collection && ctx.db.routingForms) {
		try {
			for (const form of result.collection) {
				const uriParts = form.uri.split('/');
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.routingForms.upsertByEntityId(id, {
					id,
					...form,
					created_at: form.created_at ? new Date(form.created_at) : null,
					updated_at: form.updated_at ? new Date(form.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save routing forms to database:', error);
		}
	}

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
			query: input,
		});

		await logEventFromContext(
			ctx,
			'calendly.routingForms.getSampleWebhookData',
			{ ...input },
			'completed',
		);
		return result;
	};
