import { z } from 'zod';

// The document family is doctype-parameterized, so the stored entity keeps
// the fields common to every Frappe document and preserves provider-specific
// additions for persistence.
export const ErpnextDocumentEntitySchema = z
	.object({
		doctype: z.string().optional(),
		name: z.string().optional(),
		owner: z.string().optional(),
		creation: z.string().optional(),
		modified: z.string().optional(),
		modified_by: z.string().optional(),
		docstatus: z.number().int().optional(),
		idx: z.number().int().optional(),
	})
	.catchall(z.unknown()); // DocType-specific fields vary; preserve provider additions.
