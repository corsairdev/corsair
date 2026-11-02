import { logEventFromContext } from 'corsair/core';
import type { RecallaiContext, RecallaiEndpointOutputs, RecallaiEndpoints } from '..';
import { makeRecallaiRequest } from '../client';
import { z } from 'zod';

const id = z.string().uuid();
const opaque = z.record(z.string(), z.unknown());
const artifact = z.object({ id, recording: opaque.optional(), metadata: opaque.optional(), status: opaque.optional(), data: opaque.optional() }).passthrough();
const page = z.object({ count: z.number().int().nonnegative().optional(), next: z.string().url().nullable().optional(), previous: z.string().url().nullable().optional(), results: z.array(artifact) });
const listInput = z.object({ cursor: z.string().optional(), created_at_after: z.string().datetime().optional(), created_at_before: z.string().datetime().optional(), recording_id: id.optional(), status_code: z.enum(['processing', 'done', 'failed', 'deleted']).optional() });
const itemInput = z.object({ id });
const updateInput = z.object({ id, metadata: opaque.optional() }).refine(({ metadata }) => metadata !== undefined);
const transcriptInput = z.object({ id, provider: z.string().min(1).optional() });

const path = (resource: string, idValue?: string) => `/api/v1/${resource}/${idValue ? `${encodeURIComponent(idValue)}/` : ''}`;

const list = async (ctx: Parameters<RecallaiEndpoints['listRecording']>[0], input: z.infer<typeof listInput>, resource: string, event: string) => {
	const result = await makeRecallaiRequest<RecallaiEndpointOutputs['listRecording']>(path(resource), ctx.key, { method: 'GET', query: input });
	await logEventFromContext(ctx, event, {}, 'completed');
	return result;
};

export const listRecording: RecallaiEndpoints['listRecording'] = (ctx, input) => list(ctx, input, 'recording', 'recallai.recording.list');
export const retrieveRecording: RecallaiEndpoints['retrieveRecording'] = async (ctx, input) => {
	const parsed = itemInput.parse(input);
	const result = await makeRecallaiRequest<RecallaiEndpointOutputs['retrieveRecording']>(path('recording', parsed.id), ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'recallai.recording.retrieve', { id: parsed.id }, 'completed');
	return result;
};
export const updateRecording: RecallaiEndpoints['updateRecording'] = async (ctx, input) => {
	const parsed = updateInput.parse(input);
	const { id: resourceId, ...body } = parsed;
	const result = await makeRecallaiRequest<RecallaiEndpointOutputs['updateRecording']>(path('recording', resourceId), ctx.key, { method: 'PATCH', body });
	await logEventFromContext(ctx, 'recallai.recording.update', { id: resourceId }, 'completed');
	return result;
};
export const deleteRecording: RecallaiEndpoints['deleteRecording'] = async (ctx, input) => {
	const parsed = itemInput.parse(input);
	await makeRecallaiRequest(path('recording', parsed.id), ctx.key, { method: 'DELETE' });
	await logEventFromContext(ctx, 'recallai.recording.delete', { id: parsed.id }, 'completed');
};
export const createAsyncTranscript: RecallaiEndpoints['createAsyncTranscript'] = async (ctx, input) => {
	const parsed = transcriptInput.parse(input);
	const { id: recordingId, ...body } = parsed;
	const result = await makeRecallaiRequest<RecallaiEndpointOutputs['createAsyncTranscript']>(path('recording', recordingId) + 'create_transcript/', ctx.key, { method: 'POST', body });
	await logEventFromContext(ctx, 'recallai.recording.createTranscript', { id: recordingId }, 'completed');
	return result;
};

export const listRealtimeEndpoints: RecallaiEndpoints['listRealtimeEndpoints'] = (ctx, input) => list(ctx, input, 'realtime_endpoint', 'recallai.realtimeEndpoint.list');
export const retrieveRealtimeEndpoints: RecallaiEndpoints['retrieveRealtimeEndpoints'] = async (ctx, input) => {
	const parsed = itemInput.parse(input);
	const result = await makeRecallaiRequest<RecallaiEndpointOutputs['retrieveRealtimeEndpoints']>(path('realtime_endpoint', parsed.id), ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'recallai.realtimeEndpoint.retrieve', { id: parsed.id }, 'completed');
	return result;
};
export const updateRealtimeEndpoints: RecallaiEndpoints['updateRealtimeEndpoints'] = async (ctx, input) => {
	const parsed = updateInput.parse(input);
	const { id: resourceId, ...body } = parsed;
	const result = await makeRecallaiRequest<RecallaiEndpointOutputs['updateRealtimeEndpoints']>(path('realtime_endpoint', resourceId), ctx.key, { method: 'PATCH', body });
	await logEventFromContext(ctx, 'recallai.realtimeEndpoint.update', { id: resourceId }, 'completed');
	return result;
};
export const listSdkUploads = async (ctx: RecallaiContext, input: z.infer<typeof listInput>): Promise<{ count?: number; next?: string | null; previous?: string | null; results: Record<string, unknown>[] }> => list(ctx, input, 'sdk_upload', 'recallai.sdkUpload.list');

export const recordingSchemas = {
	listRecording: { input: listInput, output: page }, retrieveRecording: { input: itemInput, output: artifact }, updateRecording: { input: updateInput, output: artifact }, deleteRecording: { input: itemInput, output: z.undefined() }, createAsyncTranscript: { input: transcriptInput, output: artifact },
	listRealtimeEndpoints: { input: listInput, output: page }, retrieveRealtimeEndpoints: { input: itemInput, output: artifact }, updateRealtimeEndpoints: { input: updateInput, output: artifact },
	listSdkUploads: { input: listInput, output: page },
} as const;
