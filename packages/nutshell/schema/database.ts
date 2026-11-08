import { z } from 'zod';
import {
	NutshellAccountSchema,
	NutshellActivitySchema,
	NutshellContactSchema,
	NutshellNoteSchema,
	NutshellTaskSchema,
} from './components';

const NutshellMoneyEntitySchema = z
	.object({
		amount: z.string().optional(),
		formatted: z.string().optional(),
		currency: z.string().optional(),
	})
	.loose();

// Lead responses vary by endpoint. Keep the fields used across common CRM
// workflows typed and retain provider-specific additions for persistence.
export const NutshellLeadEntitySchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		status: z.string().optional(),
		value: z
			.object({
				amount: z.string().optional(),
				currency: z.string().optional(),
			})
			.loose()
			.optional(),
		owner: z.string().optional(),
	})
	.catchall(z.unknown()); // Nutshell responses include fields that vary by endpoint.

export const NutshellAccountEntitySchema = NutshellAccountSchema;
export const NutshellContactEntitySchema = NutshellContactSchema;
export const NutshellActivityEntitySchema = NutshellActivitySchema;
export const NutshellNoteEntitySchema = NutshellNoteSchema;
export const NutshellTaskEntitySchema = NutshellTaskSchema;

export const NutshellProductEntitySchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		sku: z.string().optional(),
		// products.list and products.get return the price as a money object
		// (amount/formatted/currency), so a fetched product round-trips through
		// the database client without rewriting its data.
		price: NutshellMoneyEntitySchema.optional(),
	})
	.catchall(z.unknown()); // Product fields are returned differently in quotes and catalog routes.

export const NutshellQuoteEntitySchema = z
	.object({
		id: z.string().optional(),
		displayStatus: z.string().optional(),
		total: NutshellMoneyEntitySchema.optional(),
	})
	.catchall(z.unknown()); // Preserve quote line-item and recipient fields from provider responses.

export const NutshellInvoiceEntitySchema = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
		total: NutshellMoneyEntitySchema.optional(),
	})
	.catchall(z.unknown()); // Invoice fields vary according to the originating quote.
