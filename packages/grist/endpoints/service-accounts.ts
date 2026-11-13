import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['serviceAccounts.list'] = async (
	ctx,
	input,
) => {
	GristEndpointInputSchemas['serviceAccounts.list'].parse(input);
	const response = await makeGristRequest<unknown>(
		'/service-accounts',
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['serviceAccounts.list'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.serviceAccounts.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const create: GristEndpoints['serviceAccounts.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['serviceAccounts.create'].parse(input);
	const response = await makeGristRequest<unknown>(
		'/service-accounts',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: parsedInput.name,
				...(parsedInput.label !== undefined
					? { label: parsedInput.label }
					: {}),
			},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['serviceAccounts.create'].parse(response);
	// Never log API key
	await logEventFromContext(
		ctx,
		'grist.serviceAccounts.create',
		{ saId: parsed.id },
		'completed',
	);
	return parsed;
};

export const get: GristEndpoints['serviceAccounts.get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['serviceAccounts.get'].parse(input);
	const saIdStr = encodeURIComponent(String(parsedInput.saId));
	const response = await makeGristRequest<unknown>(
		`/service-accounts/${saIdStr}`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['serviceAccounts.get'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.serviceAccounts.get',
		{ saId: parsedInput.saId },
		'completed',
	);
	return parsed;
};

export const update: GristEndpoints['serviceAccounts.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['serviceAccounts.update'].parse(input);
	const saIdStr = encodeURIComponent(String(parsedInput.saId));
	const response = await makeGristRequest<unknown>(
		`/service-accounts/${saIdStr}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(parsedInput.name !== undefined ? { name: parsedInput.name } : {}),
				...(parsedInput.label !== undefined
					? { label: parsedInput.label }
					: {}),
			},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['serviceAccounts.update'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.serviceAccounts.update',
		{ saId: parsedInput.saId },
		'completed',
	);
	return parsed;
};

export const deleteServiceAccount: GristEndpoints['serviceAccounts.delete'] =
	async (ctx, input) => {
		const parsedInput =
			GristEndpointInputSchemas['serviceAccounts.delete'].parse(input);
		const saIdStr = encodeURIComponent(String(parsedInput.saId));
		const response = await makeGristRequest<unknown>(
			`/service-accounts/${saIdStr}`,
			ctx.key,
			{
				method: 'DELETE',
				baseUrl: ctx.options?.baseUrl,
			},
		);
		const parsed =
			GristEndpointOutputSchemas['serviceAccounts.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'grist.serviceAccounts.delete',
			{ saId: parsedInput.saId },
			'completed',
		);
		return parsed;
	};

export const regenerateApiKey: GristEndpoints['serviceAccounts.regenerateApiKey'] =
	async (ctx, input) => {
		const parsedInput =
			GristEndpointInputSchemas['serviceAccounts.regenerateApiKey'].parse(
				input,
			);
		const saIdStr = encodeURIComponent(String(parsedInput.saId));
		const response = await makeGristRequest<unknown>(
			`/service-accounts/${saIdStr}/apikey`,
			ctx.key,
			{
				method: 'POST',
				baseUrl: ctx.options?.baseUrl,
			},
		);
		const parsed =
			GristEndpointOutputSchemas['serviceAccounts.regenerateApiKey'].parse(
				response,
			);
		// Never log generated key
		await logEventFromContext(
			ctx,
			'grist.serviceAccounts.regenerateApiKey',
			{ saId: parsedInput.saId },
			'completed',
		);
		return parsed;
	};

export const deleteApiKey: GristEndpoints['serviceAccounts.deleteApiKey'] =
	async (ctx, input) => {
		const parsedInput =
			GristEndpointInputSchemas['serviceAccounts.deleteApiKey'].parse(input);
		const saIdStr = encodeURIComponent(String(parsedInput.saId));
		const response = await makeGristRequest<unknown>(
			`/service-accounts/${saIdStr}/apikey`,
			ctx.key,
			{
				method: 'DELETE',
				baseUrl: ctx.options?.baseUrl,
			},
		);
		const parsed =
			GristEndpointOutputSchemas['serviceAccounts.deleteApiKey'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'grist.serviceAccounts.deleteApiKey',
			{ saId: parsedInput.saId },
			'completed',
		);
		return parsed;
	};
