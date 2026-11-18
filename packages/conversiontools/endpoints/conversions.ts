import { logEventFromContext } from 'corsair/core';
import type { ConversiontoolsEndpoints } from '..';
import { makeConversiontoolsRequest } from '../client';
import type { ConversionsGetResponse, ConversionsListResponse } from './types';
import {
	ConversiontoolsEndpointInputSchemas,
	ConversiontoolsEndpointOutputSchemas,
} from './types';

const list: ConversiontoolsEndpoints['conversions']['list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.conversionsList.parse(input);
	const response = await makeConversiontoolsRequest<ConversionsListResponse>(
		'/conversions',
		undefined,
		{ method: 'GET', query: parsedInput },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.conversionsList.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.conversions.list',
		{ count: parsed.count },
		'completed',
	);
	return parsed;
};

const get: ConversiontoolsEndpoints['conversions']['get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ConversiontoolsEndpointInputSchemas.conversionsGet.parse(input);
	const response = await makeConversiontoolsRequest<ConversionsGetResponse>(
		`/conversions/${encodeURIComponent(parsedInput.type)}`,
		undefined,
		{ method: 'GET' },
	);
	const parsed =
		ConversiontoolsEndpointOutputSchemas.conversionsGet.parse(response);
	await logEventFromContext(
		ctx,
		'conversiontools.conversions.get',
		{ count: 1 },
		'completed',
	);
	return parsed;
};

export const Conversions = { list, get };
