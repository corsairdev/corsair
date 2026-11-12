import type { RetentlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const list: RetentlyEndpoints['companiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.list',
			input: Inputs.companiesList,
			output: Outputs.companiesList,
		},
		input,
		({ page, limit, sort }) => ({
			method: 'GET',
			path: '/companies',
			query: { page, limit, sort },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.data?.companies?.length ?? 0,
				total: result.data?.total ?? undefined,
			}),
		},
	);

export const get: RetentlyEndpoints['companiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.get',
			input: Inputs.companiesGet,
			output: Outputs.companiesGet,
		},
		input,
		({ companyId }) => ({
			method: 'GET',
			// The segment takes an ID or a domain; both are percent-encoded so a
			// domain's dot survives unharmed either way.
			path: `/companies/${segment(companyId)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({ company: result.data?.companyName ?? undefined }),
		},
	);
