import { logEventFromContext } from 'corsair/core';
import { compactQuery, makeBoxheroRequest } from '../client';
import type { BoxheroEndpoints } from '../index';
import {
	BoxheroEndpointInputSchemas,
	BoxheroEndpointOutputSchemas,
} from './types';

export const listLocations: BoxheroEndpoints['locationsList'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.locationsList.parse(input ?? {});
	const result = await makeBoxheroRequest('/v1/locations', ctx.key, {
		schema: BoxheroEndpointOutputSchemas.locationsList,
	});
	await logEventFromContext(ctx, 'boxhero.locations.list', parsed, 'completed');
	return result;
};

export const getLocation: BoxheroEndpoints['locationsGet'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.locationsGet.parse(input);
	const result = await makeBoxheroRequest(
		`/v1/locations/${parsed.location_id}`,
		ctx.key,
		{ schema: BoxheroEndpointOutputSchemas.locationsGet },
	);
	await logEventFromContext(ctx, 'boxhero.locations.get', parsed, 'completed');
	return result;
};

export const deleteLocation: BoxheroEndpoints['locationsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.locationsDelete.parse(input);
	const result = await makeBoxheroRequest(
		`/v1/locations/${parsed.location_id}`,
		ctx.key,
		{ method: 'DELETE', schema: BoxheroEndpointOutputSchemas.locationsDelete },
	);
	await logEventFromContext(
		ctx,
		'boxhero.locations.delete',
		parsed,
		'completed',
	);
	return result;
};

async function listTransactions(
	ctx: Parameters<BoxheroEndpoints['transactionsListBasic']>[0],
	input: Parameters<BoxheroEndpoints['transactionsListBasic']>[1],
	kind: 'transactionsListBasic' | 'transactionsListLocation',
) {
	const parsed = BoxheroEndpointInputSchemas[kind].parse(input ?? {});
	const result = await makeBoxheroRequest('/v1/transactions', ctx.key, {
		schema: BoxheroEndpointOutputSchemas[kind],
		query: compactQuery({
			type: parsed.type,
			cursor: parsed.cursor,
			limit: parsed.limit,
		}),
	});
	const event =
		kind === 'transactionsListBasic'
			? 'boxhero.transactions.listBasic'
			: 'boxhero.transactions.listLocation';
	await logEventFromContext(ctx, event, parsed, 'completed');
	return result;
}

export const listBasic: BoxheroEndpoints['transactionsListBasic'] = async (
	ctx,
	input,
) => listTransactions(ctx, input, 'transactionsListBasic');

/**
 * Location-mode history is `GET /v1/transactions`. Open API has no mode
 * query; LOCATION is the linked team's `mode = 2`.
 */
export const listLocation: BoxheroEndpoints['transactionsListLocation'] =
	async (ctx, input) =>
		listTransactions(ctx, input, 'transactionsListLocation');

export const listPartners: BoxheroEndpoints['partnersList'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.partnersList.parse(input ?? {});
	const result = await makeBoxheroRequest('/v1/partners', ctx.key, {
		schema: BoxheroEndpointOutputSchemas.partnersList,
		query: compactQuery({
			type: parsed.type,
			cursor: parsed.cursor,
			limit: parsed.limit,
		}),
	});
	await logEventFromContext(ctx, 'boxhero.partners.list', parsed, 'completed');
	return result;
};

export const listItems: BoxheroEndpoints['itemsList'] = async (ctx, input) => {
	const parsed = BoxheroEndpointInputSchemas.itemsList.parse(input ?? {});
	const result = await makeBoxheroRequest('/v1/items', ctx.key, {
		schema: BoxheroEndpointOutputSchemas.itemsList,
		query: compactQuery({
			item_ids: parsed.item_ids,
			location_ids: parsed.location_ids,
			cursor: parsed.cursor,
			limit: parsed.limit,
		}),
	});
	await logEventFromContext(ctx, 'boxhero.items.list', parsed, 'completed');
	return result;
};

export const getItem: BoxheroEndpoints['itemsGet'] = async (ctx, input) => {
	const parsed = BoxheroEndpointInputSchemas.itemsGet.parse(input);
	const result = await makeBoxheroRequest(
		`/v1/items/${parsed.item_id}`,
		ctx.key,
		{
			schema: BoxheroEndpointOutputSchemas.itemsGet,
			query: compactQuery({ location_ids: parsed.location_ids }),
		},
	);
	await logEventFromContext(ctx, 'boxhero.items.get', parsed, 'completed');
	return result;
};

export const deleteItem: BoxheroEndpoints['itemsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.itemsDelete.parse(input);
	const result = await makeBoxheroRequest(
		`/v1/items/${parsed.item_id}`,
		ctx.key,
		{ method: 'DELETE', schema: BoxheroEndpointOutputSchemas.itemsDelete },
	);
	await logEventFromContext(ctx, 'boxhero.items.delete', parsed, 'completed');
	return result;
};

export const listItemAttributes: BoxheroEndpoints['itemAttributesList'] =
	async (ctx, input) => {
		const parsed = BoxheroEndpointInputSchemas.itemAttributesList.parse(
			input ?? {},
		);
		const result = await makeBoxheroRequest('/v1/item-attrs', ctx.key, {
			schema: BoxheroEndpointOutputSchemas.itemAttributesList,
		});
		await logEventFromContext(
			ctx,
			'boxhero.itemAttributes.list',
			parsed,
			'completed',
		);
		return result;
	};

export const getItemAttribute: BoxheroEndpoints['itemAttributesGet'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.itemAttributesGet.parse(input);
	const result = await makeBoxheroRequest(
		`/v1/item-attrs/${parsed.attr_id}`,
		ctx.key,
		{ schema: BoxheroEndpointOutputSchemas.itemAttributesGet },
	);
	await logEventFromContext(
		ctx,
		'boxhero.itemAttributes.get',
		parsed,
		'completed',
	);
	return result;
};

export const getTeamInfo: BoxheroEndpoints['teamsGetInfo'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.teamsGetInfo.parse(input ?? {});
	const result = await makeBoxheroRequest('/v1/teams/linked', ctx.key, {
		schema: BoxheroEndpointOutputSchemas.teamsGetInfo,
	});
	await logEventFromContext(ctx, 'boxhero.teams.getInfo', parsed, 'completed');
	return result;
};

export const listMembers: BoxheroEndpoints['membersList'] = async (
	ctx,
	input,
) => {
	const parsed = BoxheroEndpointInputSchemas.membersList.parse(input ?? {});
	const result = await makeBoxheroRequest('/v1/members', ctx.key, {
		schema: BoxheroEndpointOutputSchemas.membersList,
	});
	await logEventFromContext(ctx, 'boxhero.members.list', parsed, 'completed');
	return result;
};

export const getMember: BoxheroEndpoints['membersGet'] = async (ctx, input) => {
	const parsed = BoxheroEndpointInputSchemas.membersGet.parse(input);
	const result = await makeBoxheroRequest(
		`/v1/members/${parsed.member_id}`,
		ctx.key,
		{ schema: BoxheroEndpointOutputSchemas.membersGet },
	);
	await logEventFromContext(ctx, 'boxhero.members.get', parsed, 'completed');
	return result;
};
