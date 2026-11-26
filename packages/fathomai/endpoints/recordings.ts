import { logEventFromContext } from 'corsair/core';
import type { FathomAiEndpoints } from '..';
import { makeFathomAiRequest } from '../client';
import {
	FathomAiEndpointInputSchemas,
	FathomAiEndpointOutputSchemas,
} from './types';

export const getSummary: FathomAiEndpoints['recordingsGetSummary'] = async (
	ctx,
	input,
) => {
	const { recording_id } =
		FathomAiEndpointInputSchemas.recordingsGetSummary.parse(input);
	const response = FathomAiEndpointOutputSchemas.recordingsGetSummary.parse(
		await makeFathomAiRequest('/recordings/{recording_id}/summary', ctx.key, {
			method: 'GET',
			path: { recording_id },
		}),
	);
	await logEventFromContext(
		ctx,
		'fathomai.recordings.getSummary',
		{ recording_id },
		'completed',
	);
	return response;
};

export const getTranscript: FathomAiEndpoints['recordingsGetTranscript'] =
	async (ctx, input) => {
		const { recording_id } =
			FathomAiEndpointInputSchemas.recordingsGetTranscript.parse(input);
		const response =
			FathomAiEndpointOutputSchemas.recordingsGetTranscript.parse(
				await makeFathomAiRequest(
					'/recordings/{recording_id}/transcript',
					ctx.key,
					{ method: 'GET', path: { recording_id } },
				),
			);
		await logEventFromContext(
			ctx,
			'fathomai.recordings.getTranscript',
			{ recording_id },
			'completed',
		);
		return response;
	};

// The callback variants are separate operations because they send meeting content to a server the
// caller picks, which a read-only caller must not be able to do. The destination URL is not logged.
export const sendSummary: FathomAiEndpoints['recordingsSendSummary'] = async (
	ctx,
	input,
) => {
	const { recording_id, destination_url } =
		FathomAiEndpointInputSchemas.recordingsSendSummary.parse(input);
	const response = FathomAiEndpointOutputSchemas.recordingsSendSummary.parse(
		await makeFathomAiRequest('/recordings/{recording_id}/summary', ctx.key, {
			method: 'GET',
			path: { recording_id },
			query: { destination_url },
		}),
	);
	await logEventFromContext(
		ctx,
		'fathomai.recordings.sendSummary',
		{ recording_id },
		'completed',
	);
	return response;
};

export const sendTranscript: FathomAiEndpoints['recordingsSendTranscript'] =
	async (ctx, input) => {
		const { recording_id, destination_url } =
			FathomAiEndpointInputSchemas.recordingsSendTranscript.parse(input);
		const response =
			FathomAiEndpointOutputSchemas.recordingsSendTranscript.parse(
				await makeFathomAiRequest(
					'/recordings/{recording_id}/transcript',
					ctx.key,
					{ method: 'GET', path: { recording_id }, query: { destination_url } },
				),
			);
		await logEventFromContext(
			ctx,
			'fathomai.recordings.sendTranscript',
			{ recording_id },
			'completed',
		);
		return response;
	};

export const requestDownload: FathomAiEndpoints['recordingsRequestDownload'] =
	async (ctx, input) => {
		const { recording_id, destination_url } =
			FathomAiEndpointInputSchemas.recordingsRequestDownload.parse(input);
		const response =
			FathomAiEndpointOutputSchemas.recordingsRequestDownload.parse(
				await makeFathomAiRequest(
					'/recordings/{recording_id}/download',
					ctx.key,
					{ method: 'POST', path: { recording_id }, body: { destination_url } },
				),
			);
		await logEventFromContext(
			ctx,
			'fathomai.recordings.requestDownload',
			{ recording_id, status: response.status },
			'completed',
		);
		return response;
	};

export const getDownload: FathomAiEndpoints['recordingsGetDownload'] = async (
	ctx,
	input,
) => {
	const path = FathomAiEndpointInputSchemas.recordingsGetDownload.parse(input);
	const response = FathomAiEndpointOutputSchemas.recordingsGetDownload.parse(
		await makeFathomAiRequest(
			'/recordings/{recording_id}/downloads/{download_id}',
			ctx.key,
			{ method: 'GET', path },
		),
	);
	await logEventFromContext(
		ctx,
		'fathomai.recordings.getDownload',
		{ recording_id: path.recording_id, status: response.status },
		'completed',
	);
	return response;
};
