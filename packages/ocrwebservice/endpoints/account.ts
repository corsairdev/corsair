import { logEventFromContext } from 'corsair/core';
import {
	makeOcrWebServiceGetRequest,
	makeOcrWebServiceRequest,
	OcrWebServiceAPIError,
	parseCredentials,
} from '../client';
import type { OcrWebServiceEndpoints } from '../index';
import {
	GetAccountCredentialsInputSchema,
	GetAccountCredentialsResponseSchema,
	GetAccountInformationInputSchema,
	GetAccountInformationResponseSchema,
	LogInputSchema,
	LogResponseSchema,
} from './types';

export const getCredentials: OcrWebServiceEndpoints['getAccountCredentials'] =
	async (ctx, input) => {
		GetAccountCredentialsInputSchema.parse(input);
		const { username } = parseCredentials(ctx.key);
		const response = GetAccountCredentialsResponseSchema.parse({
			user_name: username,
		});
		await logEventFromContext(
			ctx,
			'ocrwebservice.account.getCredentials',
			{ user_name: username },
			'completed',
		);
		return response;
	};

export const getInformation: OcrWebServiceEndpoints['getAccountInformation'] =
	async (ctx, input) => {
		GetAccountInformationInputSchema.parse(input);
		const rawResponse = await makeOcrWebServiceGetRequest(
			'/restservices/getAccountInformation',
			ctx.key,
		);
		const response = GetAccountInformationResponseSchema.parse(rawResponse);

		if (response.ErrorMessage && response.ErrorMessage.trim().length > 0) {
			throw new OcrWebServiceAPIError(
				`OCR Web Service failed: ${response.ErrorMessage}`,
			);
		}

		await logEventFromContext(
			ctx,
			'ocrwebservice.account.getInformation',
			{
				availablePages: response.AvailablePages ?? null,
				subscriptionPlan: response.SubcriptionPlan ?? null,
			},
			'completed',
		);
		return response;
	};

function soapLogData(body: unknown): string {
	if (typeof body !== 'string') {
		return JSON.stringify(body ?? '');
	}

	const match = body.match(
		/<(?:\w+:)?OCRWebServiceLogResult[^>]*>([\s\S]*?)<\/(?:\w+:)?OCRWebServiceLogResult>/,
	);
	return match?.[1]?.trim() ?? body;
}

export const log: OcrWebServiceEndpoints['log'] = async (ctx, input) => {
	const { from_date, to_date, reserved } = LogInputSchema.parse(input);
	const { username, licenseCode } = parseCredentials(ctx.key);

	const form = new URLSearchParams({
		user_name: username,
		license_code: licenseCode,
		from_date,
		to_date,
	});
	if (reserved?.length) {
		for (const value of reserved) {
			form.append('reserved', value);
		}
	}

	const rawResponse = await makeOcrWebServiceRequest(
		'/services/OCRWebService.asmx/OCRWebServiceLog',
		ctx.key,
		{
			method: 'POST',
			basicAuth: false,
			accept: 'text/xml',
			mediaType: 'application/x-www-form-urlencoded',
			body: form.toString(),
		},
	);

	const response = LogResponseSchema.parse({ data: soapLogData(rawResponse) });
	await logEventFromContext(
		ctx,
		'ocrwebservice.account.log',
		{ from_date, to_date },
		'completed',
	);
	return response;
};
