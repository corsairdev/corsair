import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointOutputSchemas } from './types';

export const departures: BartEndpoints['schedulesDepartures'] = async (
	ctx,
	input,
) => {
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'depart',
			orig: input.orig,
			dest: input.dest,
			time: input.time,
			date: input.date,
			b: input.b,
			a: input.a,
			l: input.l,
		},
	});

	const response = BartEndpointOutputSchemas.schedulesDepartures.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.schedules.departures',
		{ ...input },
		'completed',
	);
	return response;
};

export const arrivals: BartEndpoints['schedulesArrivals'] = async (
	ctx,
	input,
) => {
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'arrive',
			orig: input.orig,
			dest: input.dest,
			time: input.time,
			date: input.date,
			b: input.b,
			a: input.a,
			l: input.l,
		},
	});

	const response = BartEndpointOutputSchemas.schedulesArrivals.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.schedules.arrivals',
		{ ...input },
		'completed',
	);
	return response;
};

export const routes: BartEndpoints['schedulesRoutes'] = async (ctx, input) => {
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'routesched',
			route: input.route,
			time: input.time,
			date: input.date,
			l: input.l,
		},
	});

	const response = BartEndpointOutputSchemas.schedulesRoutes.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.schedules.routes',
		{ ...input },
		'completed',
	);
	return response;
};

export const special: BartEndpoints['schedulesSpecial'] = async (
	ctx,
	input,
) => {
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'holiday',
			date: input?.date,
		},
	});

	const response = BartEndpointOutputSchemas.schedulesSpecial.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.schedules.special',
		{ ...input },
		'completed',
	);
	return response;
};
