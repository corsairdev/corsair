import type { CustomjsEndpoints } from '..';
import { call } from './call';
import {
	CustomjsEndpointInputSchemas as Inputs,
	CustomjsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * A missing `html` is not an error to CustomJS: it answers 200 with a blank one
 * page PDF. The input schema requires the field so the caller is not handed an
 * empty document and told it worked.
 */
export const fromHtml: CustomjsEndpoints['pdfFromHtml'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf.fromHtml',
			input: Inputs.pdfFromHtml,
			output: Outputs.pdfFromHtml,
			reader: 'binary',
			replayable: true,
		},
		input,
		({ html, data, config }) => ({
			method: 'POST',
			path: '/html2pdf',
			body: {
				input: {
					html,
					...(data === undefined ? {} : { data }),
					...(config === undefined ? {} : { config }),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				htmlLength: parsed.html.length,
				templated: parsed.data !== undefined,
				byteLength: result.byteLength,
			}),
		},
	);

/** The route takes `{ markdown }`, not the `{ html }` the other render routes take. */
export const fromMarkdown: CustomjsEndpoints['pdfFromMarkdown'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pdf.fromMarkdown',
			input: Inputs.pdfFromMarkdown,
			output: Outputs.pdfFromMarkdown,
			reader: 'binary',
			replayable: true,
		},
		input,
		({ markdown }) => ({
			method: 'POST',
			path: '/markdown2pdf',
			body: { input: { markdown } },
		}),
		{
			log: (parsed, result) => ({
				markdownLength: parsed.markdown.length,
				byteLength: result.byteLength,
			}),
		},
	);
