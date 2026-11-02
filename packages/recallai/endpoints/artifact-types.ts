import { z } from 'zod';

const id = z.string().uuid();
const opaqueObject = z.record(z.string(), z.unknown());
const artifactStatus = z.object({
	code: z.string(),
	sub_code: z.string().nullable().optional(),
	updated_at: z.string().datetime().optional(),
});

export const ArtifactListInputSchema = z.object({
	created_at_after: z.string().datetime().optional(),
	created_at_before: z.string().datetime().optional(),
	cursor: z.string().optional(),
	recording_id: id.optional(),
	status_code: z.enum(['processing', 'done', 'failed']).optional(),
});
export const RetrieveArtifactInputSchema = z.object({ id });
export const UpdateParticipantEventsInputSchema = z.object({
	id,
	metadata: opaqueObject,
});

const ArtifactSchema = z
	.object({
		id,
		recording: opaqueObject.optional(),
		created_at: z.string().datetime().optional(),
		status: artifactStatus.optional(),
		metadata: opaqueObject.optional(),
		data: opaqueObject.optional(),
	})
	.passthrough();
export const ArtifactResponseSchema = ArtifactSchema;

export const ArtifactListResponseSchema = z.object({
	next: z.string().url().nullable().optional(),
	previous: z.string().url().nullable().optional(),
	results: z.array(ArtifactSchema),
});

export type ArtifactListInput = z.infer<typeof ArtifactListInputSchema>;
export type RetrieveArtifactInput = z.infer<typeof RetrieveArtifactInputSchema>;
export type UpdateParticipantEventsInput = z.infer<
	typeof UpdateParticipantEventsInputSchema
>;
export type ArtifactResponse = z.infer<typeof ArtifactSchema>;
export type ArtifactListResponse = z.infer<typeof ArtifactListResponseSchema>;

export type ArtifactEndpointInputs = {
	listMeetingMetadata: ArtifactListInput;
	retrieveMeetingMetadata: RetrieveArtifactInput;
	listParticipantEvents: ArtifactListInput;
	retrieveParticipantEvents: RetrieveArtifactInput;
	listTranscripts: ArtifactListInput;
	retrieveTranscript: RetrieveArtifactInput;
	updateParticipantEvents: UpdateParticipantEventsInput;
};

export type ArtifactEndpointOutputs = {
	listMeetingMetadata: ArtifactListResponse;
	retrieveMeetingMetadata: ArtifactResponse;
	listParticipantEvents: ArtifactListResponse;
	retrieveParticipantEvents: ArtifactResponse;
	listTranscripts: ArtifactListResponse;
	retrieveTranscript: ArtifactResponse;
	updateParticipantEvents: ArtifactResponse;
};
