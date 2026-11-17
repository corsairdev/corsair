import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { pdflessRequest } from '../client';
import type { PdfLessContext } from '../context';
import type { GeneratePdfInput, GeneratePdfResponse } from './types';
import { GeneratePdfInputSchema, GeneratePdfResponseSchema } from './types';

/**
 * Renders a PDF from a template and returns its download link. The request
 * body (template data, PDF passwords) is kept out of errors and events.
 */
export const generatePdf: CorsairEndpoint<
	PdfLessContext,
	GeneratePdfInput,
	GeneratePdfResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('pdfless', 'api_key');
	}
	const parsed = GeneratePdfInputSchema.parse(input);
	// unknown: the raw reply is untrusted until the schema parses it below.
	const body = await pdflessRequest<unknown>(ctx.key, {
		method: 'POST',
		url: '/v1/pdfs',
		body: parsed,
		redactBodyInErrors: true,
	});
	const result = GeneratePdfResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'pdfless.pdfs.generate',
		{ template_id: parsed.template_id },
		'completed',
	);
	return result;
};
