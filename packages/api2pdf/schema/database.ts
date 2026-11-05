import { z } from 'zod';

export const Api2PdfPdfJob = z.object({
	id: z.string(),
	operation: z.string(),
	responseId: z.string(),
	fileUrl: z.string().nullable().optional(),
	success: z.boolean(),
	cost: z.number().nullable().optional(),
	mbOut: z.number().nullable().optional(),
	seconds: z.number().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type Api2PdfPdfJob = z.infer<typeof Api2PdfPdfJob>;
