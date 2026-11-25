import type { FileOutput } from 'corsair/http';
import { FileOutputSchema } from 'corsair/http';
import { z } from 'zod';
import type {
	Draft,
	DraftListResponse,
	Label,
	LabelListResponse,
	Message,
	MessageListResponse,
	Profile,
	Thread,
	ThreadListResponse,
} from '../types';

/** Gmail API `raw` fields expect base64url RFC 2822 — not plain email text. */
const GMAIL_RAW_MESSAGE_ENCODE_DESCRIPTION =
	'Base64url-encoded RFC 2822 email — do NOT pass plain email text. Build the MIME message (From, To, Subject, Content-Type headers, blank line, body; lines separated by \\r\\n), then base64url-encode: standard base64, replace + with -, / with _, remove trailing =.';

const GmailRawMessageFieldsSchema = z.object({
	raw: z.string().optional().describe(GMAIL_RAW_MESSAGE_ENCODE_DESCRIPTION),
	threadId: z.string().optional(),
});

const GMAIL_QUERY_DESCRIPTION =
	'Same syntax as the Gmail search box, e.g. "from:alice newer_than:7d" or "after:2025/01/31 has:attachment".';
const GMAIL_LABEL_IDS_DESCRIPTION =
	'Label ids such as INBOX, UNREAD or Label_123, not label names; all of them must match. labels.list returns the ids.';
const GMAIL_INCLUDE_SPAM_TRASH_DESCRIPTION =
	'Spam and trash are left out unless this is true.';

const isCalendarDate = (value: string): boolean => {
	const [y, m, d] = value.split('-').map(Number);
	const date = new Date(Date.UTC(y as number, (m as number) - 1, d as number));
	return date.getUTCMonth() === (m as number) - 1 && date.getUTCDate() === d;
};
const GmailDate = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
	.refine(isCalendarDate, 'Must be a real calendar date');
const GmailSize = z
	.union([z.number().int().positive(), z.string().regex(/^\d+[KMG]?$/i)])
	.describe('Bytes, or a number with a K, M or G suffix such as "5M"');
const addressList = (what: string) =>
	z
		.array(z.string().min(1))
		.optional()
		.describe(`${what}: email address or name; several match any of them`);

const MessagesListInputSchema = z.object({
	userId: z.string().optional(),
	q: z
		.string()
		.optional()
		.describe(
			`${GMAIL_QUERY_DESCRIPTION} Optional: prefer the structured fields below; when both are given, a message must match both.`,
		),

	// ── Content filters ────────────────────────────────────────────────────
	keywords: z
		.array(z.string().min(1))
		.optional()
		.describe('Words that must all appear in the message (AND logic)'),
	exactPhrase: z
		.string()
		.optional()
		.describe('Exact phrase that must appear in the message'),
	anyOf: z
		.array(z.string().trim().min(1))
		.min(2)
		.optional()
		.describe(
			'At least one of these words must appear (OR logic, minimum 2 items)',
		),
	exclude: z
		.array(z.string().min(1))
		.optional()
		.describe('Words that must not appear in the message'),
	subject: z
		.string()
		.optional()
		.describe('Words that must appear in the subject line'),

	// ── People ─────────────────────────────────────────────────────────────
	from: addressList('Sender'),
	to: addressList('Recipient in the To field'),
	cc: addressList('Recipient in the Cc field'),

	// ── Time ───────────────────────────────────────────────────────────────
	after: GmailDate.optional().describe(
		'Only messages sent on or after this date (YYYY-MM-DD)',
	),
	before: GmailDate.optional().describe(
		'Only messages sent before this date (YYYY-MM-DD)',
	),

	// ── Message properties ─────────────────────────────────────────────────
	hasAttachment: z
		.boolean()
		.optional()
		.describe('true: only messages with an attachment'),
	filename: z
		.string()
		.optional()
		.describe('Attachment file name or type, e.g. "report.pdf" or "pdf"'),
	label: z
		.string()
		.optional()
		.describe(
			'Label name (not id), e.g. "work". Spaces in a name are written as hyphens.',
		),
	in: z
		.enum(['inbox', 'sent', 'drafts', 'trash', 'spam', 'snoozed', 'anywhere'])
		.optional()
		.describe('Mailbox location; "anywhere" also searches spam and trash'),
	isUnread: z
		.boolean()
		.optional()
		.describe('true: only unread messages; false: only read messages'),
	isStarred: z
		.boolean()
		.optional()
		.describe('true: only starred messages; false: only unstarred ones'),
	larger: GmailSize.optional(),
	smaller: GmailSize.optional(),

	maxResults: z
		.number()
		.optional()
		.describe('Defaults to 100, at most 500. Follow nextPageToken for more.'),
	pageToken: z.string().optional(),
	labelIds: z
		.array(z.string())
		.optional()
		.describe(GMAIL_LABEL_IDS_DESCRIPTION),
	includeSpamTrash: z
		.boolean()
		.optional()
		.describe(GMAIL_INCLUDE_SPAM_TRASH_DESCRIPTION),
});

