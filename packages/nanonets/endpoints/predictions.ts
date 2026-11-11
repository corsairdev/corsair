import type { NanonetsEndpoints } from '..';
import { call } from './call';
import {
	NanonetsEndpointInputSchemas as Inputs,
	NanonetsEndpointOutputSchemas as Outputs,
} from './types';

export const createFromFile: NanonetsEndpoints['predictionsCreateFromFile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'predictions.createFromFile',
			input: Inputs.predictionsCreateFromFile,
			output: Outputs.predictionsCreateFromFile,
		},
		input,
		({
			model_id,
			base64_data,
			request_metadata,
			pages_to_process,
			l,
			async,
		}) => {
			const form: Record<string, string> = { base64_data };
			if (request_metadata !== undefined) {
				form.request_metadata = request_metadata;
			}
			if (pages_to_process !== undefined) {
				form.pages_to_process = pages_to_process;
			}
			return {
				method: 'POST',
				path: `/OCR/Model/${encodeURIComponent(model_id)}/LabelFile/`,
				query: { async: async === true ? true : undefined, l },
				form,
			};
		},
		{
			log: ({ model_id, async }, result) => ({
				model_id,
				async: async === true,
				request_file_id: result.result?.[0]?.request_file_id ?? '',
			}),
		},
	);

export const createFromUrls: NanonetsEndpoints['predictionsCreateFromUrls'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'predictions.createFromUrls',
			input: Inputs.predictionsCreateFromUrls,
			output: Outputs.predictionsCreateFromUrls,
		},
		input,
		({ model_id, urls, request_metadata, pages_to_process, l, async }) => {
			const form = new URLSearchParams();
			for (const url of urls) {
				form.append('urls', url);
			}
			if (request_metadata !== undefined) {
				form.append('request_metadata', request_metadata);
			}
			if (pages_to_process !== undefined) {
				form.append('pages_to_process', pages_to_process);
			}
			return {
				method: 'POST',
				path: `/OCR/Model/${encodeURIComponent(model_id)}/LabelUrls/`,
				query: { async: async === true ? true : undefined, l },
				rawBody: form.toString(),
				mediaType: 'application/x-www-form-urlencoded',
			};
		},
		{
			log: ({ model_id, async }, result) => ({
				model_id,
				async: async === true,
				request_file_id: result.result?.[0]?.request_file_id ?? '',
			}),
		},
	);

export const listFiles: NanonetsEndpoints['predictionsListFiles'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'predictions.listFiles',
			input: Inputs.predictionsListFiles,
			output: Outputs.predictionsListFiles,
		},
		input,
		({ model_id, start_day_interval, current_batch_day }) => ({
			method: 'GET',
			path: `/Inferences/Model/${encodeURIComponent(model_id)}/ImageLevelInferences`,
			query: { start_day_interval, current_batch_day },
			replaySafe: true,
		}),
		{
			log: ({ model_id }, result) => ({
				model_id,
				moderated: result.moderated_images?.length ?? 0,
				unmoderated: result.unmoderated_images?.length ?? 0,
			}),
		},
	);

export const getFileByPageId: NanonetsEndpoints['predictionsGetFileByPageId'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'predictions.getFileByPageId',
				input: Inputs.predictionsGetFileByPageId,
				output: Outputs.predictionsGetFileByPageId,
			},
			input,
			({ model_id, id }) => ({
				method: 'GET',
				path: `/Inferences/Model/${encodeURIComponent(model_id)}/ImageLevelInferences/${encodeURIComponent(id)}`,
				replaySafe: true,
			}),
			{
				log: ({ model_id, id }) => ({ model_id, id }),
			},
		);

export const getFileByFileId: NanonetsEndpoints['predictionsGetFileByFileId'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'predictions.getFileByFileId',
				input: Inputs.predictionsGetFileByFileId,
				output: Outputs.predictionsGetFileByFileId,
			},
			input,
			({ model_id, request_file_id }) => ({
				method: 'GET',
				path: `/Inferences/Model/${encodeURIComponent(model_id)}/InferenceRequestFiles/GetPredictions/${encodeURIComponent(request_file_id)}`,
				replaySafe: true,
			}),
			{
				log: ({ model_id, request_file_id }) => ({
					model_id,
					request_file_id,
				}),
			},
		);
