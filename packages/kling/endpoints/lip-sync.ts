import { logEventFromContext } from 'corsair/core';
import type { KlingEndpoints } from '..';
import { makeKlingRequest } from '../client';
import { createTask, getV1TaskById, listTasksByPage } from './tasks';
import type { KlingFaceDetectOutput } from './types';
import {
	KlingFaceDetectResponseSchema,
	LipSyncCreateInputSchema,
	LipSyncDetectFaceInputSchema,
} from './types';

// Lip sync needs two steps: Face Recognition identifies the faces and returns a
// session id, then the lip-sync create references a face id from that session.
// POST /v1/videos/identify-face
// POST /v1/videos/advanced-lip-sync
// GET  /v1/videos/advanced-lip-sync/{id}
// GET  /v1/videos/advanced-lip-sync?pageNum&pageSize
// https://kling.ai/document-api/api/video/lip-sync
// https://kling.ai/document-api/api/video/lip-sync/face-detection

const PATH = '/v1/videos/advanced-lip-sync';

export const lipSyncDetectFace: KlingEndpoints['lipSync']['detectFace'] =
	async (ctx, input) => {
		const parsed = LipSyncDetectFaceInputSchema.parse(input);

		const response = await makeKlingRequest<KlingFaceDetectOutput>(
			'/v1/videos/identify-face',
			ctx.key,
			{ method: 'POST', body: parsed },
		);

		const parsedResponse = KlingFaceDetectResponseSchema.parse(response);

		// A face id is an identifier, not content: log the session id and how many
		// faces were detected, never the video URL or any face imagery.
		await logEventFromContext(
			ctx,
			'kling.lipSync.detectFace',
			{
				sessionId: parsedResponse.data.session_id,
				faceCount: parsedResponse.data.face_data?.length ?? 0,
			},
			'completed',
		);

		return parsedResponse;
	};

export const lipSyncCreate: KlingEndpoints['lipSync']['create'] = async (
	ctx,
	input,
) => {
	const parsed = LipSyncCreateInputSchema.parse(input);

	return createTask(ctx, 'kling.lipSync.create', PATH, parsed, {});
};

export const lipSyncGet: KlingEndpoints['lipSync']['get'] = (ctx, input) =>
	getV1TaskById(ctx, 'kling.lipSync.get', PATH, input);

export const lipSyncList: KlingEndpoints['lipSync']['list'] = (ctx, input) =>
	listTasksByPage(ctx, 'kling.lipSync.list', PATH, input);
