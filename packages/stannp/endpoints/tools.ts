import type { StannpEndpoints } from '..';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const templates: StannpEndpoints['toolsTemplates'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tools.templates',
			input: Inputs.toolsTemplates,
			output: Outputs.toolsTemplates,
		},
		input,
		(_parsed, base) => ({
			method: 'GET',
			base,
			path: '/v1/templates/list',
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);

export const pdfMerge: StannpEndpoints['toolsPdfMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tools.pdfMerge',
			input: Inputs.toolsPdfMerge,
			output: Outputs.toolsPdfMerge,
		},
		input,
		({ files, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/pdf/merge',
			form: { files },
			idempotencyKey,
		}),
		{
			log: ({ files }) => ({ count: files.length }),
		},
	);
