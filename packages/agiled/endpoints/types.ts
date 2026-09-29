import { z } from 'zod';

const ContactSchema = z.object({
	id: z.number().or(z.string()),
	first_name: z.string(),
	last_name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().nullable().optional(),
});

const ListContactsInputSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
});

export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;

const ListContactsResponseSchema = z.object({
	data: z.array(ContactSchema),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
});

export type ListContactsResponse = z.infer<typeof ListContactsResponseSchema>;

export type AgiledEndpointInputs = {
	listContacts: ListContactsInput;
};

export type AgiledEndpointOutputs = {
	listContacts: ListContactsResponse;
};

export const AgiledEndpointInputSchemas = {
	listContacts: ListContactsInputSchema,
} as const;

export const AgiledEndpointOutputSchemas = {
	listContacts: ListContactsResponseSchema,
} as const;
