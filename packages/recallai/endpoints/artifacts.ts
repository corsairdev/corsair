import { logEventFromContext } from 'corsair/core';
import type { RecallaiEndpointOutputs, RecallaiEndpoints } from '..';
import { makeRecallaiRequest } from '../client';
import type {
	ArtifactListInput,
	ArtifactListResponse,
	ArtifactResponse,
	RetrieveArtifactInput,
	UpdateParticipantEventsInput,
} from './artifact-types';

import {
	RetrieveArtifactInputSchema,
	UpdateArtifactInputSchema,
	UpdateParticipantEventsInputSchema,
} from './artifact-types';

const artifactPath = (resource: string, id: string) =>
	`/api/v1/${resource}/${encodeURIComponent(id)}/`;

const listArtifact = async <T extends ArtifactListResponse>(
	ctx: Parameters<RecallaiEndpoints['listMeetingMetadata']>[0],
	resource: string,
	input: ArtifactListInput,
	operation: string,
) => {
	const response = await makeRecallaiRequest<T>(
		`/api/v1/${resource}/`,
		ctx.key,
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, operation, {}, 'completed');
	return response;
};

const retrieveArtifact = async <T extends ArtifactResponse>(
	ctx: Parameters<RecallaiEndpoints['retrieveMeetingMetadata']>[0],
	resource: string,
	input: RetrieveArtifactInput,
	operation: string,
) => {
	const response = await makeRecallaiRequest<T>(
		artifactPath(resource, input.id),
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, operation, { id: input.id }, 'completed');
	return response;
};

export const listMeetingMetadata: RecallaiEndpoints['listMeetingMetadata'] = (
	ctx,
	input,
) =>
	listArtifact(ctx, 'meeting_metadata', input, 'recallai.meetingMetadata.list');
export const retrieveMeetingMetadata: RecallaiEndpoints['retrieveMeetingMetadata'] =
	(ctx, input) =>
		retrieveArtifact(
			ctx,
			'meeting_metadata',
			input,
			'recallai.meetingMetadata.retrieve',
		);

export const updateMeetingMetadata: RecallaiEndpoints['updateMeetingMetadata'] =
	async (ctx, input) => {
		const { id, ...body } = UpdateArtifactInputSchema.parse(input);
		const result = await makeRecallaiRequest<
			RecallaiEndpointOutputs['updateMeetingMetadata']
		>(artifactPath('meeting_metadata', id), ctx.key, { method: 'PATCH', body });
		await logEventFromContext(
			ctx,
			'recallai.meetingMetadata.update',
			{ id },
			'completed',
		);
		return result;
	};
export const deleteMeetingMetadata: RecallaiEndpoints['deleteMeetingMetadata'] =
	async (ctx, input) => {
		const parsed = RetrieveArtifactInputSchema.parse(input);
		await makeRecallaiRequest(
			artifactPath('meeting_metadata', parsed.id),
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'recallai.meetingMetadata.delete',
			{ id: parsed.id },
			'completed',
		);
	};
export const listParticipantEvents: RecallaiEndpoints['listParticipantEvents'] =
	(ctx, input) =>
		listArtifact(
			ctx,
			'participant_events',
			input,
			'recallai.participantEvents.list',
		);
export const retrieveParticipantEvents: RecallaiEndpoints['retrieveParticipantEvents'] =
	(ctx, input) =>
		retrieveArtifact(
			ctx,
			'participant_events',
			input,
			'recallai.participantEvents.retrieve',
		);
export const updateParticipantEvents: RecallaiEndpoints['updateParticipantEvents'] =
	async (ctx, input) => {
		const parsed = UpdateParticipantEventsInputSchema.parse(
			input,
		) as UpdateParticipantEventsInput;
		const { id, ...body } = parsed;
		const response = await makeRecallaiRequest<ArtifactResponse>(
			artifactPath('participant_events', id),
			ctx.key,
			{
				method: 'PATCH',
				body,
			},
		);
		await logEventFromContext(
			ctx,
			'recallai.participantEvents.update',
			{ id },
			'completed',
		);
		return response;
	};
export const deleteParticipantEvents: RecallaiEndpoints['deleteParticipantEvents'] =
	async (ctx, input) => {
		const parsed = RetrieveArtifactInputSchema.parse(input);
		await makeRecallaiRequest(
			artifactPath('participant_events', parsed.id),
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'recallai.participantEvents.delete',
			{ id: parsed.id },
			'completed',
		);
	};
export const listTranscripts: RecallaiEndpoints['listTranscripts'] = (
	ctx,
	input,
) => listArtifact(ctx, 'transcript', input, 'recallai.transcripts.list');
export const retrieveTranscript: RecallaiEndpoints['retrieveTranscript'] = (
	ctx,
	input,
) =>
	retrieveArtifact(ctx, 'transcript', input, 'recallai.transcripts.retrieve');

export const updateTranscript: RecallaiEndpoints['updateTranscript'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = UpdateArtifactInputSchema.parse(input);
	const result = await makeRecallaiRequest<
		RecallaiEndpointOutputs['updateTranscript']
	>(artifactPath('transcript', id), ctx.key, { method: 'PATCH', body });
	await logEventFromContext(
		ctx,
		'recallai.transcripts.update',
		{ id },
		'completed',
	);
	return result;
};
export const deleteTranscript: RecallaiEndpoints['deleteTranscript'] = async (
	ctx,
	input,
) => {
	const parsed = RetrieveArtifactInputSchema.parse(input);
	await makeRecallaiRequest(artifactPath('transcript', parsed.id), ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'recallai.transcripts.delete',
		{ id: parsed.id },
		'completed',
	);
};
