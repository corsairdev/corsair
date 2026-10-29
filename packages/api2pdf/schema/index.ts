import { Api2PdfPdfJob } from './database';

export const Api2PdfSchema = {
	version: '1.0.0',
	entities: {
		pdfJobs: Api2PdfPdfJob,
	},
} as const;
