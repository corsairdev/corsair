import type { SimplekpiEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Frequencies, icons and units are read-mostly lookups that a KPI's
 * `frequency_id`, `icon_id` and `unit_id` must match. Frequencies and icons are
 * read-only; units also take writes.
 */
export const frequenciesList: SimplekpiEndpoints['kpiFrequenciesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'kpiFrequencies.list',
			input: Inputs.kpiFrequenciesList,
			output: Outputs.kpiFrequenciesList,
		},
		input,
		() => ({ method: 'GET', path: '/v1/kpifrequencies' }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const frequenciesGet: SimplekpiEndpoints['kpiFrequenciesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'kpiFrequencies.get',
			input: Inputs.kpiFrequenciesGet,
			output: Outputs.kpiFrequenciesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/v1/kpifrequencies/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ frequencyId: id }) },
	);

export const iconsList: SimplekpiEndpoints['kpiIconsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiIcons.list',
			input: Inputs.kpiIconsList,
			output: Outputs.kpiIconsList,
		},
		input,
		() => ({ method: 'GET', path: '/v1/kpiicons' }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const iconsGet: SimplekpiEndpoints['kpiIconsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiIcons.get',
			input: Inputs.kpiIconsGet,
			output: Outputs.kpiIconsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/v1/kpiicons/${segment(id)}` }),
		{ log: ({ id }) => ({ iconId: id }) },
	);
