import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const budgetsList: JobNimbusEndpoints['budgetsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.budgetsList.parse(input);

	const response = await makeJobNimbusRequest<unknown>('/budgets', ctx.key, {
		method: 'GET',
		query: compactQuery({
			size: parsedInput.size,
			from: parsedInput.from,
			sort: parsedInput.sort,
			direction: parsedInput.direction,
			actor: parsedInput.actor,
		}),
	});

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.budgetsList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.budgets.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Budgets = {
	list: budgetsList,
};
