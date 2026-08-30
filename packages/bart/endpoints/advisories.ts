import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import {
	advisoryEntityId,
	BartEndpointInputSchemas,
	BartEndpointOutputSchemas,
	unwrapCData,
} from './types';

export const list: BartEndpoints['advisoriesList'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.advisoriesList.parse(input);
	const raw = await makeBartRequest<unknown>('bsa.aspx', ctx.key, {
		query: {
			cmd: 'bsa',
			orig: parsedInput?.orig,
			date: parsedInput?.date,
		},
	});

	const response = BartEndpointOutputSchemas.advisoriesList.parse(raw);

	if (ctx.db.advisories && response.bsa) {
		const bsaArray = Array.isArray(response.bsa)
			? response.bsa
			: [response.bsa];
		for (const item of bsaArray) {
			const desc = unwrapCData(item.description);
			const sms = unwrapCData(item.sms_text);
			const id = advisoryEntityId(item, response.date);

			try {
				await ctx.db.advisories.upsertByEntityId(id, {
					id,
					station: item.station,
					type: item.type,
					description: desc,
					sms_text: sms,
					posted: item.posted,
					expires: item.expires,
				});
			} catch (error) {
				console.warn('Failed to persist advisory to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'bart.advisories.list',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const elevators: BartEndpoints['advisoriesElevators'] = async (
	ctx,
	input,
) => {
	const parsedInput = BartEndpointInputSchemas.advisoriesElevators.parse(input);
	const raw = await makeBartRequest<unknown>('bsa.aspx', ctx.key, {
		query: {
			cmd: 'elev',
			orig: parsedInput?.orig,
			date: parsedInput?.date,
		},
	});

	const response = BartEndpointOutputSchemas.advisoriesElevators.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.advisories.elevators',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const trainCount: BartEndpoints['advisoriesTrainCount'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		BartEndpointInputSchemas.advisoriesTrainCount.parse(input);
	const raw = await makeBartRequest<unknown>('bsa.aspx', ctx.key, {
		query: {
			cmd: 'count',
		},
	});

	const response = BartEndpointOutputSchemas.advisoriesTrainCount.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.advisories.trainCount',
		{ ...parsedInput },
		'completed',
	);
	return response;
};
