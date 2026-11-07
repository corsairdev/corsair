import type { ImageKitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ImageKitEndpointInputSchemas as Inputs,
	ImageKitEndpointOutputSchemas as Outputs,
} from './types';

export const list: ImageKitEndpoints['fileVersionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fileVersions.list',
			input: Inputs.fileVersionsList,
			output: Outputs.fileVersionsList,
		},
		input,
		({ fileId }) => ({
			method: 'GET',
			path: `/v1/files/${segment(fileId)}/versions`,
			replaySafe: true,
		}),
		{
			// The list is a bare array; an error body must not parse as an
			// empty page.
			shape: (raw) => raw ?? [],
			log: (_, result) => ({ count: result.length }),
		},
	);

export const getDetails: ImageKitEndpoints['fileVersionsGetDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'fileVersions.getDetails',
			input: Inputs.fileVersionsGetDetails,
			output: Outputs.fileVersionsGetDetails,
		},
		input,
		({ fileId, versionId }) => ({
			method: 'GET',
			path: `/v1/files/${segment(fileId)}/versions/${segment(versionId)}`,
			replaySafe: true,
		}),
	);

export const remove: ImageKitEndpoints['fileVersionsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fileVersions.delete',
			input: Inputs.fileVersionsDelete,
			output: Outputs.fileVersionsDelete,
		},
		input,
		({ fileId, versionId }) => ({
			method: 'DELETE',
			path: `/v1/files/${segment(fileId)}/versions/${segment(versionId)}`,
		}),
		{
			// 204 carries an empty-object body; an empty answer is fine too.
			shape: (raw) => raw ?? {},
			log: ({ fileId, versionId }) => ({ fileId, versionId }),
		},
	);

export const restore: ImageKitEndpoints['fileVersionsRestore'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fileVersions.restore',
			input: Inputs.fileVersionsRestore,
			output: Outputs.fileVersionsRestore,
		},
		input,
		({ fileId, versionId }) => ({
			method: 'PUT',
			path: `/v1/files/${segment(fileId)}/versions/${segment(versionId)}/restore`,
		}),
	);
