import { logEventFromContext } from 'corsair/core';
import { makeOcrWebServicePostRequest } from '../client';
import type { OcrWebServiceEndpoints } from '../index';

import {
	ProcessDocumentInputSchema,
	ProcessDocumentResponseSchema,
} from './types';

export const processDocument: OcrWebServiceEndpoints['processDocument'] =
	async (ctx, input) => {
		const validatedInput = ProcessDocumentInputSchema.parse(input);

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

		const formData: Record<string, unknown> = {
			file,
			language,
			pagerange,
			tobw,
			zone,
			outputformat,
			gettext,
			getwords,
			newline: newline === true ? 1 : undefined,
			description,
		};

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
				formData: {
					file,
				},
			},
		);

		const response = ProcessDocumentResponseSchema.parse(rawResponse);

		if (response.ErrorMessage && response.ErrorMessage.trim().length > 0) {
			throw new Error(`OCR Web Service failed: ${response.ErrorMessage}`);
		}

		await logEventFromContext(
			ctx,
			'ocrwebservice.processDocument',
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
