import type { HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

export const create: HappyScribeEndpoints['exportsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'exports.create',
			input: Inputs.exportsCreate,
			output: Outputs.exportsCreate,
		},
		input,
		({
			format,
			transcriptionIds,
			showTimestamps,
			showSpeakers,
			showComments,
			showHighlights,
		}) => ({
			method: 'POST',
			path: '/exports',
			body: {
				export: {
					format,
					transcription_ids: transcriptionIds,
					show_timestamps: showTimestamps,
					show_speakers: showSpeakers,
					show_comments: showComments,
					show_highlights: showHighlights,
				},
			},
		}),
		{
			log: (parsed, result) => ({
				exportId: result.id,
				format: parsed.format,
				files: parsed.transcriptionIds.length,
			}),
		},
	);

export const get: HappyScribeEndpoints['exportsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'exports.get',
			input: Inputs.exportsGet,
			output: Outputs.exportsGet,
		},
		input,
		({ exportId }) => ({
			method: 'GET',
			path: `/exports/${segment(exportId)}`,
			replaySafe: true,
		}),
	);
