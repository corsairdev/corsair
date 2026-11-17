import type { TaveEndpoints } from '..';
import { call } from './call';
import {
	ListOnlyInputSchema,
	NamedResourceListResponseSchema,
	StudioInputSchema,
	StudioResponseSchema,
} from './types';

// Job types, lead sources, lead statuses and brands are read-only here: the
// plugin lists them so a caller can find the ID that `jobs.create` takes, and
// leaves their creation to the studio UI. Each is written out separately
// because a shared factory collapses their distinct endpoint types.

export const jobTypesList: TaveEndpoints['jobTypesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'jobTypes.list',
			input: ListOnlyInputSchema,
			output: NamedResourceListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/job-type',
			query: { page: parsed.page, pageSize: parsed.pageSize },
		}),
	);
};

export const leadSourcesList: TaveEndpoints['leadSourcesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'leadSources.list',
			input: ListOnlyInputSchema,
			output: NamedResourceListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/lead-source',
			query: { page: parsed.page, pageSize: parsed.pageSize },
		}),
	);
};

export const leadStatusesList: TaveEndpoints['leadStatusesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'leadStatuses.list',
			input: ListOnlyInputSchema,
			output: NamedResourceListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/lead-status',
			query: { page: parsed.page, pageSize: parsed.pageSize },
		}),
	);
};

export const brandsList: TaveEndpoints['brandsList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'brands.list',
			input: ListOnlyInputSchema,
			output: NamedResourceListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/brand',
			query: { page: parsed.page, pageSize: parsed.pageSize },
		}),
	);
};

export const studioGet: TaveEndpoints['studioGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'studio.get',
			input: StudioInputSchema,
			output: StudioResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/studio/me' }),
	);
};
