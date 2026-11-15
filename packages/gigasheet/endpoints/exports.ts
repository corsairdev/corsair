import { logEventFromContext } from 'corsair/core';
import type { GigasheetEndpoints } from '..';
import { makeGigasheetRequest } from '../client';
import type { ExportsCreateResponse, ExportsDownloadResponse } from './types';
import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
} from './types';

export const create: GigasheetEndpoints['exports.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['exports.create'].parse(input);
	const { handle, ...exportOptions } = parsedInput;
	// gridState is required by POST /dataset/{handle}/export.
	const exportBody = {
		...exportOptions,
		gridState: exportOptions.gridState ?? {},
	};

	const response = await makeGigasheetRequest<ExportsCreateResponse>(
		`/dataset/${encodeURIComponent(handle)}/export`,
		ctx.key,
		{
			method: 'POST',
			body: exportBody,
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['exports.create'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.exports.create',
		{ handle, exportHandle: parsed.handle },
		'completed',
	);

	return parsed;
};

export const download: GigasheetEndpoints['exports.download'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['exports.download'].parse(input);
	const response = await makeGigasheetRequest<ExportsDownloadResponse>(
		`/dataset/${encodeURIComponent(parsedInput.handle)}/download-export`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['exports.download'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.exports.download',
		{ handle: parsedInput.handle, hasUrl: Boolean(parsed.presignedUrl) },
		'completed',
	);

	return parsed;
};

export const Exports = {
	create,
	download,
};
