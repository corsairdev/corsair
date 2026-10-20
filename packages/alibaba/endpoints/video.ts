import { logEventFromContext } from 'corsair/core';
import type { AlibabaContext, AlibabaEndpoints } from '..';
import { makeDashScopeRequest } from '../client';
import type { AlibabaEndpointInputs, VideoTaskCreated } from './types';
import {
	AlibabaEndpointInputSchemas,
	AlibabaEndpointOutputSchemas,
} from './types';

type VideoOperation =
	| 'videoTextToVideo'
	| 'videoImageToVideo'
	| 'videoReferenceToVideo'
	| 'videoEdit';

const SYNTHESIS = 'api/v1/services/aigc/video-generation/video-synthesis';

async function submit<K extends VideoOperation>(
	ctx: AlibabaContext,
	operation: K,
	event: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
): Promise<VideoTaskCreated> {
	// Indexing the schema map with a generic K widens parse() to the union of all
	// video inputs; the schema for K only returns K's input.
	const parsed = AlibabaEndpointInputSchemas[operation].parse(
		input,
	) as AlibabaEndpointInputs[K];
	const { model, parameters, ...fields } = parsed;

	const created = AlibabaEndpointOutputSchemas[operation].parse(
		await makeDashScopeRequest(SYNTHESIS, ctx.key, {
			method: 'POST',
			body: { model, input: fields, ...(parameters ? { parameters } : {}) },
			async: true,
			baseUrl: ctx.options.baseUrl,
		}),
	);

	if (ctx.db.videoTasks) {
		try {
			await ctx.db.videoTasks.upsertByEntityId(created.output.task_id, {
				taskId: created.output.task_id,
				model,
				status: created.output.task_status,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'Failed to save Model Studio video task to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		`alibaba.${event}`,
		{ model, taskId: created.output.task_id },
		'completed',
	);
	return created;
}

export const textToVideo: AlibabaEndpoints['videoTextToVideo'] = (ctx, input) =>
	submit(ctx, 'videoTextToVideo', 'video.textToVideo', input);

export const imageToVideo: AlibabaEndpoints['videoImageToVideo'] = (
	ctx,
	input,
) => submit(ctx, 'videoImageToVideo', 'video.imageToVideo', input);

export const referenceToVideo: AlibabaEndpoints['videoReferenceToVideo'] = (
	ctx,
	input,
) => submit(ctx, 'videoReferenceToVideo', 'video.referenceToVideo', input);

export const edit: AlibabaEndpoints['videoEdit'] = (ctx, input) =>
	submit(ctx, 'videoEdit', 'video.edit', input);
