import { z } from 'zod';

// Yes/No questions (developer.mixmax.com, Yes/No Questions section): the
// questions the user sent in emails, with who picked each answer. Field
// names and types match the official YesNoQuestion schema for /v1/yesno.

// One answer choice of a Yes/No question. The official schema declares the
// answer object inline without pinning extra detail, so its documented
// fields stay optional.
export const YesNoQuestionAnswerSchema = z.object({
	// The answer text.
	text: z.string().optional(),
	// The email addresses of the people who picked this answer; missing when
	// nobody has. Each person counts toward one answer only; picking another
	// answer moves them.
	respondents: z.array(z.string()).optional(),
});

export type YesNoQuestionAnswer = z.infer<typeof YesNoQuestionAnswerSchema>;

// A Yes/No question. Documented fields stay optional and the object stays
// passthrough: the provider may add question detail it does not pin down.
export const YesNoQuestionSchema = z
	.object({
		// The question id.
		_id: z.string().optional(),
		// The id of the user who sent the question.
		userId: z.string().optional(),
		// When the question was created, in Unix milliseconds.
		created: z.number().optional(),
		// The question.
		text: z.string().optional(),
		// The answer choices, in the order shown in the email.
		answers: z.array(YesNoQuestionAnswerSchema).optional(),
	})
	.passthrough();

export type YesNoQuestion = z.infer<typeof YesNoQuestionSchema>;

export const YesNoQuestionPageSchema = z.object({
	results: z.array(YesNoQuestionSchema),
	// Pass as `next` to get the following page.
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	// Pass as `previous` to get the page before this one.
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type YesNoQuestionPage = z.infer<typeof YesNoQuestionPageSchema>;

export const YesNoListInputSchema = z.object({
	// How many questions per page; the provider defaults it to 50, at most
	// 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` value from the previous page.
	next: z.string().optional(),
	// The `previous` value from the following page.
	previous: z.string().optional(),
	// Comma-separated fields to return, for example `text,answers`. Only
	// `_id`, `userId`, `created`, `text` and `answers` can be returned.
	fields: z.string().optional(),
});

export type YesNoListInput = z.infer<typeof YesNoListInputSchema>;

export const YesNoListOutputSchema = YesNoQuestionPageSchema;

export type YesNoListOutput = z.infer<typeof YesNoListOutputSchema>;

export const YesNoGetInputSchema = z.object({
	// The question id.
	id: z.string().min(1),
});

export type YesNoGetInput = z.infer<typeof YesNoGetInputSchema>;

// GET /v1/yesno/{id} answers 200 with the question; a question that does not
// exist answers 404 with an empty body.
export const YesNoGetOutputSchema = YesNoQuestionSchema;

export type YesNoGetOutput = z.infer<typeof YesNoGetOutputSchema>;