export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

// Values Gmail would read as an operator, a group or a boolean keyword.
const NEEDS_QUOTES = /[\s:(){}"]|^(?:OR|AND|AROUND)$|^-/;

function term(value: string): string {
	// Gmail has no escape for a double quote inside a phrase, so drop it.
	const v = value.trim().replace(/"/g, '');
	return NEEDS_QUOTES.test(v) ? `"${v}"` : v;
}

function operator(name: string, values?: string[]): string[] {
	const ops = (values ?? [])
		.filter((v) => v.trim())
		.map((v) => `${name}:${term(v)}`);
	// {a b} is Gmail's OR group
	return ops.length > 1 ? [`{${ops.join(' ')}}`] : ops;
}

const gmailDate = (d: string) => d.replace(/-/g, '/');

/**
 * Build a Gmail search string from structured inputs. Operators follow
 * https://support.google.com/mail/answer/7190. A user-given `q` is ANDed in.
 */
export function buildGmailQuery(input: Partial<MessagesListInput>): string {
	const parts: string[] = [];
	const words = (input.keywords ?? []).filter((w) => w.trim());
	parts.push(...words.map(term));
	if (input.exactPhrase?.trim()) {
		parts.push(`"${input.exactPhrase.trim().replace(/"/g, '')}"`);
	}
	const any = (input.anyOf ?? []).filter((w) => w.trim());
	if (any.length) {
		parts.push(`{${any.map(term).join(' ')}}`);
	}
	parts.push(
		...(input.exclude ?? []).filter((w) => w.trim()).map((w) => `-${term(w)}`),
	);
	if (input.subject?.trim()) {
		const s = input.subject.trim().replace(/"/g, '');
		parts.push(
			/\s/.test(s)
				? `subject:(${s.split(/\s+/).map(term).join(' ')})`
				: `subject:${term(s)}`,
		);
	}
	parts.push(...operator('from', input.from));
	parts.push(...operator('to', input.to));
	parts.push(...operator('cc', input.cc));
	if (input.after) parts.push(`after:${gmailDate(input.after)}`);
	if (input.before) parts.push(`before:${gmailDate(input.before)}`);
	if (input.hasAttachment) parts.push('has:attachment');
	if (input.filename?.trim()) parts.push(`filename:${term(input.filename)}`);
	if (input.label?.trim()) {
		parts.push(`label:${input.label.trim().replace(/["\s]+/g, '-')}`);
	}
	if (input.in) parts.push(`in:${input.in}`);
	if (input.isUnread !== undefined) {
		parts.push(input.isUnread ? 'is:unread' : '-is:unread');
	}
	if (input.isStarred !== undefined) {
		parts.push(input.isStarred ? 'is:starred' : '-is:starred');
	}
	if (input.larger !== undefined) parts.push(`larger:${input.larger}`);
	if (input.smaller !== undefined) parts.push(`smaller:${input.smaller}`);

	const structured = parts.join(' ');
	const q = input.q?.trim();
	if (!q) return structured;
	if (!structured) return q;
	return `${/\s/.test(q) ? `(${q})` : q} ${structured}`;
}

const MessagesGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	format: z
		.enum(['minimal', 'full', 'raw', 'metadata'])
		.optional()
		.describe(
			'Defaults to full: parsed payload. metadata: headers only (pick them with metadataHeaders). minimal: ids and labels. raw: whole RFC 2822 message, base64url-encoded.',
		),
	metadataHeaders: z
		.array(z.string())
		.optional()
		.describe(
			'Header names to return, e.g. ["From","Subject"]; format must be metadata.',
		),
});

const MessagesSendInputSchema = z.object({
	userId: z.string().optional(),
	raw: z.string().describe(GMAIL_RAW_MESSAGE_ENCODE_DESCRIPTION),
	threadId: z.string().optional(),
});

const MessagesModifyInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	addLabelIds: z.array(z.string()).optional(),
	removeLabelIds: z.array(z.string()).optional(),
});

