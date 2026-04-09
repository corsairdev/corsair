import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import * as crypto from 'crypto';
import { z } from 'zod';

// ── Shared Trello action sub-schemas ─────────────────────────────────────────

export const TrelloMemberCreatorSchema = z.object({
	id: z.string(),
	activityBlocked: z.boolean().optional(),
	avatarHash: z.string().nullable().optional(),
	avatarUrl: z.string().nullable().optional(),
	fullName: z.string().optional(),
	idMemberReferrer: z.string().nullable().optional(),
	initials: z.string().optional(),
	nonPublicAvailable: z.boolean().optional(),
	username: z.string().optional(),
});
export type TrelloMemberCreator = z.infer<typeof TrelloMemberCreatorSchema>;

export const TrelloActionBoardSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		shortLink: z.string().optional(),
	})
	.passthrough();

export const TrelloActionListSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
	})
	.passthrough();

export const TrelloActionCardSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		idList: z.string().optional(),
		idBoard: z.string().optional(),
		idShort: z.number().optional(),
		shortLink: z.string().optional(),
		desc: z.string().optional(),
		due: z.string().nullable().optional(),
		dueComplete: z.boolean().optional(),
		closed: z.boolean().optional(),
		pos: z.number().optional(),
	})
	.passthrough();

export const TrelloActionMemberSchema = z
	.object({
		id: z.string(),
		username: z.string().optional(),
		fullName: z.string().optional(),
		avatarUrl: z.string().nullable().optional(),
		initials: z.string().optional(),
	})
	.passthrough();

// ── Webhook action data schemas ───────────────────────────────────────────────

export const CardCreatedDataSchema = z.object({
	board: TrelloActionBoardSchema.optional(),
	list: TrelloActionListSchema.optional(),
	card: TrelloActionCardSchema.optional(),
});
export type CardCreatedData = z.infer<typeof CardCreatedDataSchema>;

export const CardUpdatedDataSchema = z.object({
	board: TrelloActionBoardSchema.optional(),
	list: TrelloActionListSchema.optional(),
	card: TrelloActionCardSchema.optional(),
	listBefore: TrelloActionListSchema.optional(),
	listAfter: TrelloActionListSchema.optional(),
	// Sparse map of only the changed fields and their previous values; keys are dynamic per update
	old: z.record(z.unknown()).optional(),
});
export type CardUpdatedData = z.infer<typeof CardUpdatedDataSchema>;

export const MemberAddedToCardDataSchema = z.object({
	board: TrelloActionBoardSchema.optional(),
	card: TrelloActionCardSchema.optional(),
	idMember: z.string().optional(),
	member: TrelloActionMemberSchema.optional(),
});
export type MemberAddedToCardData = z.infer<typeof MemberAddedToCardDataSchema>;

export const ListCreatedDataSchema = z.object({
	board: TrelloActionBoardSchema.optional(),
	list: TrelloActionListSchema.optional(),
});
export type ListCreatedData = z.infer<typeof ListCreatedDataSchema>;

export const CommentCreatedDataSchema = z.object({
	board: TrelloActionBoardSchema.optional(),
	card: TrelloActionCardSchema.optional(),
	list: TrelloActionListSchema.optional(),
	text: z.string().optional(),
	// Unknown type because the textData is dynamic and depend on the comment.
	textData: z.unknown().nullable().optional(),
});
export type CommentCreatedData = z.infer<typeof CommentCreatedDataSchema>;

// ── Base action schema ────────────────────────────────────────────────────────

const TrelloBaseActionSchema = z.object({
	id: z.string(),
	idMemberCreator: z.string(),
	type: z.string(),
	date: z.string(),
	memberCreator: TrelloMemberCreatorSchema.optional(),
});

// ── Typed webhook payload schemas ─────────────────────────────────────────────

export const TrelloCardCreatedPayloadSchema = z.object({
	action: TrelloBaseActionSchema.extend({
		type: z.literal('createCard'),
		data: CardCreatedDataSchema,
	}),
	// The full board/resource snapshot Trello sends alongside every action; shape varies by event type
	model: z.record(z.unknown()),
});

export const TrelloCardUpdatedPayloadSchema = z.object({
	action: TrelloBaseActionSchema.extend({
		type: z.literal('updateCard'),
		data: CardUpdatedDataSchema,
	}),
	// The full board/resource snapshot Trello sends alongside every action; shape varies by event type
	model: z.record(z.unknown()),
});

