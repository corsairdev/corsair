import { z } from 'zod';

export const TwilioMessage = z.object({
	id: z.string(),
	sid: z.string(),
	to: z.string(),
	from: z.string(),
	body: z.string().nullable(),
	status: z.string(),
	direction: z.string(),
	date_sent: z.string().nullable(),
	price: z.string().nullable(),
	price_unit: z.string().nullable(),
});
export type TwilioMessage = z.infer<typeof TwilioMessage>;

export const TwilioCall = z.object({
	id: z.string(),
	sid: z.string(),
	to: z.string(),
	from: z.string(),
	status: z.string(),
	direction: z.string(),
	duration: z.string().nullable().optional(),
	start_time: z.string().nullable(),
	end_time: z.string().nullable(),
	price: z.string().nullable(),
	price_unit: z.string().nullable(),
});
export type TwilioCall = z.infer<typeof TwilioCall>;