const MessagesBatchModifyInputSchema = z.object({
	userId: z.string().optional(),
	ids: z.array(z.string()).optional(),
	addLabelIds: z.array(z.string()).optional(),
	removeLabelIds: z.array(z.string()).optional(),
});

const MessagesTrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const MessagesUntrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const MessagesGetAttachmentInputSchema = z.object({
	userId: z.string().optional(),
	messageId: z.string(),
	partId: z
		.string()
		.optional()
		.describe(
			'partId of an attachment part, e.g. "1.2"; shown in messages.get with format full, or in a database search of messages fetched with format full. Give partId or attachmentId',
		),
	attachmentId: z
		.string()
		.optional()
		.describe(
			"Gmail attachmentId, if already known. Give partId or attachmentId; with partId, the part's own attachment is read.",
		),
});

const LabelsListInputSchema = z.object({
	userId: z.string().optional(),
});

const LabelsGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const LabelsCreateInputSchema = z.object({
	userId: z.string().optional(),
	label: z.object({
		name: z.string().optional(),
		messageListVisibility: z.enum(['show', 'hide']).optional(),
		labelListVisibility: z
			.enum(['labelShow', 'labelShowIfUnread', 'labelHide'])
			.optional(),
		color: z
			.object({
				textColor: z.string().optional(),
				backgroundColor: z.string().optional(),
			})
			.optional(),
	}),
});

const LabelsUpdateInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	label: z.object({
		name: z.string().optional(),
		messageListVisibility: z.enum(['show', 'hide']).optional(),
		labelListVisibility: z
			.enum(['labelShow', 'labelShowIfUnread', 'labelHide'])
			.optional(),
		color: z
			.object({
				textColor: z.string().optional(),
				backgroundColor: z.string().optional(),
			})
			.optional(),
	}),
});

const LabelsDeleteInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const DraftsListInputSchema = z.object({
	userId: z.string().optional(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
	q: z.string().optional(),
});

const DraftsGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	format: z.enum(['minimal', 'full', 'raw', 'metadata']).optional(),
});

const DraftsCreateInputSchema = z.object({
	userId: z.string().optional(),
	draft: z
		.object({
			message: GmailRawMessageFieldsSchema.optional(),
		})
		.optional()
		.describe(
			'Draft payload. message.raw must be a base64url-encoded RFC 2822 email, not plain text.',
		),
});

const DraftsUpdateInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	draft: z
		.object({
			message: GmailRawMessageFieldsSchema.optional(),
		})
		.optional()
		.describe(
			'Updated draft payload. message.raw must be a base64url-encoded RFC 2822 email, not plain text.',
		),
});

const DraftsDeleteInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const DraftsSendInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string().optional(),
	message: GmailRawMessageFieldsSchema.optional().describe(
		'Optional message body when sending without a draft id. raw must be base64url-encoded RFC 2822, not plain text.',
	),
});

