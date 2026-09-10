import { z } from 'zod';
import {
	ZohoInventoryContactEntity,
	ZohoInventoryCreditNoteEntity,
	ZohoInventoryInvoiceEntity,
	ZohoInventoryItemEntity,
	ZohoInventoryOrganizationEntity,
	ZohoInventorySalesOrderEntity,
} from './database';

export const ZohoInventoryCredentials = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
});

export type ZohoInventoryCredentials = z.infer<typeof ZohoInventoryCredentials>;

export const ZohoInventorySchema = {
	version: '1.0.0',
	entities: {
		organizations: ZohoInventoryOrganizationEntity,
		items: ZohoInventoryItemEntity,
		contacts: ZohoInventoryContactEntity,
		salesOrders: ZohoInventorySalesOrderEntity,
		invoices: ZohoInventoryInvoiceEntity,
		creditNotes: ZohoInventoryCreditNoteEntity,
	},
} as const;

export * from './database';
