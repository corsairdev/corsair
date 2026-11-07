import type { NanonetsEndpoints } from '..';
import { call } from './call';
import {
	NanonetsEndpointInputSchemas as Inputs,
	NanonetsEndpointOutputSchemas as Outputs,
} from './types';

export const approve: NanonetsEndpoints['filesApprove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.approve',
			input: Inputs.filesApprove,
			output: Outputs.filesApprove,
		},
		input,
		({ model_id, request_file_id }) => ({
			method: 'POST',
			path: `/Inferences/Model/${encodeURIComponent(model_id)}/ImageLevelInferences/Verify/${encodeURIComponent(request_file_id)}`,
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ model_id, request_file_id }) => ({ model_id, request_file_id }),
		},
	);

export const unapprove: NanonetsEndpoints['filesUnapprove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.unapprove',
			input: Inputs.filesUnapprove,
			output: Outputs.filesUnapprove,
		},
		input,
		({ model_id, request_file_id }) => ({
			method: 'POST',
			path: `/Inferences/Model/${encodeURIComponent(model_id)}/ImageLevelInferences/UnVerify/${encodeURIComponent(request_file_id)}`,
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ model_id, request_file_id }) => ({ model_id, request_file_id }),
		},
	);

const deleteFile: NanonetsEndpoints['filesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.delete',
			input: Inputs.filesDelete,
			output: Outputs.filesDelete,
		},
		input,
		({ model_id, file_id }) => ({
			method: 'DELETE',
			path: `/Inferences/Model/${encodeURIComponent(model_id)}/InferenceRequestFiles/${encodeURIComponent(file_id)}`,
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ model_id, file_id }) => ({ model_id, file_id }),
		},
	);

export { deleteFile as delete };

export const updateFields: NanonetsEndpoints['filesUpdateFields'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.updateFields',
			input: Inputs.filesUpdateFields,
			output: Outputs.filesUpdateFields,
		},
		input,
		({ model_id, moderated_boxes }) => ({
			method: 'PATCH',
			path: `/Inferences/Model/${encodeURIComponent(model_id)}/ImageLevelInference`,
			query: { use_ui_version: true },
			rawBody: JSON.stringify({ moderated_boxes }),
			mediaType: 'text/plain;charset=UTF-8',
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ model_id, moderated_boxes }) => ({
				model_id,
				fields: moderated_boxes.length,
			}),
		},
	);

export const assign: NanonetsEndpoints['filesAssign'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.assign',
			input: Inputs.filesAssign,
			output: Outputs.filesAssign,
		},
		input,
		({ model_id, member, file_ids }) => ({
			method: 'POST',
			path: `/team/members/model/${encodeURIComponent(model_id)}/assign/files`,
			body: { member, file_ids },
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ model_id, file_ids }) => ({ model_id, files: file_ids.length }),
		},
	);

export const retryExports: NanonetsEndpoints['filesRetryExports'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.retryExports',
			input: Inputs.filesRetryExports,
			output: Outputs.filesRetryExports,
		},
		input,
		({ model_id, file_ids }) => ({
			method: 'POST',
			path: `/Inferences/Model/${encodeURIComponent(model_id)}/ImageLevelInferences/retryallexports`,
			body: { file_ids },
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ model_id, file_ids }) => ({ model_id, files: file_ids.length }),
		},
	);

export const retryPredictions: NanonetsEndpoints['filesRetryPredictions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.retryPredictions',
			input: Inputs.filesRetryPredictions,
			output: Outputs.filesRetryPredictions,
		},
		input,
		({ model_id, file_ids }) => ({
			method: 'POST',
			path: `/ObjectDetection/Model/${encodeURIComponent(model_id)}/RetryPrediction`,
			body: { file_ids },
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ model_id, file_ids }) => ({ model_id, files: file_ids.length }),
		},
	);
