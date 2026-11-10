import type { NanonetsEndpoints } from '..';
import { call, emptyBodyAsRecord } from './call';
import {
	NanonetsEndpointInputSchemas as Inputs,
	NanonetsEndpointOutputSchemas as Outputs,
} from './types';

export const uploadTrainingUrls: NanonetsEndpoints['modelsUploadTrainingUrls'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'models.uploadTrainingUrls',
				input: Inputs.modelsUploadTrainingUrls,
				output: Outputs.modelsUploadTrainingUrls,
			},
			input,
			({ model_id, urls, data }) => ({
				method: 'POST',
				path: `/OCR/Model/${encodeURIComponent(model_id)}/UploadUrls/`,
				// Nanonets documents a JSON object with both keys required, so an
				// upload without annotations still sends an empty data list.
				body: { data: data ?? [], urls },
			}),
			{
				log: ({ model_id, urls }) => ({ model_id, urls: urls.length }),
			},
		);

export const train: NanonetsEndpoints['modelsTrain'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'models.train',
			input: Inputs.modelsTrain,
			output: Outputs.modelsTrain,
		},
		input,
		({ model_id }) => ({
			method: 'POST',
			path: `/OCR/Model/${encodeURIComponent(model_id)}/Train/`,
		}),
		{
			log: ({ model_id }) => ({ model_id }),
		},
	);

export const updateGuidelines: NanonetsEndpoints['modelsUpdateGuidelines'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'models.updateGuidelines',
			input: Inputs.modelsUpdateGuidelines,
			output: Outputs.modelsUpdateGuidelines,
		},
		input,
		({ model_id, field_instructions, table_instructions, ai_guidelines }) => ({
			method: 'POST',
			path: `/ObjectDetection/Model/${encodeURIComponent(model_id)}`,
			body: { field_instructions, table_instructions, ai_guidelines },
		}),
		{
			shape: emptyBodyAsRecord,
			log: ({ model_id }) => ({ model_id }),
		},
	);
