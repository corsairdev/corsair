import { z } from 'zod';

// Vault metadata cached for listing/search — no item secrets.
export const OnePasswordVault = z.object({
	id: z.string().describe('Vault ID'),
	name: z.string().describe('Vault name'),
	description: z.string().optional().describe('Vault description'),
	attributeVersion: z.number().optional().describe('Attribute version'),
	contentVersion: z.number().optional().describe('Content version'),
	type: z.string().optional().describe('Vault type'),
});
export type OnePasswordVault = z.infer<typeof OnePasswordVault>;

// Item metadata only — field values are omitted so secrets stay out of the cache.
export const OnePasswordItem = z.object({
	id: z.string().describe('Item ID'),
	title: z.string().describe('Item title'),
	vault: z
		.object({
			id: z.string().describe('Owning vault ID'),
		})
		.describe('Vault reference'),
	category: z.string().describe('Item category'),
	urls: z
		.array(
			z.object({
				primary: z.boolean().optional(),
				href: z.string(),
			}),
		)
		.optional()
		.describe('Associated URLs'),
});
export type OnePasswordItem = z.infer<typeof OnePasswordItem>;
