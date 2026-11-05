import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointInputSchemas, BartEndpointOutputSchemas } from './types';

export const departures: BartEndpoints['schedulesDepartures'] = async (
	ctx,
	input,
) => {
	const parsedInput = BartEndpointInputSchemas.schedulesDepartures.parse(input);
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'depart',
			orig: parsedInput.orig,
			dest: parsedInput.dest,
			time: parsedInput.time,
			date: parsedInput.date,
			b: parsedInput.b,
			a: parsedInput.a,
			l: parsedInput.l,
		},
	});

	const response = BartEndpointOutputSchemas.schedulesDepartures.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.schedules.departures',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const arrivals: BartEndpoints['schedulesArrivals'] = async (
	ctx,
	input,
) => {
	const parsedInput = BartEndpointInputSchemas.schedulesArrivals.parse(input);
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'arrive',
			orig: parsedInput.orig,
			dest: parsedInput.dest,
			time: parsedInput.time,
			date: parsedInput.date,
			b: parsedInput.b,
			a: parsedInput.a,
			l: parsedInput.l,
		},
	});

	const response = BartEndpointOutputSchemas.schedulesArrivals.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.schedules.arrivals',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const routes: BartEndpoints['schedulesRoutes'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.schedulesRoutes.parse(input);
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'routesched',
			route: parsedInput.route,
			time: parsedInput.time,
			date: parsedInput.date,
			l: parsedInput.l,
		},
	});

	const response = BartEndpointOutputSchemas.schedulesRoutes.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.schedules.routes',
		{ ...parsedInput },
		'completed',
	);
	return response;
};
