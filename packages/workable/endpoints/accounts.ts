import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import {
	parseEndpointInput,
	parseEndpointOutput,
	resolveAccount,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

export const list: WorkableEndpoints['accountsList'] = async (ctx) => {
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['accountsList']
	>('/accounts', ctx.key, account);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.accountsList,
		raw,
	);
	await logEventFromContext(ctx, 'workable.accounts.list', {}, 'completed');
	return response;
};

export const get: WorkableEndpoints['accountsGet'] = async (ctx, input) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.accountsGet,
		input,
	);
	// The authenticated host always stays tied to the connected credential;
	// the input only selects which accessible account to return in the path.
	const account = await resolveAccount(ctx);
	const subdomain = valid.subdomain ?? account;
	const raw = await makeWorkableRequest<WorkableEndpointOutputs['accountsGet']>(
		`/accounts/${encodeURIComponent(subdomain)}`,
		ctx.key,
		account,
	);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.accountsGet,
		raw,
	);
	await logEventFromContext(
		ctx,
		'workable.accounts.get',
		{ subdomain },
		'completed',
	);
	return response;
};
