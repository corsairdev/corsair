import { z } from 'zod';

/** @see https://www.ocrwebservice.com/api/restguide — getAccountInformation */
export const OcrWebServiceAccount = z.object({
	id: z.string(),
	availablePages: z.number().optional(),
	maxPages: z.number().optional(),
	subscriptionPlan: z.string().optional(),
	expirationDate: z.string().optional(),
	lastProcessingTime: z.string().optional(),
});

/** @see https://www.ocrwebservice.com/api/restguide — processDocument */
export const OcrWebServiceDocument = z.object({
	id: z.string(),
	outputFileUrl: z.string().nullable().optional(),
	processedPages: z.number().optional(),
	availablePages: z.number().optional(),
	taskDescription: z.string().nullable().optional(),
});

export type OcrWebServiceAccount = z.infer<typeof OcrWebServiceAccount>;
export type OcrWebServiceDocument = z.infer<typeof OcrWebServiceDocument>;
