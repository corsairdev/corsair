import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

const JOBNIMBUS_API2_BASE = 'https://app.jobnimbus.com/api2';

export const paymentsList: JobNimbusEndpoints['paymentsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.paymentsList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/payments',
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				size: parsedInput.size,
				from: parsedInput.from,
				sort: parsedInput.sort,
				direction: parsedInput.direction,
			}),
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.paymentsList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.payments.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const paymentsCreate: JobNimbusEndpoints['paymentsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.paymentsCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/payments',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
			baseUrl: JOBNIMBUS_API2_BASE,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.paymentsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.payments.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const Payments = {
	list: paymentsList,
	create: paymentsCreate,
};
