import { z } from 'zod';

export const ClickSendMessage = z.object({
	id: z.string(),
	message_id: z.string(),
	to: z.string(),
	from: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	status: z.string(),
	direction: z.string().nullable().optional(),
	date_sent: z.string().nullable().optional(),
	price: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
});
export type ClickSendMessage = z.infer<typeof ClickSendMessage>;

export const ClickSendContact = z.object({
	id: z.string(),
	contact_id: z.string(),
	list_id: z.string(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	phone_number: z.string(),
	email: z.string().nullable().optional(),
});
export type ClickSendContact = z.infer<typeof ClickSendContact>;
