import { logEventFromContext } from 'corsair/core';
import { makeCloudflareRequest } from '../client';
import type { CloudflareEndpoints } from '../index';
import {
	persistRuleset,
	deleteRuleset as removeRulesetFromDb,
} from '../persist';
import type { CloudflareEndpointOutputs } from './types';

export const list: CloudflareEndpoints['rulesetsList'] = async (ctx, input) => {
	const { zone_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['rulesetsList']
	>(`/zones/${zone_id}/rulesets`, ctx.key, { method: 'GET' });

	if (ctx.db.rulesets) {
		for (const ruleset of result) {
			await persistRuleset(ruleset, zone_id, ctx.db);
		}
	}

	await logEventFromContext(
		ctx,
		'cloudflare.rulesets.list',
		{ zone_id },
		'completed',
	);
	return result;
};

export const get: CloudflareEndpoints['rulesetsGet'] = async (ctx, input) => {
	const { zone_id, ruleset_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['rulesetsGet']
	>(`/zones/${zone_id}/rulesets/${ruleset_id}`, ctx.key, { method: 'GET' });

	await persistRuleset(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.rulesets.get',
		{ zone_id, ruleset_id },
		'completed',
	);
	return result;
};

export const create: CloudflareEndpoints['rulesetsCreate'] = async (
	ctx,
	input,
) => {
	const { zone_id, ...body } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['rulesetsCreate']
	>(`/zones/${zone_id}/rulesets`, ctx.key, { method: 'POST', body });

	await persistRuleset(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.rulesets.create',
		{ zone_id },
		'completed',
	);
	return result;
};

export const update: CloudflareEndpoints['rulesetsUpdate'] = async (
	ctx,
	input,
) => {
	const { zone_id, ruleset_id, ...body } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['rulesetsUpdate']
	>(`/zones/${zone_id}/rulesets/${ruleset_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await persistRuleset(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.rulesets.update',
		{ zone_id, ruleset_id },
		'completed',
	);
	return result;
};

export const deleteRuleset: CloudflareEndpoints['rulesetsDelete'] = async (
	ctx,
	input,
) => {
	const { zone_id, ruleset_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['rulesetsDelete']
	>(`/zones/${zone_id}/rulesets/${ruleset_id}`, ctx.key, { method: 'DELETE' });

	await removeRulesetFromDb(ruleset_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.rulesets.delete',
		{ zone_id, ruleset_id },
		'completed',
	);
	return result;
};