const ThreadsListInputSchema = z.object({
	userId: z.string().optional(),
	q: z.string().optional().describe(GMAIL_QUERY_DESCRIPTION),
	maxResults: z
		.number()
		.optional()
		.describe('Defaults to 100, at most 500. Follow nextPageToken for more.'),
	pageToken: z.string().optional(),
	labelIds: z
		.array(z.string())
		.optional()
		.describe(GMAIL_LABEL_IDS_DESCRIPTION),
	includeSpamTrash: z
		.boolean()
		.optional()
		.describe(GMAIL_INCLUDE_SPAM_TRASH_DESCRIPTION),
});

const ThreadsGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	format: z
		.enum(['minimal', 'full', 'metadata'])
		.optional()
		.describe(
			'Defaults to full: parsed payload for every message. metadata: headers only. minimal: ids and labels.',
		),
	metadataHeaders: z
		.array(z.string())
		.optional()
		.describe(
			'Header names to return, e.g. ["From","Subject"]; format must be metadata.',
		),
});

const ThreadsModifyInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	addLabelIds: z.array(z.string()).optional(),
	removeLabelIds: z.array(z.string()).optional(),
});

const ThreadsTrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const ThreadsUntrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const UsersGetProfileInputSchema = z.object({
	userId: z.string().optional(),
});

export const GmailEndpointInputSchemas = {
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesModify: MessagesModifyInputSchema,
	messagesBatchModify: MessagesBatchModifyInputSchema,
	messagesTrash: MessagesTrashInputSchema,
	messagesUntrash: MessagesUntrashInputSchema,
	messagesGetAttachment: MessagesGetAttachmentInputSchema,
	labelsList: LabelsListInputSchema,
	labelsGet: LabelsGetInputSchema,
	labelsCreate: LabelsCreateInputSchema,
	labelsUpdate: LabelsUpdateInputSchema,
	labelsDelete: LabelsDeleteInputSchema,
	draftsList: DraftsListInputSchema,
	draftsGet: DraftsGetInputSchema,
	draftsCreate: DraftsCreateInputSchema,
	draftsUpdate: DraftsUpdateInputSchema,
	draftsDelete: DraftsDeleteInputSchema,
	draftsSend: DraftsSendInputSchema,
	threadsList: ThreadsListInputSchema,
	threadsGet: ThreadsGetInputSchema,
	threadsModify: ThreadsModifyInputSchema,
	threadsTrash: ThreadsTrashInputSchema,
	threadsUntrash: ThreadsUntrashInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
} as const;

export type GmailEndpointInputs = {
	[K in keyof typeof GmailEndpointInputSchemas]: z.infer<
		(typeof GmailEndpointInputSchemas)[K]
	>;
};

const MessagePartHeaderSchema = z.object({
	name: z.string().optional(),
	value: z.string().optional(),
});

const MessagePartBodySchema = z.object({
	attachmentId: z.string().optional(),
	size: z.number().optional(),
	data: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Recursive type
//
// MessagePart references itself via parts?: MessagePart[].
// BaseSchema holds all non-recursive fields; the final schema extends it with
// the circular field via z.lazy(). The exported type is derived from the schema.
// ─────────────────────────────────────────────────────────────────────────────

const MessagePartBaseSchema = z.object({
	partId: z.string().optional(),
	mimeType: z.string().optional(),
	filename: z.string().optional(),
	headers: z.array(MessagePartHeaderSchema).optional(),
	body: MessagePartBodySchema.optional(),
});

export type MessagePartShape = z.infer<typeof MessagePartBaseSchema> & {
	parts?: MessagePartShape[];
};

const MessagePartSchema: z.ZodType<MessagePartShape> =
	MessagePartBaseSchema.extend({
		parts: z.lazy(() => z.array(MessagePartSchema).optional()),
	});

const MessageSchema = z.object({
	id: z.string().optional(),
	threadId: z.string().optional(),
	labelIds: z.array(z.string()).optional(),
	snippet: z.string().optional(),
	historyId: z.string().optional(),
	internalDate: z
		.union([z.string(), z.number(), z.date()])
		.transform((val) => {
			if (val instanceof Date) return val;
			if (typeof val === 'number') return new Date(val);
			if (typeof val === 'string') {
				const num = Number(val);
				return isNaN(num) ? null : new Date(num);
			}
			return null;
		})
		.nullable()
		.optional(),
	sizeEstimate: z.number().optional(),
	payload: MessagePartSchema.optional(),
	raw: z
		.string()
		.optional()
		.describe(
			'Full RFC 2822 message in base64url encoding (when format=raw). Not plain text — decode base64url before reading headers/body.',
		),
});

const MessageListResponseSchema = z.object({
	messages: z.array(MessageSchema).optional(),
	nextPageToken: z.string().optional(),
	resultSizeEstimate: z.number().optional(),
});

const LabelColorSchema = z.object({
	textColor: z.string().optional(),
	backgroundColor: z.string().optional(),
});

const LabelSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	messageListVisibility: z.enum(['show', 'hide']).optional(),
	labelListVisibility: z
		.enum(['labelShow', 'labelShowIfUnread', 'labelHide'])
		.optional(),
	type: z.enum(['system', 'user']).optional(),
	messagesTotal: z.number().optional(),
	messagesUnread: z.number().optional(),
	threadsTotal: z.number().optional(),
	threadsUnread: z.number().optional(),
	color: LabelColorSchema.optional(),
});

