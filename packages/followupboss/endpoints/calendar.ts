import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	FollowUpBossEndpointInputSchemas as Inputs,
	FollowUpBossEndpointOutputSchemas as Outputs,
} from './types';

// ── appointments ───────────────────────────────────────────────────────────

export const appointmentsList: FollowUpBossEndpoints['appointmentsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'appointments.list',
			input: Inputs.appointmentsList,
			output: Outputs.appointmentsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/appointments', query }),
		{
			shape: (raw) => ({
				appointments: envelopeMany(raw, 'appointments'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.appointments.length }),
		},
	);

export const appointmentsCreate: FollowUpBossEndpoints['appointmentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'appointments.create',
			input: Inputs.appointmentsCreate,
			output: Outputs.appointmentsCreate,
		},
		input,
		({ sendInvitation, ...body }) => ({
			method: 'POST',
			path: '/appointments',
			query: { sendInvitation },
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'appointments'),
			log: (_, result) => ({ appointmentId: result.id ?? undefined }),
		},
	);

export const appointmentsGet: FollowUpBossEndpoints['appointmentsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'appointments.get',
			input: Inputs.appointmentsGet,
			output: Outputs.appointmentsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/appointments/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'appointments'),
			log: ({ id }) => ({ appointmentId: id }),
		},
	);

export const appointmentsUpdate: FollowUpBossEndpoints['appointmentsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'appointments.update',
			input: Inputs.appointmentsUpdate,
			output: Outputs.appointmentsUpdate,
		},
		input,
		({ id, sendInvitation, ...body }) => ({
			method: 'PUT',
			path: `/appointments/${segment(id)}`,
			query: { sendInvitation },
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'appointments'),
			log: ({ id }) => ({ appointmentId: id }),
		},
	);

// DELETE /appointments/{id} answers 204 with no body.
export const appointmentsDelete: FollowUpBossEndpoints['appointmentsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'appointments.delete',
			input: Inputs.appointmentsDelete,
			output: Outputs.appointmentsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/appointments/${segment(id)}` }),
		{
			shape: (_, { id }) => ({ success: true, id }),
			log: ({ id }) => ({ appointmentId: id }),
		},
	);

// ── appointment types ──────────────────────────────────────────────────────

export const appointmentTypesList: FollowUpBossEndpoints['appointmentTypesList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentTypes.list',
				input: Inputs.appointmentTypesList,
				output: Outputs.appointmentTypesList,
			},
			input,
			(query) => ({ method: 'GET', path: '/appointmentTypes', query }),
			{
				shape: (raw) => ({
					appointmentTypes: envelopeMany(raw, 'appointmentTypes'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.appointmentTypes.length }),
			},
		);

export const appointmentTypesCreate: FollowUpBossEndpoints['appointmentTypesCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentTypes.create',
				input: Inputs.appointmentTypesCreate,
				output: Outputs.appointmentTypesCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/appointmentTypes', body }),
			{
				shape: (raw) => envelopeOne(raw, 'appointmentTypes'),
				log: (_, result) => ({ typeId: result.id ?? undefined }),
			},
		);

export const appointmentTypesGet: FollowUpBossEndpoints['appointmentTypesGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentTypes.get',
				input: Inputs.appointmentTypesGet,
				output: Outputs.appointmentTypesGet,
			},
			input,
			({ id }) => ({
				method: 'GET',
				path: `/appointmentTypes/${segment(id)}`,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'appointmentTypes'),
				log: ({ id }) => ({ typeId: id }),
			},
		);

export const appointmentTypesUpdate: FollowUpBossEndpoints['appointmentTypesUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentTypes.update',
				input: Inputs.appointmentTypesUpdate,
				output: Outputs.appointmentTypesUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/appointmentTypes/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'appointmentTypes'),
				log: ({ id }) => ({ typeId: id }),
			},
		);

// Deleting a type requires the query parameter that reassigns its existing
// appointments, so the operation is destructive on both resources.
export const appointmentTypesDelete: FollowUpBossEndpoints['appointmentTypesDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentTypes.delete',
				input: Inputs.appointmentTypesDelete,
				output: Outputs.appointmentTypesDelete,
			},
			input,
			({ id, assignTypeId }) => ({
				method: 'DELETE',
				path: `/appointmentTypes/${segment(id)}`,
				query: { assignTypeId },
			}),
			{
				// unknown: FUB may echo the deleted type in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id, assignTypeId }) => ({ typeId: id, assignTypeId }),
			},
		);

// ── timeframes ─────────────────────────────────────────────────────────────

export const timeframesList: FollowUpBossEndpoints['timeframesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timeframes.list',
			input: Inputs.timeframesList,
			output: Outputs.timeframesList,
		},
		input,
		() => ({ method: 'GET', path: '/timeframes' }),
		{
			shape: (raw) => ({
				timeframes: envelopeMany(raw, 'timeframes'),
			}),
			log: (_, result) => ({ count: result.timeframes.length }),
		},
	);
