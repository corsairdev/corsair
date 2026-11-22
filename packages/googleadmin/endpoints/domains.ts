import type { GoogleAdminEndpoints } from '..';
import { segment } from '../client';
import { call, pageCount } from './call';
import {
	GoogleAdminEndpointInputSchemas as Inputs,
	GoogleAdminEndpointOutputSchemas as Outputs,
} from './types';

/** The account's domains, plus the customer record that names the primary one. */

export const list: GoogleAdminEndpoints['domainsList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainsList,
			output: Outputs.domainsList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/customer/${segment(input.customer)}/domains`,
		}),
		(result) => pageCount(result.domains),
	);

export const get: GoogleAdminEndpoints['domainsGet'] = async (ctx, rawInput) =>
	call(
		ctx,
		{
			event: 'domains.get',
			input: Inputs.domainsGet,
			output: Outputs.domainsGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/customer/${segment(input.customer)}/domains/${segment(input.domainName)}`,
		}),
	);

export const aliasesList: GoogleAdminEndpoints['domainAliasesList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'domainAliases.list',
			input: Inputs.domainAliasesList,
			output: Outputs.domainAliasesList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/customer/${segment(input.customer)}/domainaliases`,
			query: { parentDomainName: input.parentDomainName ?? undefined },
		}),
		(result) => pageCount(result.domainAliases),
	);

export const customerGet: GoogleAdminEndpoints['customersGet'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/customers/${segment(input.customerKey)}`,
		}),
	);
