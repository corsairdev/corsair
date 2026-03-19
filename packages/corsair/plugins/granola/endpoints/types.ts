import { z } from 'zod';

// ── Input Schemas ─────────────────────────────────────────────────────────────

const NotesGetInputSchema = z.object({
	note_id: z.string(),
});

const NotesListInputSchema = z.object({
	limit: z.number().optional(),
	cursor: z.string().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	status: z.string().optional(),
	tag: z.string().optional(),
});

const NotesCreateInputSchema = z.object({
	title: z.string().optional(),
	summary: z.string().optional(),
	started_at: z.string().optional(),
	ended_at: z.string().optional(),
	attendees: z
		.array(
			z.object({
				name: z.string().optional(),
				email: z.string().optional(),
			}),
		)
		.optional(),
	tags: z.array(z.string()).optional(),
});

const NotesUpdateInputSchema = z.object({
	note_id: z.string(),
	title: z.string().optional(),
	summary: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

const NotesDeleteInputSchema = z.object({
	note_id: z.string(),
});

const PeopleGetInputSchema = z.object({
	person_id: z.string(),
});

const PeopleListInputSchema = z.object({
	limit: z.number().optional(),
	cursor: z.string().optional(),
	query: z.string().optional(),
});

const PeopleCreateInputSchema = z.object({
	name: z.string(),
	email: z.string().optional(),
	company: z.string().optional(),
	role: z.string().optional(),
});

const PeopleUpdateInputSchema = z.object({
	person_id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	company: z.string().optional(),
	role: z.string().optional(),
});

const TranscriptsGetInputSchema = z.object({
	note_id: z.string(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const AttendeeSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

const NoteSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		summary: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		started_at: z.string().optional(),
		ended_at: z.string().optional(),
		duration_seconds: z.number().optional(),
		status: z.string().optional(),
		attendees: z.array(AttendeeSchema).optional(),
		tags: z.array(z.string()).optional(),
	})
	.passthrough();

const PersonSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		email: z.string().optional(),
		company: z.string().optional(),
		role: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

const TranscriptSegmentSchema = z
	.object({
		speaker: z.string().optional(),
		text: z.string().optional(),
		start_time: z.number().optional(),
		end_time: z.number().optional(),
	})
	.passthrough();

const TranscriptSchema = z
	.object({
		id: z.string(),
		note_id: z.string(),
		full_text: z.string().optional(),
		segments: z.array(TranscriptSegmentSchema).optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

const PaginationSchema = z
	.object({
		next_cursor: z.string().optional(),
		has_more: z.boolean().optional(),
		total: z.number().optional(),
	})
	.passthrough();

const NotesGetResponseSchema = z
	.object({
		note: NoteSchema.optional(),
	})
	.passthrough();

const NotesListResponseSchema = z
	.object({
		notes: z.array(NoteSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

const NotesCreateResponseSchema = z
	.object({
		note: NoteSchema.optional(),
	})
	.passthrough();

const NotesUpdateResponseSchema = z
	.object({
		note: NoteSchema.optional(),
	})
	.passthrough();

const NotesDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		note_id: z.string().optional(),
	})
	.passthrough();

const PeopleGetResponseSchema = z
	.object({
		person: PersonSchema.optional(),
	})
	.passthrough();

const PeopleListResponseSchema = z
	.object({
		people: z.array(PersonSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

const PeopleCreateResponseSchema = z
	.object({
		person: PersonSchema.optional(),
	})
	.passthrough();

const PeopleUpdateResponseSchema = z
	.object({
		person: PersonSchema.optional(),
	})
	.passthrough();

const TranscriptsGetResponseSchema = z
	.object({
		transcript: TranscriptSchema.optional(),
	})
	.passthrough();

// ── Schema Maps ───────────────────────────────────────────────────────────────

export const GranolaEndpointInputSchemas = {
	notesGet: NotesGetInputSchema,
	notesList: NotesListInputSchema,
	notesCreate: NotesCreateInputSchema,
	notesUpdate: NotesUpdateInputSchema,
	notesDelete: NotesDeleteInputSchema,
	peopleGet: PeopleGetInputSchema,
	peopleList: PeopleListInputSchema,
	peopleCreate: PeopleCreateInputSchema,
	peopleUpdate: PeopleUpdateInputSchema,
	transcriptsGet: TranscriptsGetInputSchema,
} as const;

export const GranolaEndpointOutputSchemas = {
	notesGet: NotesGetResponseSchema,
	notesList: NotesListResponseSchema,
	notesCreate: NotesCreateResponseSchema,
	notesUpdate: NotesUpdateResponseSchema,
	notesDelete: NotesDeleteResponseSchema,
	peopleGet: PeopleGetResponseSchema,
	peopleList: PeopleListResponseSchema,
	peopleCreate: PeopleCreateResponseSchema,
	peopleUpdate: PeopleUpdateResponseSchema,
	transcriptsGet: TranscriptsGetResponseSchema,
} as const;

export type GranolaEndpointInputs = {
	[K in keyof typeof GranolaEndpointInputSchemas]: z.infer<
		(typeof GranolaEndpointInputSchemas)[K]
	>;
};

export type GranolaEndpointOutputs = {
	[K in keyof typeof GranolaEndpointOutputSchemas]: z.infer<
		(typeof GranolaEndpointOutputSchemas)[K]
	>;
};

export type NotesGetResponse = z.infer<typeof GranolaEndpointOutputSchemas.notesGet>;
export type NotesListResponse = z.infer<typeof GranolaEndpointOutputSchemas.notesList>;
export type NotesCreateResponse = z.infer<typeof GranolaEndpointOutputSchemas.notesCreate>;
export type NotesUpdateResponse = z.infer<typeof GranolaEndpointOutputSchemas.notesUpdate>;
export type NotesDeleteResponse = z.infer<typeof GranolaEndpointOutputSchemas.notesDelete>;
export type PeopleGetResponse = z.infer<typeof GranolaEndpointOutputSchemas.peopleGet>;
export type PeopleListResponse = z.infer<typeof GranolaEndpointOutputSchemas.peopleList>;
export type PeopleCreateResponse = z.infer<typeof GranolaEndpointOutputSchemas.peopleCreate>;
export type PeopleUpdateResponse = z.infer<typeof GranolaEndpointOutputSchemas.peopleUpdate>;
export type TranscriptsGetResponse = z.infer<typeof GranolaEndpointOutputSchemas.transcriptsGet>;
