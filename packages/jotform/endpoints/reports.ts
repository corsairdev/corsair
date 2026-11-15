import { logEventFromContext } from 'corsair/core';
import type { JotformEndpoints } from '..';
import { makeJotformRequest } from '../client';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './types';

export const get: JotformEndpoints['reports.get'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['reports.get'].parse(input);
	const response = await makeJotformRequest(
		`/report/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = JotformEndpointOutputSchemas['reports.get'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.reports.get',
		{ reportId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const deleteReport: JotformEndpoints['reports.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['reports.delete'].parse(input);
	const response = await makeJotformRequest(
		`/report/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed = JotformEndpointOutputSchemas['reports.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.reports.delete',
		{ reportId: parsedInput.id },
		'completed',
	);
	return parsed;
};
