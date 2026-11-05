import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import { toBracketQuery } from './query';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const companies: HunterioEndpoints['discoverCompanies'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.discoverCompanies.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['discoverCompanies']
	>('/discover', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.discoverCompanies.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.discover.companies',
		{},
		'completed',
	);

	return parsedResponse;
};

export const people: HunterioEndpoints['discoverPeople'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.discoverPeople.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['discoverPeople']
	>('/discover/people', ctx.key, {
		method: 'GET',
		query: toBracketQuery(parsed),
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.discoverPeople.parse(response);

	await logEventFromContext(ctx, 'hunterio.discover.people', {}, 'completed');

	return parsedResponse;
};

export const peoplePost: HunterioEndpoints['discoverPeoplePost'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.discoverPeoplePost.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['discoverPeoplePost']
	>('/discover/people', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.discoverPeoplePost.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.discover.peoplePost',
		{},
		'completed',
	);

	return parsedResponse;
};
