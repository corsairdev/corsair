import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type {
	RecallaiContext,
	RecallaiEndpointOutputs,
	RecallaiEndpoints,
} from '..';
import { makeRecallaiRequest } from '../client';

const id = z.string().uuid();
// Recall returns provider-specific media metadata, so the known artifact
// envelope is validated while the nested media payload remains opaque.
const media = z
	.object({
		id,
		recording: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		status: z.record(z.string(), z.unknown()).optional(),
		data: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const page = z.object({
	count: z.number().int().nonnegative().optional(),
	next: z.string().url().nullable().optional(),
	previous: z.string().url().nullable().optional(),
	results: z.array(media),
});
const listInput = z.object({
	cursor: z.string().optional(),
	created_at_after: z.string().datetime().optional(),
	created_at_before: z.string().datetime().optional(),
	recording_id: id.optional(),
	status_code: z.enum(['processing', 'done', 'failed', 'deleted']).optional(),
});
const itemInput = z.object({ id });
const updateInput = z
	.object({ id, metadata: z.record(z.string(), z.unknown()).optional() })
	.refine(({ metadata }) => metadata !== undefined);

const path = (resource: string, resourceId?: string) =>
	`/api/v1/${resource}/${resourceId ? `${encodeURIComponent(resourceId)}/` : ''}`;

const list = async (
	ctx: RecallaiContext,
	input: z.infer<typeof listInput>,
	resource: string,
	operation: string,
) => {
	const result = await makeRecallaiRequest<
		RecallaiEndpointOutputs['listAudioMixed']
	>(path(resource), ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, operation, {}, 'completed');
	return result;
};

const retrieve = async (
	ctx: RecallaiContext,
	input: z.infer<typeof itemInput>,
	resource: string,
	operation: string,
) => {
	const parsed = itemInput.parse(input);
	const result = await makeRecallaiRequest<
		RecallaiEndpointOutputs['retrieveAudioMixed']
	>(path(resource, parsed.id), ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, operation, { id: parsed.id }, 'completed');
	return result;
};

const update = async (
	ctx: RecallaiContext,
	input: z.infer<typeof updateInput>,
	resource: string,
	operation: string,
) => {
	const { id: resourceId, ...body } = updateInput.parse(input);
	const result = await makeRecallaiRequest<
		RecallaiEndpointOutputs['updateAudioMixed']
	>(path(resource, resourceId), ctx.key, {
		method: 'PATCH',
		body,
	});
	await logEventFromContext(ctx, operation, { id: resourceId }, 'completed');
	return result;
};

const remove = async (
	ctx: RecallaiContext,
	input: z.infer<typeof itemInput>,
	resource: string,
	operation: string,
) => {
	const parsed = itemInput.parse(input);
	await makeRecallaiRequest(path(resource, parsed.id), ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, operation, { id: parsed.id }, 'completed');
	return undefined;
};

const defineMedia = (resource: string, name: string) => ({
	list: (ctx: RecallaiContext, input: z.infer<typeof listInput>) =>
		list(ctx, input, resource, `recallai.${name}.list`),
	retrieve: (ctx: RecallaiContext, input: z.infer<typeof itemInput>) =>
		retrieve(ctx, input, resource, `recallai.${name}.retrieve`),
	update: (ctx: RecallaiContext, input: z.infer<typeof updateInput>) =>
		update(ctx, input, resource, `recallai.${name}.update`),
	delete: (ctx: RecallaiContext, input: z.infer<typeof itemInput>) =>
		remove(ctx, input, resource, `recallai.${name}.delete`),
});

const audioMixed = defineMedia('audio_mixed', 'audioMixed');
const audioSeparate = defineMedia('audio_separate', 'audioSeparate');
const videoMixed = defineMedia('video_mixed', 'videoMixed');
const videoSeparate = defineMedia('video_separate', 'videoSeparate');

export const listAudioMixed: RecallaiEndpoints['listAudioMixed'] =
	audioMixed.list;
export const retrieveAudioMixed: RecallaiEndpoints['retrieveAudioMixed'] =
	audioMixed.retrieve;
export const updateAudioMixed: RecallaiEndpoints['updateAudioMixed'] =
	audioMixed.update;
export const deleteAudioMixed: RecallaiEndpoints['deleteAudioMixed'] =
	audioMixed.delete;
export const listAudioSeparate: RecallaiEndpoints['listAudioSeparate'] =
	audioSeparate.list;
export const retrieveAudioSeparate: RecallaiEndpoints['retrieveAudioSeparate'] =
	audioSeparate.retrieve;
export const updateAudioSeparate: RecallaiEndpoints['updateAudioSeparate'] =
	audioSeparate.update;
export const deleteAudioSeparate: RecallaiEndpoints['deleteAudioSeparate'] =
	audioSeparate.delete;
export const listVideoMixed: RecallaiEndpoints['listVideoMixed'] =
	videoMixed.list;
export const retrieveVideoMixed: RecallaiEndpoints['retrieveVideoMixed'] =
	videoMixed.retrieve;
export const updateVideoMixed: RecallaiEndpoints['updateVideoMixed'] =
	videoMixed.update;
export const deleteVideoMixed: RecallaiEndpoints['deleteVideoMixed'] =
	videoMixed.delete;
export const listVideoSeparate: RecallaiEndpoints['listVideoSeparate'] =
	videoSeparate.list;
export const retrieveVideoSeparate: RecallaiEndpoints['retrieveVideoSeparate'] =
	videoSeparate.retrieve;
export const updateVideoSeparate: RecallaiEndpoints['updateVideoSeparate'] =
	videoSeparate.update;
export const deleteVideoSeparate: RecallaiEndpoints['deleteVideoSeparate'] =
	videoSeparate.delete;

export const mediaSchemas = {
	audioMixed: {
		list: { input: listInput, output: page },
		retrieve: { input: itemInput, output: media },
		update: { input: updateInput, output: media },
		delete: { input: itemInput, output: z.undefined() },
	},
	audioSeparate: {
		list: { input: listInput, output: page },
		retrieve: { input: itemInput, output: media },
		update: { input: updateInput, output: media },
		delete: { input: itemInput, output: z.undefined() },
	},
	videoMixed: {
		list: { input: listInput, output: page },
		retrieve: { input: itemInput, output: media },
		update: { input: updateInput, output: media },
		delete: { input: itemInput, output: z.undefined() },
	},
	videoSeparate: {
		list: { input: listInput, output: page },
		retrieve: { input: itemInput, output: media },
		update: { input: updateInput, output: media },
		delete: { input: itemInput, output: z.undefined() },
	},
} as const;
