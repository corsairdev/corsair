import { z } from 'zod';

/**
 * Official `url` object returned by the Cutt.ly Regular API.
 * Shorten documents date/shortLink/fullLink/title for status 7 only;
 * edit returns status 1 on success. Extra provider fields are allowed
 * via .loose() but never required.
 */
export const CuttlyLinkEntity = z
	.object({
		status: z
			.number()
			.int()
			.min(0)
			.max(8)
			.describe('Cutt.ly provider status code'),
		date: z.string().optional().describe('Date the link was shortened'),
		shortLink: z.string().url().optional().describe('Shortened link URL'),
		fullLink: z.string().url().optional().describe('Original destination URL'),
		title: z.string().optional().describe('Destination page title'),
		// QR codes are generated for every Cutt.ly short link in the dashboard;
		// the API may include a QR URL, so accept it when present without requiring it.
		qrCode: z.string().url().optional().describe('QR code URL when returned'),
	})
	.loose();

export type CuttlyLinkEntity = z.infer<typeof CuttlyLinkEntity>;
