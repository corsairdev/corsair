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
	started_at: z.coerce.date().nullable().optional(),
	ended_at: z.coerce.date().nullable().optional(),
	duration_seconds: z.number().optional(),
	status: z.string().optional(),
	attendees: z.array(AttendeeSchema).optional(),
	tags: z.array(z.string()).optional(),
});

export const GranolaPerson = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	company: z.string().optional(),
	role: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const GranolaTranscript = z.object({
	id: z.string(),
	note_id: z.string(),
	full_text: z.string().optional(),
	segments: z
		.array(
			z.object({
				speaker: z.string().optional(),
				text: z.string().optional(),
				start_time: z.number().optional(),
				end_time: z.number().optional(),
			}),
		)
		.optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export type GranolaNote = z.infer<typeof GranolaNote>;
export type GranolaPerson = z.infer<typeof GranolaPerson>;
export type GranolaTranscript = z.infer<typeof GranolaTranscript>;
