import type { LushaEndpoints } from '..';
import { billingLog, call } from './call';
import {
	LushaEndpointInputSchemas as Inputs,
	LushaEndpointOutputSchemas as Outputs,
} from './types';

export const searchContacts: LushaEndpoints['personSearchContacts'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'person.searchContacts',
			input: Inputs.personSearchContacts,
			output: Outputs.personSearchContacts,
		},
		input,
		({ contacts, options, signals }) => ({
			method: 'POST',
			path: '/v3/contacts/search',
			body: { contacts, options, signals },
			// Charged per matched result; a 5xx replay could charge twice.
			metered: true,
		}),
		{ log: (_, result) => billingLog(result) },
	);

export const enrichContacts: LushaEndpoints['personEnrichContacts'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'person.enrichContacts',
			input: Inputs.personEnrichContacts,
			output: Outputs.personEnrichContacts,
		},
		input,
		({ ids, reveal, waterfallEnabled, tableId }) => ({
			method: 'POST',
			path: '/v3/contacts/enrich',
			body: { ids, reveal, waterfallEnabled, tableId },
			metered: true,
		}),
		{ log: (_, result) => billingLog(result) },
	);

export const searchAndEnrichContacts: LushaEndpoints['personSearchAndEnrichContacts'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'person.searchAndEnrichContacts',
				input: Inputs.personSearchAndEnrichContacts,
				output: Outputs.personSearchAndEnrichContacts,
			},
			input,
			({ contacts, reveal, options }) => ({
				method: 'POST',
				path: '/v3/contacts/search-and-enrich',
				body: { contacts, reveal, options },
				metered: true,
			}),
			{ log: (_, result) => billingLog(result) },
		);
