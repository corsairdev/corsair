import { z } from 'zod';

// Polls (developer.mixmax.com, Polls section): the polls the user sent in
// Mixmax emails, with the people who voted for each option. Field names and
// types match the official Poll / PollOption / PollRespondent schemas for
// /v1/polls. A poll is saved when the email that contains it is sent, so
// polls still in a draft are not listed.

// One vote on a poll option. The official schema declares the respondent
// object inline without pinning extra detail, so its documented fields stay
// optional.
export const PollRespondentSchema = z.object({
	// Email address of the person who voted.
	email: z.string().optional(),
	// Name of the person who voted, taken from the email the poll was sent
	// in; missing when the email had no name for that recipient.
	name: z.string().optional(),
	// When the vote was recorded, in Unix milliseconds.
	respondedAt: z.number().optional(),
	// Id of the Mixmax message the vote came from; present only when the
	// vote link carried a message.
	messageId: z.string().optional(),
	// Id of the sequence that sent that message; present only when the
	// message was sent by a sequence.
	sequenceId: z.string().optional(),
});

export type PollRespondent = z.infer<typeof PollRespondentSchema>;

// One answer a recipient can pick. `respondents` lists the people who
// picked this answer, in the order they voted; missing when nobody has. A
// person who changes their vote is moved to the new answer.
export const PollOptionSchema = z.object({
	// Text of the answer.
	text: z.string().optional(),
	respondents: z.array(PollRespondentSchema).optional(),
});

export type PollOption = z.infer<typeof PollOptionSchema>;

// A poll. Documented fields stay optional and the object stays passthrough:
// the provider may add poll detail it does not pin down.
export const PollSchema = z
	.object({
		// Unique id of the poll.
		_id: z.string().optional(),
		// Id of the Mixmax user who sent the poll.
		userId: z.string().optional(),
		// When the poll was saved — which is when the first email containing
		// it was sent — in Unix milliseconds.
		createdAt: z.number().optional(),
		// The poll question.
		question: z.string().optional(),
		// Whether recipients can see the current results of the poll in the
		// email.
		livePoll: z.boolean().optional(),
		// The answers, in the order they appear in the email.
		options: z.array(PollOptionSchema).optional(),
	})
	.passthrough();

export type Poll = z.infer<typeof PollSchema>;

export const PollListSchema = z.object({
	// Your polls, newest first.
	results: z.array(PollSchema),
	// Cursor for the next page; missing when the page is empty.
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	// Cursor for the previous page; missing when the page is empty.
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type PollList = z.infer<typeof PollListSchema>;

export const PollsListInputSchema = z.object({
	// Number of polls to return per page; the provider defaults it to 50,
	// treats values above 300 as 300 and values below 1 as 1.
	limit: z.coerce.number().int().min(1).max(300).optional(),
	// The `next` cursor from a previous response; returns the page after it.
	next: z.string().optional(),
	// The `previous` cursor from a previous response; returns the page
	// before it.
	previous: z.string().optional(),
	// Comma-separated fields to return for each poll. Only `_id`, `userId`,
	// `createdAt`, `question`, `livePoll` and `options` can be requested;
	// others are ignored.
	fields: z.string().optional(),
});

export type PollsListInput = z.infer<typeof PollsListInputSchema>;

export const PollsListOutputSchema = PollListSchema;

export type PollsListOutput = z.infer<typeof PollsListOutputSchema>;

export const PollsGetInputSchema = z.object({
	// The poll id.
	id: z.string().min(1),
});

export type PollsGetInput = z.infer<typeof PollsGetInputSchema>;

// GET /v1/polls/{id} answers 200 with the poll; a poll that does not exist
// answers 404 with an empty body.
export const PollsGetOutputSchema = PollSchema;

export type PollsGetOutput = z.infer<typeof PollsGetOutputSchema>;
