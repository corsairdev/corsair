import {
	NutshellAccountEntitySchema,
	NutshellActivityEntitySchema,
	NutshellContactEntitySchema,
	NutshellInvoiceEntitySchema,
	NutshellLeadEntitySchema,
	NutshellNoteEntitySchema,
	NutshellProductEntitySchema,
	NutshellQuoteEntitySchema,
	NutshellTaskEntitySchema,
} from './database';

export const NutshellSchema = {
	version: '1.0.0',
	entities: {
		accounts: NutshellAccountEntitySchema,
		contacts: NutshellContactEntitySchema,
		leads: NutshellLeadEntitySchema,
		activities: NutshellActivityEntitySchema,
		notes: NutshellNoteEntitySchema,
		tasks: NutshellTaskEntitySchema,
		products: NutshellProductEntitySchema,
		quotes: NutshellQuoteEntitySchema,
		invoices: NutshellInvoiceEntitySchema,
	},
} as const;
