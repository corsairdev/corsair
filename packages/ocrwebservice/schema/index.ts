import { OcrWebServiceAccount, OcrWebServiceDocument } from './database';

export const OcrWebServiceSchema = {
	version: '1.0.0',
	entities: {
		accounts: OcrWebServiceAccount,
		documents: OcrWebServiceDocument,
	},
} as const;

export type { OcrWebServiceAccount, OcrWebServiceDocument } from './database';