export const TrelloMemberAddedToCardPayloadSchema = z.object({
	action: TrelloBaseActionSchema.extend({
		type: z.literal('addMemberToCard'),
		data: MemberAddedToCardDataSchema,
	}),
	// The full board/resource snapshot Trello sends alongside every action; shape varies by event type
	model: z.record(z.unknown()),
});

export const TrelloListCreatedPayloadSchema = z.object({
	action: TrelloBaseActionSchema.extend({
		type: z.literal('createList'),
		data: ListCreatedDataSchema,
	}),
	// The full board/resource snapshot Trello sends alongside every action; shape varies by event type
	model: z.record(z.unknown()),
});

export const ListUpdatedDataSchema = z.object({
	board: TrelloActionBoardSchema.optional(),
	list: TrelloActionListSchema.optional(),
	// Sparse map of only the changed fields and their previous values; keys are dynamic per update
	old: z.record(z.unknown()).optional(),
});
export type ListUpdatedData = z.infer<typeof ListUpdatedDataSchema>;

export const TrelloListUpdatedPayloadSchema = z.object({
	action: TrelloBaseActionSchema.extend({
		type: z.literal('updateList'),
		data: ListUpdatedDataSchema,
	}),
	// The full board/resource snapshot Trello sends alongside every action; shape varies by event type
	model: z.record(z.unknown()),
});

export const TrelloCommentCreatedPayloadSchema = z.object({
	action: TrelloBaseActionSchema.extend({
		type: z.literal('commentCard'),
		data: CommentCreatedDataSchema,
	}),
	// The full board/resource snapshot Trello sends alongside every action; shape varies by event type
	model: z.record(z.unknown()),
});

// ── Inferred event types ──────────────────────────────────────────────────────

export type TrelloCardCreatedEvent = z.infer<
	typeof TrelloCardCreatedPayloadSchema
>;
export type TrelloCardUpdatedEvent = z.infer<
	typeof TrelloCardUpdatedPayloadSchema
>;
export type TrelloMemberAddedToCardEvent = z.infer<
	typeof TrelloMemberAddedToCardPayloadSchema
>;
export type TrelloListCreatedEvent = z.infer<
	typeof TrelloListCreatedPayloadSchema
>;
export type TrelloListUpdatedEvent = z.infer<
	typeof TrelloListUpdatedPayloadSchema
>;
export type TrelloCommentCreatedEvent = z.infer<
	typeof TrelloCommentCreatedPayloadSchema
>;

// ── Webhook output map ────────────────────────────────────────────────────────

export type TrelloWebhookOutputs = {
	cardCreated: TrelloCardCreatedEvent;
	cardUpdated: TrelloCardUpdatedEvent;
	memberAddedToCard: TrelloMemberAddedToCardEvent;
	listCreated: TrelloListCreatedEvent;
	listUpdated: TrelloListUpdatedEvent;
	commentCreated: TrelloCommentCreatedEvent;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

// body is typed as unknown because request.body is unvalidated at this point;
// returns unknown to avoid widening to any via JSON.parse
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createTrelloActionMatch(
	actionType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// parsedBody is typed as unknown because the raw webhook body is unvalidated
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		// Type assertion needed because parseBody returns unknown
		const action = parsedBody?.action as Record<string, unknown> | undefined;
		return action?.type === actionType;
	};
}

export function verifyTrelloWebhookSignature(
	// WebhookRequest<unknown> because signature verification only needs raw bytes and headers,
	// not a typed payload — the payload type is resolved by callers after verification
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-trello-webhook'])
		? headers['x-trello-webhook'][0]
		: headers['x-trello-webhook'];

	if (!signature) {
		return { valid: false, error: 'Missing x-trello-webhook header' };
	}
	// payload is unknown; extract callbackURL from the webhook object Trello includes in every payload
	const payloadCallbackUrl = (
		(request.payload as Record<string, unknown>)?.webhook as Record<
			string,
			unknown
		>
	)?.callbackURL;

	try {
		const content = payloadCallbackUrl ? rawBody + payloadCallbackUrl : rawBody;
		const expected = crypto
			.createHmac('sha1', secret)
			.update(content)
			.digest('base64');

		const isValid =
			Buffer.byteLength(signature) === Buffer.byteLength(expected) &&
			crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

		if (!isValid) {
			return { valid: false, error: 'Invalid signature' };
		}

		return { valid: true };
	} catch {
		return { valid: false, error: 'Signature verification failed' };
	}
}
