import type { GoogleSearchConsoleEndpoints } from '..';
import { siteSegment } from '../client';
import { call, rowCount } from './call';
import {
	GoogleSearchConsoleEndpointInputSchemas as Inputs,
	GoogleSearchConsoleEndpointOutputSchemas as Outputs,
} from './types';

export const list: GoogleSearchConsoleEndpoints['sitesList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sites.list',
			input: Inputs.sitesList,
			output: Outputs.sitesList,
		},
		rawInput,
		() => ({ method: 'GET', path: '/webmasters/v3/sites' }),
		(result) => rowCount(result.siteEntry),
	);

export const get: GoogleSearchConsoleEndpoints['sitesGet'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sites.get',
			input: Inputs.sitesGet,
			output: Outputs.sitesGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}`,
		}),
	);

/**
 * sites.add is a PUT of the property URL with no body. It adds a property the
 * account already controls; verifying a new one is a Search Console flow, not
 * an API call.
 */
export const add: GoogleSearchConsoleEndpoints['sitesAdd'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sites.add',
			input: Inputs.sitesAdd,
			output: Outputs.sitesAdd,
		},
		rawInput,
		(input) => ({
			method: 'PUT',
			path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}`,
		}),
	);

export const remove: GoogleSearchConsoleEndpoints['sitesDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sites.delete',
			input: Inputs.sitesDelete,
			output: Outputs.sitesDelete,
		},
		rawInput,
		(input) => ({
			method: 'DELETE',
			path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}`,
		}),
	);
