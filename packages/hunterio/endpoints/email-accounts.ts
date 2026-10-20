import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['emailAccountsList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailAccountsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailAccountsList']
	>('/email-accounts', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailAccountsList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailAccounts.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['emailAccountsGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailAccountsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailAccountsGet']
	>(`/email-accounts/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailAccountsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailAccounts.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

// Settings are query parameters on this endpoint, and only the provided
// fields are changed.
export const update: HunterioEndpoints['emailAccountsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailAccountsUpdate.parse(input);
	const { id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailAccountsUpdate']
	>(`/email-accounts/${id}`, ctx.key, { method: 'PUT', query });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailAccountsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailAccounts.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['emailAccountsReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailAccountsReplace.parse(input);
	const { id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailAccountsReplace']
	>(`/email-accounts/${id}`, ctx.key, { method: 'PATCH', query });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailAccountsReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailAccounts.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const capacities: HunterioEndpoints['emailAccountsCapacities'] = async (
	ctx,
	input,
) => {
	HunterioEndpointInputSchemas.emailAccountsCapacities.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailAccountsCapacities']
	>('/email-accounts/capacities', ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailAccountsCapacities.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailAccounts.capacities',
		{},
		'completed',
	);

	return parsedResponse;
};

export const healthReport: HunterioEndpoints['emailAccountsHealthReport'] =
	async (ctx, input) => {
		const parsed =
			HunterioEndpointInputSchemas.emailAccountsHealthReport.parse(input);

		const response = await makeHunterioRequest<
			HunterioEndpointOutputs['emailAccountsHealthReport']
		>(`/email-accounts/${parsed.id}/health-report`, ctx.key, {
			method: 'GET',
		});

		const parsedResponse =
			HunterioEndpointOutputSchemas.emailAccountsHealthReport.parse(response);

		await logEventFromContext(
			ctx,
			'hunterio.emailAccounts.healthReport',
			{ id: parsed.id },
			'completed',
		);

		return parsedResponse;
	};

export const usage: HunterioEndpoints['emailAccountsUsage'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailAccountsUsage.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailAccountsUsage']
	>(`/email-accounts/${parsed.id}/usage`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailAccountsUsage.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailAccounts.usage',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const warmupReport: HunterioEndpoints['emailAccountsWarmupReport'] =
	async (ctx, input) => {
		const parsed =
			HunterioEndpointInputSchemas.emailAccountsWarmupReport.parse(input);

		const response = await makeHunterioRequest<
			HunterioEndpointOutputs['emailAccountsWarmupReport']
		>(`/email-accounts/${parsed.id}/warmup-report`, ctx.key, {
			method: 'GET',
		});

		const parsedResponse =
			HunterioEndpointOutputSchemas.emailAccountsWarmupReport.parse(response);

		await logEventFromContext(
			ctx,
			'hunterio.emailAccounts.warmupReport',
			{ id: parsed.id },
			'completed',
		);

		return parsedResponse;
	};

export const sequences: HunterioEndpoints['emailAccountsSequences'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.emailAccountsSequences.parse(input);
	const { email_account_id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailAccountsSequences']
	>(`/email-accounts/${email_account_id}/sequences`, ctx.key, {
		method: 'GET',
		query,
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailAccountsSequences.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailAccounts.sequences',
		{ emailAccountId: email_account_id },
		'completed',
	);

	return parsedResponse;
};
