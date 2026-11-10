import type { TaggunEndpoints } from '..';
import { call, compact, scanFields } from './call';
import {
	TaggunEndpointInputSchemas as Inputs,
	TaggunEndpointOutputSchemas as Outputs,
} from './types';

export const url: TaggunEndpoints['simpleUrl'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'simple.url',
			input: Inputs.simpleUrl,
			output: Outputs.simpleUrl,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/receipt/v1/simple/url',
			body: compact({
				url: parsed.url,
				headers: parsed.headers,
				...scanFields(parsed),
			}),
		}),
		{
			log: (_parsed, result) => ({
				merchantName: result.merchantName?.data,
				totalAmount: result.totalAmount?.data,
			}),
		},
	);

export const encoded: TaggunEndpoints['simpleEncoded'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'simple.encoded',
			input: Inputs.simpleEncoded,
			output: Outputs.simpleEncoded,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/receipt/v1/simple/encoded',
			body: compact({
				image: parsed.image,
				filename: parsed.filename,
				contentType: parsed.contentType,
				...scanFields(parsed),
			}),
		}),
		{
			// The base64 payload is the document; only its name is logged.
			log: (parsed, result) => ({
				filename: parsed.filename,
				contentType: parsed.contentType,
				totalAmount: result.totalAmount?.data,
			}),
		},
	);

export const file: TaggunEndpoints['simpleFile'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'simple.file',
			input: Inputs.simpleFile,
			output: Outputs.simpleFile,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/receipt/v1/simple/file',
			formData: { file: parsed.file, ...scanFields(parsed) },
		}),
		{
			log: (_parsed, result) => ({
				merchantName: result.merchantName?.data,
				totalAmount: result.totalAmount?.data,
			}),
		},
	);
