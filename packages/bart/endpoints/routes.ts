import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointInputSchemas, BartEndpointOutputSchemas } from './types';

export const list: BartEndpoints['routesList'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.routesList.parse(input);
	const raw = await makeBartRequest<unknown>('route.aspx', ctx.key, {
		query: {
			cmd: 'routes',
			sched: parsedInput?.sched,
			date: parsedInput?.date,
		},
	});

	const response = BartEndpointOutputSchemas.routesList.parse(raw);

	if (ctx.db.routes && response.routes?.route) {
		const routesArray = Array.isArray(response.routes.route)
			? response.routes.route
			: [response.routes.route];

		for (const r of routesArray) {
			try {
				const existing = await ctx.db.routes.findByEntityId(r.routeID);
				await ctx.db.routes.upsertByEntityId(r.routeID, {
					...existing?.data,
					id: r.routeID,
					routeID: r.routeID,
					number: r.number,
					name: r.name,
					abbr: r.abbr,
					color: r.color,
					hexcolor: r.hexcolor,
				});
			} catch (error) {
				console.warn('Failed to persist route to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'bart.routes.list',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const info: BartEndpoints['routesInfo'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.routesInfo.parse(input);
	const raw = await makeBartRequest<unknown>('route.aspx', ctx.key, {
		query: {
			cmd: 'routeinfo',
			route: parsedInput.route,
			sched: parsedInput.sched,
			date: parsedInput.date,
		},
	});

	const response = BartEndpointOutputSchemas.routesInfo.parse(raw);

	if (ctx.db.routes && response.routes?.route) {
		const routesArray = Array.isArray(response.routes.route)
			? response.routes.route
			: [response.routes.route];

		for (const r of routesArray) {
			try {
				await ctx.db.routes.upsertByEntityId(r.routeID, {
					id: r.routeID,
					routeID: r.routeID,
					number: r.number,
					name: r.name,
					abbr: r.abbr,
					origin: r.origin,
					destination: r.destination,
					color: r.color,
					hexcolor: r.hexcolor,
					holidays: r.holidays,
					numStns: r.numStns,
				});
			} catch (error) {
				console.warn('Failed to persist route info to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'bart.routes.info',
		{ ...parsedInput },
		'completed',
	);
	return response;
};
