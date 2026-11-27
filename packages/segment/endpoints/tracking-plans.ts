import type { SegmentEndpoints } from '..';
import { paginationQuery, pathSegment } from '../client';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const list: SegmentEndpoints['trackingPlansList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trackingPlans.list',
			input: Inputs.trackingPlansList,
			output: Outputs.trackingPlansList,
		},
		input,
		({ type, count, cursor }) => ({
			method: 'GET',
			path: '/tracking-plans',
			query: { type, ...paginationQuery(count, cursor) },
		}),
		{ log: (_, result) => ({ count: result.data.trackingPlans.length }) },
	);

export const get: SegmentEndpoints['trackingPlansGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trackingPlans.get',
			input: Inputs.trackingPlansGet,
			output: Outputs.trackingPlansGet,
		},
		input,
		({ trackingPlanId }) => ({
			method: 'GET',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}`,
		}),
		{ log: ({ trackingPlanId }) => ({ trackingPlanId }) },
	);

export const listRules: SegmentEndpoints['trackingPlansListRules'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'trackingPlans.listRules',
			input: Inputs.trackingPlansListRules,
			output: Outputs.trackingPlansListRules,
		},
		input,
		({ trackingPlanId, count, cursor }) => ({
			method: 'GET',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}/rules`,
			query: paginationQuery(count, cursor),
		}),
		{
			log: ({ trackingPlanId }, result) => ({
				trackingPlanId,
				count: result.data.rules.length,
			}),
		},
	);

export const listSources: SegmentEndpoints['trackingPlansListSources'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'trackingPlans.listSources',
			input: Inputs.trackingPlansListSources,
			output: Outputs.trackingPlansListSources,
		},
		input,
		({ trackingPlanId, count, cursor }) => ({
			method: 'GET',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}/sources`,
			query: paginationQuery(count, cursor),
		}),
		{
			log: ({ trackingPlanId }, result) => ({
				trackingPlanId,
				count: result.data.sources.length,
			}),
		},
	);

export const create: SegmentEndpoints['trackingPlansCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trackingPlans.create',
			input: Inputs.trackingPlansCreate,
			output: Outputs.trackingPlansCreate,
		},
		input,
		({ name, description, type }) => ({
			method: 'POST',
			path: '/tracking-plans',
			body: { name, description, type },
		}),
		{
			log: (_, result) => ({
				trackingPlanId: result.data.trackingPlan.id ?? '',
			}),
		},
	);

export const update: SegmentEndpoints['trackingPlansUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trackingPlans.update',
			input: Inputs.trackingPlansUpdate,
			output: Outputs.trackingPlansUpdate,
		},
		input,
		({ trackingPlanId, name, description }) => ({
			method: 'PATCH',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}`,
			body: { name, description },
		}),
		{ log: ({ trackingPlanId }) => ({ trackingPlanId }) },
	);

// Replaces the whole rule set: the plan loses any rule not in the array.
export const replaceRules: SegmentEndpoints['trackingPlansReplaceRules'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'trackingPlans.replaceRules',
			input: Inputs.trackingPlansReplaceRules,
			output: Outputs.trackingPlansReplaceRules,
		},
		input,
		({ trackingPlanId, rules }) => ({
			method: 'PUT',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}/rules`,
			body: { rules },
		}),
		{
			log: ({ trackingPlanId, rules }) => ({
				trackingPlanId,
				rules: rules.length,
			}),
		},
	);

export const addSource: SegmentEndpoints['trackingPlansAddSource'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'trackingPlans.addSource',
			input: Inputs.trackingPlansAddSource,
			output: Outputs.trackingPlansAddSource,
		},
		input,
		({ trackingPlanId, sourceId }) => ({
			method: 'POST',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}/sources`,
			body: { sourceId },
		}),
		{ log: ({ trackingPlanId, sourceId }) => ({ trackingPlanId, sourceId }) },
	);

export const remove: SegmentEndpoints['trackingPlansDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trackingPlans.delete',
			input: Inputs.trackingPlansDelete,
			output: Outputs.trackingPlansDelete,
		},
		input,
		({ trackingPlanId }) => ({
			method: 'DELETE',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}`,
		}),
		{ log: ({ trackingPlanId }) => ({ trackingPlanId }) },
	);

// The source id is a query parameter on this route, not a path segment.
export const removeSource: SegmentEndpoints['trackingPlansRemoveSource'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'trackingPlans.removeSource',
			input: Inputs.trackingPlansRemoveSource,
			output: Outputs.trackingPlansRemoveSource,
		},
		input,
		({ trackingPlanId, sourceId }) => ({
			method: 'DELETE',
			path: `/tracking-plans/${pathSegment(trackingPlanId)}/sources`,
			query: { sourceId },
		}),
		{ log: ({ trackingPlanId, sourceId }) => ({ trackingPlanId, sourceId }) },
	);
