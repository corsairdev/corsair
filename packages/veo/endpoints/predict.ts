import { logEventFromContext } from 'corsair/core';
import type { VeoContext } from '..';
import {
	makeVeoRequest,
	parseOperationName,
	resolveLocation,
	resolveProjectId,
	veoHost,
	veoModelPath,
} from '../client';
import type { VeoImage, VeoOperation } from './types';
import { VeoOperationSchema } from './types';

type GenerationFields = {
	projectId?: string;
	location?: string;
	model: string;
	aspectRatio?: '16:9' | '9:16';
	negativePrompt?: string;
	personGeneration?: 'allow_adult' | 'disallow';
	resolution?: '720p' | '1080p' | '4k';
	sampleCount?: number;
	seed?: number;
	storageUri?: string;
	durationSeconds?: 4 | 6 | 8;
	resizeMode?: 'crop' | 'pad';
};

export function buildImage(image: VeoImage): Record<string, unknown> {
	return {
		mimeType: image.mimeType,
		...(image.bytesBase64Encoded
			? { bytesBase64Encoded: image.bytesBase64Encoded }
			: {}),
		...(image.gcsUri ? { gcsUri: image.gcsUri } : {}),
	};
}

export function buildParameters(
	input: GenerationFields,
): Record<string, unknown> | undefined {
	const parameters: Record<string, unknown> = {};
	const fields: Array<[string, unknown]> = [
		['aspectRatio', input.aspectRatio],
		['negativePrompt', input.negativePrompt],
		['personGeneration', input.personGeneration],
		['resolution', input.resolution],
		['sampleCount', input.sampleCount],
		['seed', input.seed],
		['storageUri', input.storageUri],
		['durationSeconds', input.durationSeconds],
		['resizeMode', input.resizeMode],
	];
	for (const [key, value] of fields) {
		if (value !== undefined) parameters[key] = value;
	}
	return Object.keys(parameters).length > 0 ? parameters : undefined;
}

export async function startPrediction(
	ctx: VeoContext,
	event: string,
	input: GenerationFields,
	instance: Record<string, unknown>,
): Promise<VeoOperation> {
	const projectId = await resolveProjectId(ctx, input.projectId);
	const location = resolveLocation(ctx, input.location);
	const parameters = buildParameters(input);
	const body: Record<string, unknown> = {
		instances: [instance],
		...(parameters ? { parameters } : {}),
	};

	let response: unknown;
	try {
		response = await makeVeoRequest(
			veoHost(location),
			veoModelPath(projectId, location, input.model, 'predictLongRunning'),
			ctx.key,
			{ body },
		);
	} catch (error) {
		await logEventFromContext(
			ctx,
			event,
			{ model: input.model, location },
			'failed',
		);
		throw error;
	}

	const operation = VeoOperationSchema.parse(response);
	await logEventFromContext(
		ctx,
		event,
		{ model: input.model, location, operationName: operation.name },
		'completed',
	);
	return operation;
}

export async function fetchOperation(
	ctx: VeoContext,
	input: {
		operationName: string;
		model?: string;
		projectId?: string;
		location?: string;
	},
): Promise<VeoOperation> {
	const parsed = parseOperationName(input.operationName);
	const projectId = await resolveProjectId(
		ctx,
		input.projectId,
		parsed?.projectId,
	);
	const location = resolveLocation(ctx, input.location, parsed?.location);
	const model = input.model ?? parsed?.model;
	if (!model) {
		throw new Error(
			'Veo model is required when operationName is not a full projects/.../models/.../operations/... name.',
		);
	}

	const response = await makeVeoRequest(
		veoHost(location),
		veoModelPath(projectId, location, model, 'fetchPredictOperation'),
		ctx.key,
		{ body: { operationName: input.operationName } },
	);
	return VeoOperationSchema.parse(response);
}
