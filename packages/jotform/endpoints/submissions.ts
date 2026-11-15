import { logEventFromContext } from 'corsair/core';
import type { JotformEndpoints } from '..';
import { makeJotformEndpointRequest } from '../client';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './types';

export const get: JotformEndpoints['submissions.get'] = async (ctx, input) => {
	const parsedInput =
		JotformEndpointInputSchemas['submissions.get'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		`/submission/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		JotformEndpointOutputSchemas['submissions.get'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.submissions.get',
		{ submissionId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const update: JotformEndpoints['submissions.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['submissions.update'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		`/submission/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'POST', body: parsedInput.submission },
	);
	const parsed =
		JotformEndpointOutputSchemas['submissions.update'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.submissions.update',
		{ submissionId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const deleteSubmission: JotformEndpoints['submissions.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['submissions.delete'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		`/submission/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed =
		JotformEndpointOutputSchemas['submissions.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.submissions.delete',
		{ submissionId: parsedInput.id },
		'completed',
	);
	return parsed;
};
