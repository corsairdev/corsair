import type { ImageKitContext, ImageKitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ImageKitEndpointInputSchemas as Inputs,
	ImageKitEndpointOutputSchemas as Outputs,
} from './types';

export const getByFileId: ImageKitEndpoints['metadataGetByFileId'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metadata.getByFileId',
			input: Inputs.metadataGetByFileId,
			output: Outputs.metadataGetByFileId,
		},
		input,
		({ fileId }) => ({
			method: 'GET',
			path: `/v1/files/${segment(fileId)}/metadata`,
			replaySafe: true,
		}),
	);

export const getByUrl: ImageKitEndpoints['metadataGetByUrl'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metadata.getByUrl',
			input: Inputs.metadataGetByUrl,
			output: Outputs.metadataGetByUrl,
		},
		input,
		({ url }) => ({
			method: 'GET',
			path: '/v1/metadata',
			query: { url },
			replaySafe: true,
		}),
	);
