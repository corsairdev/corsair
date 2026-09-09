import { z } from 'zod';

export const ClickmeetingConferenceEntity = z.object({
	id: z.coerce.string(),
	name: z.string(),
	room_url: z.string().optional(),
	status: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type ClickmeetingConferenceEntity = z.infer<
	typeof ClickmeetingConferenceEntity
>;

export const ClickmeetingContactEntity = z.object({
	id: z.coerce.string().optional(),
	email: z.string().email(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
});
export type ClickmeetingContactEntity = z.infer<
	typeof ClickmeetingContactEntity
>;