const LabelListResponseSchema = z.object({
	labels: z.array(LabelSchema).optional(),
});

const DraftSchema = z.object({
	id: z.string().optional(),
	message: MessageSchema.optional(),
});

const DraftListResponseSchema = z.object({
	drafts: z.array(DraftSchema).optional(),
	nextPageToken: z.string().optional(),
	resultSizeEstimate: z.number().optional(),
});

const ThreadSchema = z.object({
	id: z.string().optional(),
	snippet: z.string().optional(),
	historyId: z.string().optional(),
	messages: z.array(MessageSchema).optional(),
});

const ThreadListResponseSchema = z.object({
	threads: z.array(ThreadSchema).optional(),
	nextPageToken: z.string().optional(),
	resultSizeEstimate: z.number().optional(),
});

const ProfileSchema = z.object({
	emailAddress: z.string().optional(),
	messagesTotal: z.number().optional(),
	threadsTotal: z.number().optional(),
	historyId: z.string().optional(),
});

export const GmailEndpointOutputSchemas = {
	messagesList: MessageListResponseSchema,
	messagesGet: MessageSchema,
	messagesSend: MessageSchema,
	messagesModify: MessageSchema,
	messagesBatchModify: z.void(),
	messagesTrash: MessageSchema,
	messagesUntrash: MessageSchema,
	messagesGetAttachment: FileOutputSchema,
	labelsList: LabelListResponseSchema,
	labelsGet: LabelSchema,
	labelsCreate: LabelSchema,
	labelsUpdate: LabelSchema,
	labelsDelete: z.void(),
	draftsList: DraftListResponseSchema,
	draftsGet: DraftSchema,
	draftsCreate: DraftSchema,
	draftsUpdate: DraftSchema,
	draftsDelete: z.void(),
	draftsSend: MessageSchema,
	threadsList: ThreadListResponseSchema,
	threadsGet: ThreadSchema,
	threadsModify: ThreadSchema,
	threadsTrash: ThreadSchema,
	threadsUntrash: ThreadSchema,
	usersGetProfile: ProfileSchema,
} as const;

export type GmailEndpointOutputs = {
	messagesList: MessageListResponse;
	messagesGet: Message;
	messagesSend: Message;
	messagesModify: Message;
	messagesBatchModify: void;
	messagesTrash: Message;
	messagesUntrash: Message;
	messagesGetAttachment: FileOutput;
	labelsList: LabelListResponse;
	labelsGet: Label;
	labelsCreate: Label;
	labelsUpdate: Label;
	labelsDelete: void;
	draftsList: DraftListResponse;
	draftsGet: Draft;
	draftsCreate: Draft;
	draftsUpdate: Draft;
	draftsDelete: void;
	draftsSend: Message;
	threadsList: ThreadListResponse;
	threadsGet: Thread;
	threadsModify: Thread;
	threadsTrash: Thread;
	threadsUntrash: Thread;
	usersGetProfile: Profile;
};
