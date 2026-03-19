import z from 'zod';

const AttendeeSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
});

export const GranolaNote = z.object({
	id: z.string(),
	title: z.string().optional(),
	summary: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
	attendees: z.array(AttendeeSchema).optional(),
});

export type GranolaNote = z.infer<typeof GranolaNote>;
