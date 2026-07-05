import { z } from 'zod';

export const AgencyZoomLead = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	status: z.union([z.string(), z.number()]).optional(),
});

export const AgencyZoomCustomer = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
});

export const AgencyZoomTask = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	title: z.string().optional(),
	status: z.string().optional(),
	dueDate: z.string().optional(),
});

export type AgencyZoomLead = z.infer<typeof AgencyZoomLead>;
export type AgencyZoomCustomer = z.infer<typeof AgencyZoomCustomer>;
export type AgencyZoomTask = z.infer<typeof AgencyZoomTask>;
