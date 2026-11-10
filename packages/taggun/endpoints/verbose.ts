import type { TaggunEndpoints } from '..';
import { call, compact, scanFields } from './call';
import {
	TaggunEndpointInputSchemas as Inputs,
	TaggunEndpointOutputSchemas as Outputs,
} from './types';

export const url: TaggunEndpoints['verboseUrl'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'verbose.url',
			input: Inputs.verboseUrl,
			output: Outputs.verboseUrl,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/receipt/v1/verbose/url',
			body: compact({
				url: parsed.url,
				headers: parsed.headers,
				extractLineItems: parsed.extractLineItems,
				...scanFields(parsed),
			}),
		}),
		{
			// Receipt fields stay out of the event log: ids and counts only.
			log: (_parsed, result) => ({
				trackingId: result.trackingId,
				lineItems: result.entities?.productLineItems?.length ?? 0,
			}),
		},
	);

export const encoded: TaggunEndpoints['verboseEncoded'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'verbose.encoded',
			input: Inputs.verboseEncoded,
			output: Outputs.verboseEncoded,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/receipt/v1/verbose/encoded',
			body: compact({
				image: parsed.image,
				filename: parsed.filename,
				contentType: parsed.contentType,
				extractLineItems: parsed.extractLineItems,
				...scanFields(parsed),
			}),
		}),
		{
			// The base64 payload is the document; only its name is logged.
			log: (parsed, result) => ({
				filename: parsed.filename,
				contentType: parsed.contentType,
				trackingId: result.trackingId,
			}),
		},
	);

export const file: TaggunEndpoints['verboseFile'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'verbose.file',
			input: Inputs.verboseFile,
			output: Outputs.verboseFile,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/receipt/v1/verbose/file',
			formData: compact({
				file: parsed.file,
				extractLineItems: parsed.extractLineItems,
				...scanFields(parsed),
			}),
		}),
		{
			// Receipt fields stay out of the event log: ids and counts only.
			log: (_parsed, result) => ({
				trackingId: result.trackingId,
				lineItems: result.entities?.productLineItems?.length ?? 0,
			}),
		},
	);
