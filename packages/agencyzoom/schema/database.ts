import { z } from 'zod';

// Field names match AgencyZoom API wire format (lowercase firstname/lastname).
export const AgencyZoomLead = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		email: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
	})
	.catchall(z.unknown());

export const AgencyZoomCustomer = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		email: z.string().optional(),
	})
	.catchall(z.unknown());

export const AgencyZoomTask = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		title: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
		dueDate: z.string().optional(),
	})
	.catchall(z.unknown());

export type AgencyZoomLead = z.infer<typeof AgencyZoomLead>;
export type AgencyZoomCustomer = z.infer<typeof AgencyZoomCustomer>;
export type AgencyZoomTask = z.infer<typeof AgencyZoomTask>;
