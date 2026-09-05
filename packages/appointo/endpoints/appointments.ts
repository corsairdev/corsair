import { logEventFromContext } from 'corsair/core';
import type { AppointoEndpoints } from '..';
import { makeAppointoRequest } from '../client';
import type { AppointoEndpointOutputs } from './types';

export const list: AppointoEndpoints['appointmentsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.appointment_id) query.appointment_id = input.appointment_id;
	if (input?.product_id) query.product_id = input.product_id;
	if (input?.limit) query.limit = input.limit;
	if (input?.offset) query.offset = input.offset;
	if (input?.search_term) query.search_term = input.search_term;

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['appointmentsList']
	>('appointments', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'appointo.appointments.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getAvailability: AppointoEndpoints['appointmentsGetAvailability'] =
	async (ctx, input) => {
		const query: Record<
			string,
			string | number | string[] | number[] | undefined
		> = {};
		query.start_date = input.start_date;
		if (input.end_date) query.end_date = input.end_date;
		if (input.impersonated_tms) query.impersonated_tms = input.impersonated_tms;

		const response = await makeAppointoRequest<
			AppointoEndpointOutputs['appointmentsGetAvailability']
		>(`appointments/${input.appointment_id}/calendar_availability`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'appointo.appointments.getAvailability',
			{ ...input },
			'completed',
		);
		return response;
	};

export const upsertConfig: AppointoEndpoints['appointmentsUpsertConfig'] =
	async (ctx, input) => {
		const body: Record<string, unknown> = {
			appointment_id: input.appointment_id,
		};
		if (input.config !== undefined) body.config = input.config;
		if (input.availabilities !== undefined)
			body.availabilities = input.availabilities;
		if (input.override !== undefined) body.override = input.override;

		const response = await makeAppointoRequest<
			AppointoEndpointOutputs['appointmentsUpsertConfig']
		>(`appointments/${input.appointment_id}`, ctx.key, {
			method: 'PUT',
			body,
		});

		await logEventFromContext(
			ctx,
			'appointo.appointments.upsertConfig',
			{ ...input },
			'completed',
		);
		return response;
	};
