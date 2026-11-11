import type { UserlistEndpoints } from '..';
import { call } from './call';
import {
	UserlistEndpointInputSchemas as Inputs,
	UserlistEndpointOutputSchemas as Outputs,
} from './types';

/** Create or update a company, keyed on the identifier you give it. */
export const upsert: UserlistEndpoints['companiesUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.upsert',
			input: Inputs.companiesUpsert,
			output: Outputs.companiesUpsert,
			label: 'companies.upsert',
		},
		input,
		(body) => ({ method: 'POST', path: '/companies', body }),
		{
			identifier: (parsed) => String(parsed.identifier),
			log: (parsed) => ({
				id: String(parsed.identifier),
				name: parsed.name,
				properties: parsed.properties
					? Object.keys(parsed.properties).length
					: 0,
			}),
		},
	);

/** Deleting a company leaves its users in place; only the relationships go. */
export const remove: UserlistEndpoints['companiesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.delete',
			input: Inputs.companiesDelete,
			output: Outputs.companiesDelete,
			label: 'companies.delete',
		},
		input,
		(body) => ({ method: 'DELETE', path: '/companies', body }),
		{
			identifier: (parsed) => String(parsed.identifier),
			log: (parsed) => ({ id: String(parsed.identifier) }),
		},
	);
