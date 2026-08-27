import { logEventFromContext } from 'corsair/core';
import { makeOcrWebServicePostRequest, OcrWebServiceAPIError } from '../client';
import type { OcrWebServiceEndpoints } from '../index';
import { RecognizeInputSchema, RecognizeResponseSchema } from './types';

export const recognize: OcrWebServiceEndpoints['recognize'] = async (
	ctx,
	input,
) => {
	const validatedInput = RecognizeInputSchema.parse(input);
	const {
		file,
		language,
		pagerange,
		tobw,
		zone,
		outputformat,
		gettext,
		getwords,
		newline,
		description,
	} = validatedInput;

	const rawResponse = await makeOcrWebServicePostRequest(
		'/restservices/processDocument',
		ctx.key,
		{
			query: {
				language,
				pagerange,
				tobw,
				zone,
				outputformat,
				gettext,
				getwords,
				newline: newline === true ? 1 : undefined,
				description,
			},
			body: file,
		},
	);

	const response = RecognizeResponseSchema.parse(rawResponse);

	if (response.ErrorMessage && response.ErrorMessage.trim().length > 0) {
		throw new OcrWebServiceAPIError(
			`OCR Web Service failed: ${response.ErrorMessage}`,
		);
	}

	await logEventFromContext(
		ctx,
		'ocrwebservice.ocr.recognize',
		{
			language,
			pagerange: pagerange ?? 'allpages',
			outputformat: outputformat ?? null,
			gettext: gettext ?? false,
			getwords: getwords ?? false,
			processedPages: response.ProcessedPages ?? 0,
		},
		'completed',
	);

	return response;
};

/** @deprecated Use recognize */
export const processDocument = recognize;
