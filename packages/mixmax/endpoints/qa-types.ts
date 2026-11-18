import { z } from 'zod';

// Q&A forms (developer.mixmax.com, Q&A section): questions embedded in
// emails, with the answers recipients submitted. Field names and types match
// the official QaForm schema for /v1/qa. These are not the Yes/No questions
// in /v1/yesno.

// One answer a recipient submitted. The official schema declares the answer
// object inline without pinning extra detail, so its documented fields stay
// optional.
export const QaFormAnswerSchema = z.object({
	recipientEmail: z.string().optional(),
	recipientName: z.string().optional(),
	answer: z.string().optional(),
});

export type QaFormAnswer = z.infer<typeof QaFormAnswerSchema>;

// One question of a Q&A form, with the answers recipients gave.
export const QaFormQuestionSchema = z.object({
	// The question widget, for example `textarea`.
	type: z.string().optional(),
	// The question.
	content: z.string().optional(),
	answers: z.array(QaFormAnswerSchema).optional(),
});

export type QaFormQuestion = z.infer<typeof QaFormQuestionSchema>;

// A Q&A form. Documented fields stay optional and the object stays
// passthrough: the provider may add form detail it does not pin down.
export const QaFormSchema = z
	.object({
		_id: z.string().optional(),
		creatorId: z.string().optional(),
		// When the form was created, in Unix milliseconds.
		creationDate: z.number().optional(),
		title: z.string().optional(),
		questions: z.array(QaFormQuestionSchema).optional(),
	})
	.passthrough();

export type QaForm = z.infer<typeof QaFormSchema>;

export const QaPageSchema = z.object({
	results: z.array(QaFormSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type QaPage = z.infer<typeof QaPageSchema>;

export const QaListInputSchema = z.object({
	// How many forms per page; the provider defaults it to 50, at most 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type QaListInput = z.infer<typeof QaListInputSchema>;

export const QaListOutputSchema = QaPageSchema;

export type QaListOutput = z.infer<typeof QaListOutputSchema>;

export const QaGetInputSchema = z.object({
	id: z.string().min(1),
});

export type QaGetInput = z.infer<typeof QaGetInputSchema>;

// GET /v1/qa/{id} answers 200 with the form; a form that does not exist
// answers 404.
export const QaGetOutputSchema = QaFormSchema;

export type QaGetOutput = z.infer<typeof QaGetOutputSchema>;
