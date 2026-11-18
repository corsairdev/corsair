import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

export const get: EventbriteEndpoints['venueGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'venues.get',
			input: Inputs.venueGet,
			output: Outputs.venueGet,
		},
		input,
		({ venue_id }) => ({
			method: 'GET',
			path: `/venues/${segment(venue_id)}/`,
		}),
		{
			log: ({ venue_id }) => ({ venueId: venue_id }),
		},
	);

/**
 * This route answers 500 INTERNAL_ERROR for an organization with no venues
 * rather than an empty page, so a caller filtering an empty result should
 * expect a throw, not `venues: []`.
 */
export const list: EventbriteEndpoints['venuesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'venues.list',
			input: Inputs.venuesList,
			output: Outputs.venuesList,
		},
		input,
		({ organization_id, page_size, continuation, page }) => ({
			method: 'GET',
			path: `/organizations/${segment(organization_id)}/venues/`,
			query: { page_size, continuation, page },
		}),
		{
			log: ({ organization_id }, result) => ({
				organizationId: organization_id,
				count: result.venues.length,
			}),
		},
	);

export const create: EventbriteEndpoints['venueCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'venues.create',
			input: Inputs.venueCreate,
			output: Outputs.venueCreate,
		},
		input,
		({ organization_id, venue }) => ({
			method: 'POST',
			path: `/organizations/${segment(organization_id)}/venues/`,
			body: { venue },
		}),
		{
			log: ({ organization_id }, result) => ({
				organizationId: organization_id,
				venueId: result.id ?? undefined,
			}),
		},
	);

export const update: EventbriteEndpoints['venueUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'venues.update',
			input: Inputs.venueUpdate,
			output: Outputs.venueUpdate,
		},
		input,
		({ venue_id, venue }) => ({
			method: 'POST',
			path: `/venues/${segment(venue_id)}/`,
			body: { venue },
		}),
		{
			log: ({ venue_id }) => ({ venueId: venue_id }),
		},
	);
