import type { RentmanEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { filterQuery, listQuery } from './contacts';
import { pagedShape, singleShape } from './shape';
import {
	RentmanEndpointInputSchemas as Inputs,
	RentmanEndpointOutputSchemas as Outputs,
} from './types';

export const crewList: RentmanEndpoints['crewList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'crew.list',
			input: Inputs.crewList,
			output: Outputs.crewList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/crew',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({ active: parsed.active, type: parsed.crew_type }),
				...filterQuery('name', parsed.name),
				...filterQuery('modified', parsed.modified),
			},
		}),
		{
			shape: pagedShape('crew'),
			log: (_, result) => ({
				count: result.crew.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const crewGet: RentmanEndpoints['crewGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'crew.get',
			input: Inputs.crewGet,
			output: Outputs.crewGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/crew/${segment(parsed.crew_id)}`,
			replayable: true,
			query: queryOf({
				fields: parsed.fields?.join(','),
				expand: parsed.expand?.join(','),
			}),
		}),
		{
			shape: singleShape('crew'),
			log: (_, result) => ({ crewId: result.crew.id ?? 0 }),
		},
	);

export const appointmentsList: RentmanEndpoints['appointmentsList'] = (
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
		(parsed) => ({
			method: 'GET',
			path: '/appointments',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({ project: parsed.project }),
				...filterQuery('start', parsed.start),
				...filterQuery('end', parsed.end),
				...filterQuery('modified', parsed.modified),
			},
		}),
		{
			shape: pagedShape('appointments'),
			log: (_, result) => ({
				count: result.appointments.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const appointmentsGet: RentmanEndpoints['appointmentsGet'] = (
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
		(parsed) => ({
			method: 'GET',
			path: `/appointments/${segment(parsed.appointment_id)}`,
			replayable: true,
			query: queryOf({
				fields: parsed.fields?.join(','),
				expand: parsed.expand?.join(','),
			}),
		}),
		{
			shape: singleShape('appointment'),
			log: (_, result) => ({ appointmentId: result.appointment.id ?? 0 }),
		},
	);

export const invoicesList: RentmanEndpoints['invoicesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.list',
			input: Inputs.invoicesList,
			output: Outputs.invoicesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/invoices',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({ project: parsed.project }),
				...filterQuery('number', parsed.number),
				...filterQuery('modified', parsed.modified),
			},
		}),
		{
			shape: pagedShape('invoices'),
			log: (_, result) => ({
				count: result.invoices.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const invoicesGet: RentmanEndpoints['invoicesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.get',
			input: Inputs.invoicesGet,
			output: Outputs.invoicesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/invoices/${segment(parsed.invoice_id)}`,
			replayable: true,
			query: queryOf({
				fields: parsed.fields?.join(','),
				expand: parsed.expand?.join(','),
			}),
		}),
		{
			shape: singleShape('invoice'),
			log: (_, result) => ({ invoiceId: result.invoice.id ?? 0 }),
		},
	);
