import { z } from 'zod';

// ── Input Schemas ─────────────────────────────────────────────────────────────

const NotesGetInputSchema = z.object({
	note_id: z.string(),
	include: z.literal('transcript').optional(),
});

const NotesListInputSchema = z.object({
	limit: z.number().optional(),
	cursor: z.string().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const AttendeeSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

const TranscriptEntrySchema = z
	.object({
		speaker_source: z.string().optional(),
		text: z.string().optional(),
		start_time: z.number().optional(),
		end_time: z.number().optional(),
	})
	.passthrough();

const FolderMembershipSchema = z
	.object({
		folder_id: z.string().optional(),
		folder_name: z.string().optional(),
	})
	.passthrough();

const NoteSchema = z
	.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		owner: z
			.object({
				name: z.string().optional(),
				email: z.string().optional(),
			})
			.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		calendar_event: z
			.object({
				organizer: z.object({ name: z.string().optional(), email: z.string().optional() }).optional(),
				invitees: z.array(AttendeeSchema).optional(),
				start_time: z.string().optional(),
				end_time: z.string().optional(),
			})
			.optional(),
		attendees: z.array(AttendeeSchema).optional(),
		folder_membership: z.array(FolderMembershipSchema).optional(),
		summary_text: z.string().optional(),
		summary_markdown: z.string().nullable().optional(),
		transcript: z.array(TranscriptEntrySchema).nullable().optional(),
	})
	.passthrough();

const PaginationSchema = z
	.object({
		next_cursor: z.string().optional(),
		has_more: z.boolean().optional(),
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
		next_cursor: z.string().nullable().optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

// ── Schema Maps ───────────────────────────────────────────────────────────────

export const GranolaEndpointInputSchemas = {
	notesGet: NotesGetInputSchema,
	notesList: NotesListInputSchema,
} as const;

export const GranolaEndpointOutputSchemas = {
	notesGet: NotesGetResponseSchema,
	notesList: NotesListResponseSchema,
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
