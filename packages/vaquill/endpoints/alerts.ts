import type { VaquillEndpoints } from '..';
import { makeVaquillRequest } from '../client';
import { callVaquill } from './call';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './types';

export const boards: VaquillEndpoints['boards'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.boards',
		VaquillEndpointInputSchemas.boards,
		VaquillEndpointOutputSchemas.boards,
		input,
		(validated) =>
			makeVaquillRequest('/boards', ctx.key, {
				method: 'GET',
				query: {
					corpusType: validated.corpusType,
					state: validated.state,
					limit: validated.limit,
					offset: validated.offset,
				},
			}),
		(_validated, response) => ({
			boardCount: response.data?.boards?.length ?? 0,
			total: response.data?.total,
		}),
	);
};

export const watchesList: VaquillEndpoints['watchesList'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchesList',
		VaquillEndpointInputSchemas.watchesList,
		VaquillEndpointOutputSchemas.watchesList,
		input,
		(validated) =>
			makeVaquillRequest('/watches', ctx.key, {
				method: 'GET',
				query: { limit: validated.limit, offset: validated.offset },
			}),
		() => ({}),
	);
};

export const watchesCreate: VaquillEndpoints['watchesCreate'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchesCreate',
		VaquillEndpointInputSchemas.watchesCreate,
		VaquillEndpointOutputSchemas.watchesCreate,
		input,
		(validated) =>
			makeVaquillRequest('/watches', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated) => ({
			corpusType: validated.corpusType,
			state: validated.state,
			channel: validated.channel,
		}),
	);
};

export const watchesTest: VaquillEndpoints['watchesTest'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchesTest',
		VaquillEndpointInputSchemas.watchesTest,
		VaquillEndpointOutputSchemas.watchesTest,
		input,
		(validated) =>
			makeVaquillRequest(
				`/watches/${encodeURIComponent(validated.watch_id)}/test`,
				ctx.key,
				{
					method: 'POST',
				},
			),
		(validated) => ({ watch_id: validated.watch_id }),
	);
};

export const watchesUpdate: VaquillEndpoints['watchesUpdate'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchesUpdate',
		VaquillEndpointInputSchemas.watchesUpdate,
		VaquillEndpointOutputSchemas.watchesUpdate,
		input,
		(validated) => {
			const { watch_id, ...body } = validated;
			return makeVaquillRequest(
				`/watches/${encodeURIComponent(watch_id)}`,
				ctx.key,
				{
					method: 'PATCH',
					body: body,
				},
			);
		},
		(validated) => ({ watch_id: validated.watch_id }),
	);
};

export const watchesDelete: VaquillEndpoints['watchesDelete'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchesDelete',
		VaquillEndpointInputSchemas.watchesDelete,
		VaquillEndpointOutputSchemas.watchesDelete,
		input,
		(validated) =>
			makeVaquillRequest(
				`/watches/${encodeURIComponent(validated.watch_id)}`,
				ctx.key,
				{
					method: 'DELETE',
				},
			),
		(validated) => ({ watch_id: validated.watch_id }),
	);
};

export const watchChanges: VaquillEndpoints['watchChanges'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchChanges',
		VaquillEndpointInputSchemas.watchChanges,
		VaquillEndpointOutputSchemas.watchChanges,
		input,
		(validated) =>
			makeVaquillRequest(
				`/watches/${encodeURIComponent(validated.watch_id)}/changes`,
				ctx.key,
				{
					method: 'GET',
					query: {
						limit: validated.limit,
						sinceId: validated.sinceId,
						beforeId: validated.beforeId,
						since: validated.since,
						changeKind: validated.changeKind,
						order: validated.order,
					},
				},
			),
		(validated, response) => ({
			watch_id: validated.watch_id,
			changeCount: response.data?.changes?.length ?? 0,
		}),
	);
};

export const watchChangeDiff: VaquillEndpoints['watchChangeDiff'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchChangeDiff',
		VaquillEndpointInputSchemas.watchChangeDiff,
		VaquillEndpointOutputSchemas.watchChangeDiff,
		input,
		(validated) =>
			makeVaquillRequest(
				`/watches/${encodeURIComponent(validated.watch_id)}/changes/${validated.change_id}/diff`,
				ctx.key,
				{ method: 'GET' },
			),
		(validated) => ({
			watch_id: validated.watch_id,
			change_id: validated.change_id,
		}),
	);
};

export const watchDeliveries: VaquillEndpoints['watchDeliveries'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.alerts.watchDeliveries',
		VaquillEndpointInputSchemas.watchDeliveries,
		VaquillEndpointOutputSchemas.watchDeliveries,
		input,
		(validated) =>
			makeVaquillRequest(
				`/watches/${encodeURIComponent(validated.watch_id)}/deliveries`,
				ctx.key,
				{
					method: 'GET',
					query: { limit: validated.limit },
				},
			),
		(_validated, response) => ({
			deliveryCount: response.data?.deliveries?.length ?? 0,
		}),
	);
};
