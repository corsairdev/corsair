import { z } from 'zod';

export const HubSpotContact = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archived: z.boolean().optional(),
});

export const HubSpotCompany = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archived: z.boolean().optional(),
});

export const HubSpotDeal = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archived: z.boolean().optional(),
});

export const HubSpotTicket = z.object({
	id: z.string(),
	properties: z.record(z.any()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archived: z.boolean().optional(),
});

export const HubSpotEngagement = z.object({
	id: z.string(),
	engagement: z
		.object({
			id: z.number().optional(),
			portalId: z.number().optional(),
			active: z.boolean().optional(),
			createdAt: z.number().optional(),
			lastUpdated: z.number().optional(),
			createdBy: z.number().optional(),
			modifiedBy: z.number().optional(),
			ownerId: z.number().optional(),
			type: z.string().optional(),
			timestamp: z.number().optional(),
		})
		.optional(),
	associations: z.record(z.string(), z.any()).optional(),
	metadata: z.record(z.string(), z.any()).optional(),
});

export type HubSpotContact = z.infer<typeof HubSpotContact>;
export type HubSpotCompany = z.infer<typeof HubSpotCompany>;
export type HubSpotDeal = z.infer<typeof HubSpotDeal>;
export type HubSpotTicket = z.infer<typeof HubSpotTicket>;
export type HubSpotEngagement = z.infer<typeof HubSpotEngagement>;
