import type { ListcleanEndpoints } from '..';
import { envelopeData, envelopeMessage, segment } from '../client';
import { call } from './call';
import {
	ListcleanEndpointInputSchemas as Inputs,
	ListcleanEndpointOutputSchemas as Outputs,
} from './types';

export const listUploads: ListcleanEndpoints['uploadsListUploads'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'uploads.listUploads',
			input: Inputs.uploadsListUploads,
			output: Outputs.uploadsListUploads,
		},
		input,
		() => ({ method: 'GET', path: '/uploads/', replayable: true }),
		{
			shape: envelopeData,
			log: (_, result) => ({ count: result.length }),
		},
	);

export const startUpload: ListcleanEndpoints['uploadsStartUpload'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'uploads.startUpload',
			input: Inputs.uploadsStartUpload,
			output: Outputs.uploadsStartUpload,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/uploads/',
			body,
			// A re-POST would open a second upload, so this is never replayed.
			replayable: false,
		}),
		{
			shape: envelopeData,
			log: (parsed, result) => ({
				uploadId: result.upload_id,
				chunks: parsed.total_chunk_count,
			}),
		},
	);

export const uploadChunk: ListcleanEndpoints['uploadsUploadChunk'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'uploads.uploadChunk',
			input: Inputs.uploadsUploadChunk,
			output: Outputs.uploadsUploadChunk,
		},
		input,
		({ upload_id, ...body }) => ({
			method: 'POST',
			path: `/uploads/${segment(upload_id)}`,
			body,
			// The last chunk starts the billed verification; Listclean does not
			// document what a repeated chunk does, so it is never replayed.
			replayable: false,
		}),
		{
			// No `data` on this answer: the documented message stands in for it.
			shape: (raw) => ({ message: envelopeMessage(raw) }),
			// The chunk content is the CSV of addresses; only counters are logged.
			log: ({ upload_id, chunk_sequence_number }) => ({
				uploadId: upload_id,
				chunk: chunk_sequence_number,
			}),
		},
	);

export const getUpload: ListcleanEndpoints['uploadsGetUpload'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uploads.getUpload',
			input: Inputs.uploadsGetUpload,
			output: Outputs.uploadsGetUpload,
		},
		input,
		({ upload_id }) => ({
			method: 'GET',
			path: `/uploads/${segment(upload_id)}`,
			replayable: true,
		}),
		{
			shape: envelopeData,
			log: ({ upload_id }, result) => ({
				uploadId: upload_id,
				status: result.status ?? undefined,
			}),
		},
	);
