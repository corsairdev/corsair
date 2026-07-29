import { logEventFromContext } from 'corsair/core';
import { DEFAULT_REMOTE_CONTROL_BASE, makeEpicGamesRequest } from '../client';
import type { EpicGamesEndpoints } from '../index';
import type { EpicGamesEndpointOutputs } from './types';

function remoteBase(ctx: {
	options: { remoteControlBaseUrl?: string };
}): string {
	return ctx.options.remoteControlBaseUrl ?? DEFAULT_REMOTE_CONTROL_BASE;
}

function remoteOpts(ctx: {
	key: string;
	options: { remoteControlBaseUrl?: string; remoteControlBearer?: boolean };
}) {
	return {
		baseUrl: remoteBase(ctx),
		// UE Remote Control does not accept Epic OAuth tokens; opt in explicitly.
		bearer: ctx.options.remoteControlBearer ?? false,
	};
}

export const initiateSession: EpicGamesEndpoints['remoteInitiateSession'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteInitiateSession']
		>('/remote/control/session', ctx.key, {
			method: 'PUT',
			body: input,
			...remoteOpts(ctx),
		});
		await logEventFromContext(
			ctx,
			'epicgames.remote.initiateSession',
			{},
			'completed',
		);
		return result;
	};

export const batch: EpicGamesEndpoints['remoteBatch'] = async (ctx, input) => {
	const result = await makeEpicGamesRequest<
		EpicGamesEndpointOutputs['remoteBatch']
	>('/remote/batch', ctx.key, {
		method: 'PUT',
		body: { Requests: input.requests },
		...remoteOpts(ctx),
	});
	await logEventFromContext(
		ctx,
		'epicgames.remote.batch',
		{ itemCount: input.requests.length },
		'completed',
	);
	return result;
};

export const corsPreflight: EpicGamesEndpoints['remoteCorsPreflight'] = async (
	ctx,
) => {
	const result = await makeEpicGamesRequest<
		EpicGamesEndpointOutputs['remoteCorsPreflight']
	>('/remote', ctx.key, {
		method: 'OPTIONS',
		...remoteOpts(ctx),
	});
	await logEventFromContext(
		ctx,
		'epicgames.remote.corsPreflight',
		{},
		'completed',
	);
	return result;
};

export const getPreset: EpicGamesEndpoints['remoteGetPreset'] = async (
	ctx,
	input,
) => {
	const result = await makeEpicGamesRequest<
		EpicGamesEndpointOutputs['remoteGetPreset']
	>(`/remote/preset/${encodeURIComponent(input.presetName)}`, ctx.key, {
		method: 'GET',
		...remoteOpts(ctx),
	});
	await logEventFromContext(
		ctx,
		'epicgames.remote.getPreset',
		{ presetName: input.presetName },
		'completed',
	);
	return result;
};

export const getPresetMetadata: EpicGamesEndpoints['remoteGetPresetMetadata'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteGetPresetMetadata']
		>(
			`/remote/preset/${encodeURIComponent(input.presetName)}/metadata`,
			ctx.key,
			{ method: 'GET', ...remoteOpts(ctx) },
		);
		await logEventFromContext(
			ctx,
			'epicgames.remote.getPresetMetadata',
			{ presetName: input.presetName },
			'completed',
		);
		return result;
	};

export const getPresetMetadataKey: EpicGamesEndpoints['remoteGetPresetMetadataKey'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteGetPresetMetadataKey']
		>(
			`/remote/preset/${encodeURIComponent(input.presetName)}/metadata/${encodeURIComponent(input.key)}`,
			ctx.key,
			{ method: 'GET', ...remoteOpts(ctx) },
		);
		await logEventFromContext(
			ctx,
			'epicgames.remote.getPresetMetadataKey',
			{ presetName: input.presetName },
			'completed',
		);
		return result;
	};

export const putPresetMetadataKey: EpicGamesEndpoints['remotePutPresetMetadataKey'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remotePutPresetMetadataKey']
		>(
			`/remote/preset/${encodeURIComponent(input.presetName)}/metadata/${encodeURIComponent(input.key)}`,
			ctx.key,
			{
				method: 'PUT',
				body: { Value: input.value },
				...remoteOpts(ctx),
			},
		);
		await logEventFromContext(
			ctx,
			'epicgames.remote.putPresetMetadataKey',
			{ presetName: input.presetName },
			'completed',
		);
		return result;
	};

export const deletePresetMetadataKey: EpicGamesEndpoints['remoteDeletePresetMetadataKey'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteDeletePresetMetadataKey']
		>(
			`/remote/preset/${encodeURIComponent(input.presetName)}/metadata/${encodeURIComponent(input.key)}`,
			ctx.key,
			{ method: 'DELETE', ...remoteOpts(ctx) },
		);
		await logEventFromContext(
			ctx,
			'epicgames.remote.deletePresetMetadataKey',
			{ presetName: input.presetName },
			'completed',
		);
		return result;
	};

