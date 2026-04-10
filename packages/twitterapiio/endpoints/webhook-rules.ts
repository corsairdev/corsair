import { logEventFromContext } from 'corsair/core';
import type { TwitterApiIOEndpoints } from '..';
import { makeTwitterApiIORequest } from '../client';
import type { TwitterApiIOEndpointOutputs } from './types';

export const addRule: TwitterApiIOEndpoints['apiWebhooksAddRule'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['apiWebhooksAddRule']
	>('/oapi/tweet_filter/add_rule', ctx.key, {
		method: 'POST',
		body: {
			tag: input.tag,
			value: input.value,
			interval_seconds: input.intervalSeconds,
		},
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.api.webhooks.addRule',
		{ tag: input.tag },
		'completed',
	);
	return response;
};

export const getRules: TwitterApiIOEndpoints['apiWebhooksGetRules'] = async (
	ctx,
	_input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['apiWebhooksGetRules']
	>('/oapi/tweet_filter/get_rules', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.api.webhooks.getRules',
		{},
		'completed',
	);
	return response;
};

export const updateRule: TwitterApiIOEndpoints['apiWebhooksUpdateRule'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['apiWebhooksUpdateRule']
		>('/oapi/tweet_filter/update_rule', ctx.key, {
			method: 'POST',
			body: {
				rule_id: input.ruleId,
				tag: input.tag,
				value: input.value,
				interval_seconds: input.intervalSeconds,
				is_effect: input.isActive ? 1 : 0,
			},
		});

		await logEventFromContext(
			ctx,
			'twitterapiio.api.webhooks.updateRule',
			{ ruleId: input.ruleId },
			'completed',
		);
		return response;
	};

export const deleteRule: TwitterApiIOEndpoints['apiWebhooksDeleteRule'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['apiWebhooksDeleteRule']
		>('/oapi/tweet_filter/delete_rule', ctx.key, {
			method: 'DELETE',
			body: { rule_id: input.ruleId },
		});

		await logEventFromContext(
			ctx,
			'twitterapiio.api.webhooks.deleteRule',
			{ ruleId: input.ruleId },
			'completed',
		);
		return response;
	};
