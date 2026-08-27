import { logEventFromContext } from 'corsair/core';
import { makeBorneoRequest } from '../client';
import type { BorneoEndpoints, BorneoKeyBuilderContext } from '../index';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './types';

async function resolveBorneoBaseUrl(
	ctx: Pick<BorneoKeyBuilderContext, 'options'> & {
		keys?: BorneoKeyBuilderContext['keys'];
	},
): Promise<string> {
	const fromOptions = ctx.options?.baseUrl?.trim();
	if (fromOptions) return fromOptions;

	const fromAccount = await ctx.keys?.get_base_url?.();
	if (fromAccount?.trim()) return fromAccount.trim();

	throw new Error(
		'[borneo] baseUrl is required — set plugin options.baseUrl or account base_url',
	);
}

export const createAsset: BorneoEndpoints['createAsset'] = async (
	ctx,
	rawInput,
) => {
	const input = BorneoEndpointInputSchemas.createAsset.parse(rawInput ?? {});
	const baseUrl = await resolveBorneoBaseUrl(ctx);

	const response = await makeBorneoRequest<unknown>('/assets', ctx.key, {
		method: 'POST',
		body: input,
		baseUrl,
	});

	const parsed = BorneoEndpointOutputSchemas.createAsset.parse(response);
	await logEventFromContext(
		ctx,
		'borneo.assets.createAsset',
		{ method: 'POST', path: '/assets' },
		'completed',
	);
	return parsed;
};

export const retrieveAsset: BorneoEndpoints['retrieveAsset'] = async (
	ctx,
	rawInput,
) => {
	const input = BorneoEndpointInputSchemas.retrieveAsset.parse(rawInput ?? {});
	const baseUrl = await resolveBorneoBaseUrl(ctx);
	const path = `/assets/${encodeURIComponent(input.assetId)}`;

	const response = await makeBorneoRequest<unknown>(path, ctx.key, {
		method: 'GET',
		baseUrl,
	});

	const parsed = BorneoEndpointOutputSchemas.retrieveAsset.parse(response);
	await logEventFromContext(
		ctx,
		'borneo.assets.retrieveAsset',
		{ method: 'GET', path: '/assets/{assetId}' },
		'completed',
	);
	return parsed;
};

export const updateAsset: BorneoEndpoints['updateAsset'] = async (
	ctx,
	rawInput,
) => {
	const input = BorneoEndpointInputSchemas.updateAsset.parse(rawInput ?? {});
	const baseUrl = await resolveBorneoBaseUrl(ctx);
	const { assetId, ...body } = input;
	const path = `/assets/${encodeURIComponent(assetId)}`;

	const response = await makeBorneoRequest<unknown>(path, ctx.key, {
		method: 'PUT',
		body,
		baseUrl,
	});

	const parsed = BorneoEndpointOutputSchemas.updateAsset.parse(response);
	await logEventFromContext(
		ctx,
		'borneo.assets.updateAsset',
		{ method: 'PUT', path: '/assets/{assetId}' },
		'completed',
	);
	return parsed;
};

export const deleteAsset: BorneoEndpoints['deleteAsset'] = async (
	ctx,
	rawInput,
) => {
	const input = BorneoEndpointInputSchemas.deleteAsset.parse(rawInput ?? {});
	const baseUrl = await resolveBorneoBaseUrl(ctx);
	const path = `/assets/${encodeURIComponent(input.assetId)}`;

	const response = await makeBorneoRequest<unknown>(path, ctx.key, {
		method: 'DELETE',
		baseUrl,
	});

	const parsed = BorneoEndpointOutputSchemas.deleteAsset.parse(response);
	await logEventFromContext(
		ctx,
		'borneo.assets.deleteAsset',
		{ method: 'DELETE', path: '/assets/{assetId}' },
		'completed',
	);
	return parsed;
};
