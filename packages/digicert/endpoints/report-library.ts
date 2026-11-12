import { logEventFromContext } from 'corsair/core';
import type { DigicertEndpoints } from '..';
import { makeDigicertRequest } from '../client';
import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './types';

function queryFrom(input: Record<string, string | number | undefined>) {
	return Object.fromEntries(
		Object.entries(input).filter((entry) => entry[1] !== undefined),
	);
}

export const reportNames: DigicertEndpoints['reportLibrary']['names'] = async (
	ctx,
	input,
) => {
	const parsedInput = DigicertEndpointInputSchemas.reportNames.parse(input);
	const response = await makeDigicertRequest(
		'reportLibrary',
		'/report/names',
		ctx.key,
		{
			method: 'GET',
			reportRegion: ctx.options.reportRegion,
			query: queryFrom({
				report_display_name: parsedInput.report_display_name,
			}),
		},
	);
	const parsed = DigicertEndpointOutputSchemas.reportNames.parse(response);
	await logEventFromContext(
		ctx,
		'digicert.reportLibrary.names',
		{ count: parsed.report_names.length },
		'completed',
	);
	return parsed;
};

export const reportTypes: DigicertEndpoints['reportLibrary']['types'] = async (
	ctx,
	input,
) => {
	const parsedInput = DigicertEndpointInputSchemas.reportTypes.parse(input);
	const response = await makeDigicertRequest(
		'reportLibrary',
		'/report/types',
		ctx.key,
		{
			method: 'GET',
			reportRegion: ctx.options.reportRegion,
			query: queryFrom({ language_id: parsedInput.language_id }),
		},
	);
	const parsed = DigicertEndpointOutputSchemas.reportTypes.parse(response);
	await logEventFromContext(
		ctx,
		'digicert.reportLibrary.types',
		{ count: parsed.report_types.length },
		'completed',
	);
	return parsed;
};

export const reportHistory: DigicertEndpoints['reportLibrary']['history'] =
	async (ctx, input) => {
		const parsedInput = DigicertEndpointInputSchemas.reportHistory.parse(input);
		const response = await makeDigicertRequest(
			'reportLibrary',
			'/report/history',
			ctx.key,
			{
				method: 'GET',
				reportRegion: ctx.options.reportRegion,
				query: queryFrom(parsedInput),
			},
		);
		const parsed = DigicertEndpointOutputSchemas.reportHistory.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.reportLibrary.history',
			{ count: parsed.report_history.length },
			'completed',
		);
		return parsed;
	};

export const reportDetails: DigicertEndpoints['reportLibrary']['details'] =
	async (ctx, input) => {
		const parsedInput = DigicertEndpointInputSchemas.reportDetails.parse(input);
		const response = await makeDigicertRequest(
			'reportLibrary',
			`/report/${encodeURIComponent(parsedInput.reportIdentifier)}`,
			ctx.key,
			{
				method: 'GET',
				reportRegion: ctx.options.reportRegion,
				query: queryFrom({ language_id: parsedInput.language_id }),
			},
		);
		const parsed = DigicertEndpointOutputSchemas.reportDetails.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.reportLibrary.details',
			{},
			'completed',
		);
		return parsed;
	};