export const getPresetProperty: EpicGamesEndpoints['remoteGetPresetProperty'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteGetPresetProperty']
		>(
			`/remote/preset/${encodeURIComponent(input.presetName)}/property/${encodeURIComponent(input.propertyName)}`,
			ctx.key,
			{ method: 'GET', ...remoteOpts(ctx) },
		);
		await logEventFromContext(
			ctx,
			'epicgames.remote.getPresetProperty',
			{ presetName: input.presetName },
			'completed',
		);
		return result;
	};

export const updatePresetProperty: EpicGamesEndpoints['remoteUpdatePresetProperty'] =
	async (ctx, input) => {
		// PropertyValue is free-form UE JSON; client body type is Record | array.
		// Wrap primitives so the HTTP helper always receives a Record body.
		// cast: after typeof object guard, TS still types value as unknown from Zod

		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteUpdatePresetProperty']
		>(
			`/remote/preset/${encodeURIComponent(input.presetName)}/property/${encodeURIComponent(input.propertyName)}`,
			ctx.key,
			{
				method: 'PUT',
				body: {
					PropertyValue: input.value,
				},
				...remoteOpts(ctx),
			},
		);
		await logEventFromContext(
			ctx,
			'epicgames.remote.updatePresetProperty',
			{ presetName: input.presetName },
			'completed',
		);
		return result;
	};

export const invokePresetFunction: EpicGamesEndpoints['remoteInvokePresetFunction'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteInvokePresetFunction']
		>(
			`/remote/preset/${encodeURIComponent(input.presetName)}/function/${encodeURIComponent(input.functionName)}`,
			ctx.key,
			{
				method: 'PUT',
				body: { Parameters: input.parameters ?? {} },
				...remoteOpts(ctx),
			},
		);
		await logEventFromContext(
			ctx,
			'epicgames.remote.invokePresetFunction',
			{ presetName: input.presetName },
			'completed',
		);
		return result;
	};

export const describeObject: EpicGamesEndpoints['remoteDescribeObject'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteDescribeObject']
		>('/remote/object/describe', ctx.key, {
			method: 'PUT',
			body: { objectPath: input.objectPath },
			...remoteOpts(ctx),
		});
		await logEventFromContext(
			ctx,
			'epicgames.remote.describeObject',
			{},
			'completed',
		);
		return result;
	};

export const callObjectFunction: EpicGamesEndpoints['remoteCallObjectFunction'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteCallObjectFunction']
		>('/remote/object/call', ctx.key, {
			method: 'PUT',
			body: {
				objectPath: input.objectPath,
				functionName: input.functionName,
				parameters: input.parameters ?? {},
				generateTransaction: input.generateTransaction,
			},
			...remoteOpts(ctx),
		});
		await logEventFromContext(
			ctx,
			'epicgames.remote.callObjectFunction',
			{},
			'completed',
		);
		return result;
	};

export const putObjectProperty: EpicGamesEndpoints['remotePutObjectProperty'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remotePutObjectProperty']
		>('/remote/object/property', ctx.key, {
			method: 'PUT',
			body: {
				objectPath: input.objectPath,
				propertyName: input.propertyName,
				propertyValue: input.propertyValue,
				access: input.access ?? 'WRITE_ACCESS',
			},
			...remoteOpts(ctx),
		});
		await logEventFromContext(
			ctx,
			'epicgames.remote.putObjectProperty',
			{},
			'completed',
		);
		return result;
	};

export const getObjectThumbnail: EpicGamesEndpoints['remoteGetObjectThumbnail'] =
	async (ctx, input) => {
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteGetObjectThumbnail']
		>('/remote/object/thumbnail', ctx.key, {
			method: 'PUT',
			body: { objectPath: input.objectPath },
			...remoteOpts(ctx),
		});
		await logEventFromContext(
			ctx,
			'epicgames.remote.getObjectThumbnail',
			{},
			'completed',
		);
		return result;
	};

export const waitForObjectEvent: EpicGamesEndpoints['remoteWaitForObjectEvent'] =
	async (ctx, input) => {
		// Experimental: requires WebControl.EnableExperimentalRoutes=1 in UE.
		const { objectPath, eventName, ...rest } = input;
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteWaitForObjectEvent']
		>('/remote/object/event', ctx.key, {
			method: 'PUT',
			body: {
				objectPath,
				eventName,
				...rest,
			},
			...remoteOpts(ctx),
		});
		await logEventFromContext(
			ctx,
			'epicgames.remote.waitForObjectEvent',
			{},
			'completed',
		);
		return result;
	};
