import type { TldvEndpoints } from '..';
import { call, queryOf } from './call';
import {
	TldvEndpointInputSchemas as Inputs,
	TldvEndpointOutputSchemas as Outputs,
} from './types';

export const list: TldvEndpoints['meetingsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meetings.list',
			input: Inputs.meetingsList,
			output: Outputs.meetingsList,
		},
		input,
		({
			query,
			page,
			limit,
			from,
			to,
			onlyParticipated,
			meetingType,
			folderIds,
			folderIdsOp,
		}) => ({
			method: 'GET',
			path: '/v1alpha1/meetings',
			query: queryOf({
				query,
				page,
				limit,
				from,
				to,
				onlyParticipated,
				meetingType,
				// The API takes a repeated parameter or a comma-separated list.
				folderIds: folderIds?.join(','),
				folderIdsOp,
			}),
		}),
		{
			log: (_, result) => ({
				count: result.results.length,
				total: result.total,
				page: result.page,
			}),
		},
	);

export const get: TldvEndpoints['meetingsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meetings.get',
			input: Inputs.meetingsGet,
			output: Outputs.meetingsGet,
		},
		input,
		({ meetingId }) => ({
			method: 'GET',
			path: `/v1alpha1/meetings/${encodeURIComponent(meetingId)}`,
		}),
		{
			// `phoneNumber` and `metadata` are documented as absent from the list
			// endpoint and present here, so this is the read that returns them.
			log: (_, result) => ({
				meetingId: result.id,
				duration: result.duration,
			}),
		},
	);

export const transcript: TldvEndpoints['meetingsTranscript'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meetings.transcript',
			input: Inputs.meetingsTranscript,
			output: Outputs.meetingsTranscript,
		},
		input,
		({ meetingId }) => ({
			method: 'GET',
			path: `/v1alpha1/meetings/${encodeURIComponent(meetingId)}/transcript`,
		}),
		{
			// Sentences are meeting content, so only the count is logged.
			log: (_, result) => ({
				meetingId: result.meetingId,
				sentences: result.data.length,
			}),
		},
	);

export const notes: TldvEndpoints['meetingsNotes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meetings.notes',
			input: Inputs.meetingsNotes,
			output: Outputs.meetingsNotes,
		},
		input,
		({ meetingId }) => ({
			method: 'GET',
			path: `/v1alpha1/meetings/${encodeURIComponent(meetingId)}/notes`,
		}),
		{
			log: (_, result) => ({
				notes: result.structuredNotes.length,
				topics: result.topics.length,
			}),
		},
	);

export const importMeeting: TldvEndpoints['meetingsImport'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meetings.import',
			input: Inputs.meetingsImport,
			output: Outputs.meetingsImport,
		},
		input,
		({ url, name, happenedAt, participants, phoneNumber, metadata }) => ({
			method: 'POST',
			path: '/v1alpha1/meetings/import',
			body: {
				url,
				name,
				...(happenedAt === undefined ? {} : { happenedAt }),
				...(participants === undefined ? {} : { participants }),
				...(phoneNumber === undefined ? {} : { phoneNumber }),
				...(metadata === undefined ? {} : { metadata }),
			},
		}),
		{
			log: (_, result) => ({ jobId: result.jobId, success: result.success }),
		},
	);
