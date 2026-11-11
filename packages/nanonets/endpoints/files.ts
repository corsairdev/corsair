import type { NanonetsEndpoints } from '..';
import { call, emptyBodyAsRecord } from './call';
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
			shape: emptyBodyAsRecord,
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
			shape: emptyBodyAsRecord,
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
			shape: emptyBodyAsRecord,
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
		({
			model_id,
			moderated_boxes,
			page,
			day_since_epoch,
			hour_of_day,
			id,
			is_moderated,
		}) => ({
			method: 'PATCH',
			path: `/Inferences/Model/${encodeURIComponent(model_id)}/ImageLevelInference`,
			query: { use_ui_version: true },
			// The path holds no page or file ID: without the page's keys in the
			// body Nanonets cannot tell which page the boxes belong to.
			rawBody: JSON.stringify({
				moderated_boxes,
				page,
				day_since_epoch,
				hour_of_day,
				id,
				is_moderated,
			}),
			mediaType: 'text/plain;charset=UTF-8',
		}),
		{
			shape: emptyBodyAsRecord,
			log: ({ model_id, id, moderated_boxes }) => ({
				model_id,
				id,
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
			shape: emptyBodyAsRecord,
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
			// The live answer is an array with one entry per file.
			shape: (raw) =>
				Array.isArray(raw) ? { files: raw } : emptyBodyAsRecord(raw),
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
			shape: emptyBodyAsRecord,
			log: ({ model_id, file_ids }) => ({ model_id, files: file_ids.length }),
		},
	);
