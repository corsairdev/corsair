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
		// UE docs: objectPath + access + optional propertyName + nested propertyValue
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remotePutObjectProperty']
		>('/remote/object/property', ctx.key, {
			method: 'PUT',
			body: {
				objectPath: input.objectPath,
				access: input.access ?? 'READ_ACCESS',
				...(input.propertyName !== undefined
					? { propertyName: input.propertyName }
					: {}),
				...(input.propertyValue !== undefined
					? { propertyValue: input.propertyValue }
					: {}),
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

/**
 * List Blueprint-callable functions on a UObject.
 *
 * Distinct from `describeObject`: that op returns the full describe payload.
 * This op only returns `{ objectPath, functions, count }` after filtering the
 * describe response. UE has no dedicated list-functions HTTP route.
 */
export const listBlueprintCallableFunctions: EpicGamesEndpoints['remoteListBlueprintCallableFunctions'] =
	async (ctx, input) => {
		const described = await makeEpicGamesRequest<Record<string, unknown>>(
			'/remote/object/describe',
			ctx.key,
			{
				method: 'PUT',
				// same transport as describeObject, different return shape (filtered)
				body: { objectPath: input.objectPath },
				...remoteOpts(ctx),
			},
		);

		const functions = extractBlueprintCallableFunctions(described);
		// Never return the raw describe payload — callers get a functions list only.
		const result: EpicGamesEndpointOutputs['remoteListBlueprintCallableFunctions'] =
			{
				objectPath: input.objectPath,
				functions,
				count: functions.length,
			};

		await logEventFromContext(
			ctx,
			'epicgames.remote.listBlueprintCallableFunctions',
			{ count: functions.length },
			'completed',
		);
		return result;
	};

/**
 * Pull Blueprint-callable function descriptors out of a /remote/object/describe
 * payload. UE versions use different keys (Functions, functions, etc.).
 */
function extractBlueprintCallableFunctions(
	described: Record<string, unknown>,
): unknown[] {
	const candidates = [
		described.Functions,
		described.functions,
		described.CallableFunctions,
		described.BlueprintCallableFunctions,
	];
	for (const candidate of candidates) {
		if (Array.isArray(candidate)) return candidate;
	}
	// Nested under Class / Object metadata in some UE builds
	const nested = described.Class ?? described.Object ?? described.Description;
	if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
		// cast: typeof object guard narrows from unknown but not to Record
		const obj = nested as Record<string, unknown>;
		for (const key of ['Functions', 'functions', 'CallableFunctions']) {
			// cast: Array.isArray narrows to any[]; values remain free-form UE JSON
			if (Array.isArray(obj[key])) return obj[key] as unknown[];
		}
	}
	return [];
}

export const waitForObjectEvent: EpicGamesEndpoints['remoteWaitForObjectEvent'] =
	async (ctx, input) => {
		// Experimental: requires WebControl.EnableExperimentalRoutes=1 in UE.
		// UE docs use PascalCase EventType / ObjectPath / PropertyName.
		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['remoteWaitForObjectEvent']
		>('/remote/object/event', ctx.key, {
			method: 'PUT',
			body: {
				EventType: input.eventType ?? 'ObjectPropertyChanged',
				ObjectPath: input.objectPath,
				...(input.propertyName !== undefined
					? { PropertyName: input.propertyName }
					: {}),
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
