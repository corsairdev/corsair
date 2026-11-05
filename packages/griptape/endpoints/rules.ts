import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const listRules: GriptapeEndpoints['ruleList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['ruleList']
	>('rules', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.rule.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createRule: GriptapeEndpoints['ruleCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['ruleCreate']
	>('rules', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.rule.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const getRule: GriptapeEndpoints['ruleGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['ruleGet']
	>(`rules/${input.rule_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.rule.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateRule: GriptapeEndpoints['ruleUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['ruleUpdate']
	>(`rules/${input.rule_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.rule.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const removeRule: GriptapeEndpoints['ruleDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['ruleDelete']
	>(`rules/${input.rule_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.rule.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const createRuleset: GriptapeEndpoints['rulesetCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['rulesetCreate']
	>('rulesets', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.ruleset.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const getRuleset: GriptapeEndpoints['rulesetGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['rulesetGet']
	>(`rulesets/${input.ruleset_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.ruleset.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const getRulesetByAlias: GriptapeEndpoints['rulesetGetByAlias'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['rulesetGetByAlias']
	>('rulesets', ctx.key, {
		method: 'GET',
		query: {
			alias: input.alias,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.ruleset.getByAlias',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateRuleset: GriptapeEndpoints['rulesetUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['rulesetUpdate']
	>(`rulesets/${input.ruleset_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.ruleset.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const removeRuleset: GriptapeEndpoints['rulesetDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['rulesetDelete']
	>(`rulesets/${input.ruleset_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.ruleset.delete',
		{ ...input },
		'completed',
	);

	return response;
};
