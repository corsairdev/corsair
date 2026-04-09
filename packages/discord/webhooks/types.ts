import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import * as crypto from 'crypto';
import { z } from 'zod';
import { DiscordUserSchema, EmbedSchema } from '../endpoints/types';

// ── Discord Interaction Types ──────────────────────────────────────────────────

export const DiscordInteractionType = {
	PING: 1,
	APPLICATION_COMMAND: 2,
	MESSAGE_COMPONENT: 3,
	APPLICATION_COMMAND_AUTOCOMPLETE: 4,
	MODAL_SUBMIT: 5,
} as const;

export type DiscordInteractionTypeValue =
	(typeof DiscordInteractionType)[keyof typeof DiscordInteractionType];

// ─────────────────────────────────────────────────────────────────────────────
// Recursive type
//
// ApplicationCommandOption references itself via options?: ApplicationCommandOption[].
// BaseSchema holds all non-recursive fields; the final schema extends it with
// the circular field via z.lazy(). The exported type is derived from the schema.
// ─────────────────────────────────────────────────────────────────────────────

const ApplicationCommandOptionBaseSchema = z.object({
	name: z.string(),
	type: z.number(),
	value: z.union([z.string(), z.number(), z.boolean()]).optional(),
	focused: z.boolean().optional(),
});

type ApplicationCommandOptionShape = z.infer<
	typeof ApplicationCommandOptionBaseSchema
> & {
	options?: ApplicationCommandOptionShape[];
};

export const ApplicationCommandOptionSchema: z.ZodType<ApplicationCommandOptionShape> =
	ApplicationCommandOptionBaseSchema.extend({
		options: z.lazy(() => z.array(ApplicationCommandOptionSchema)).optional(),
	});

export type ApplicationCommandOption = z.infer<
	typeof ApplicationCommandOptionSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Non-recursive schemas
// ─────────────────────────────────────────────────────────────────────────────

export const DiscordGuildMemberPartialSchema = z.object({
	user: DiscordUserSchema.optional(),
	nick: z.string().nullable(),
	roles: z.array(z.string()),
	joined_at: z.string(),
	permissions: z.string(),
	deaf: z.boolean(),
	mute: z.boolean(),
});
export type DiscordGuildMemberPartial = z.infer<
	typeof DiscordGuildMemberPartialSchema
>;

export const ApplicationCommandDataSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.number(),
	options: z.array(ApplicationCommandOptionSchema).optional(),
	guild_id: z.string().optional(),
	target_id: z.string().optional(),
});
export type ApplicationCommandData = z.infer<
	typeof ApplicationCommandDataSchema
>;

export const MessageComponentDataSchema = z.object({
	custom_id: z.string(),
	component_type: z.number(),
	values: z.array(z.string()).optional(),
});
export type MessageComponentData = z.infer<typeof MessageComponentDataSchema>;

export const ModalSubmitDataSchema = z.object({
	custom_id: z.string(),
	components: z.array(
		z.object({
			type: z.number(),
			components: z.array(
				z.object({
					type: z.number(),
					custom_id: z.string(),
					value: z.string(),
				}),
			),
		}),
	),
});
export type ModalSubmitData = z.infer<typeof ModalSubmitDataSchema>;

export const DiscordMessagePartialSchema = z.object({
	id: z.string(),
	channel_id: z.string(),
	content: z.string(),
	author: DiscordUserSchema,
	timestamp: z.string(),
	edited_timestamp: z.string().nullable(),
	tts: z.boolean(),
	mention_everyone: z.boolean(),
	mentions: z.array(DiscordUserSchema),
	attachments: z.array(z.unknown()),
	embeds: z.array(EmbedSchema),
	pinned: z.boolean(),
	type: z.number(),
});
export type DiscordMessagePartial = z.infer<typeof DiscordMessagePartialSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Interaction schemas
// ─────────────────────────────────────────────────────────────────────────────

const DiscordInteractionBaseSchema = z.object({
	id: z.string(),
	application_id: z.string(),
	token: z.string(),
	version: z.literal(1),
	guild_id: z.string().optional(),
	channel_id: z.string().optional(),
	member: DiscordGuildMemberPartialSchema.optional(),
	user: DiscordUserSchema.optional(),
	locale: z.string().optional(),
	guild_locale: z.string().optional(),
	app_permissions: z.string().optional(),
});

export const DiscordPingInteractionSchema = DiscordInteractionBaseSchema.extend(
	{
		type: z.literal(1),
	},
);
export type DiscordPingInteraction = z.infer<
	typeof DiscordPingInteractionSchema
>;

export const DiscordApplicationCommandInteractionSchema =
	DiscordInteractionBaseSchema.extend({
		type: z.literal(2),
		data: ApplicationCommandDataSchema,
	});
export type DiscordApplicationCommandInteraction = z.infer<
	typeof DiscordApplicationCommandInteractionSchema
>;

export const DiscordMessageComponentInteractionSchema =
	DiscordInteractionBaseSchema.extend({
		type: z.literal(3),
		data: MessageComponentDataSchema,
		message: DiscordMessagePartialSchema,
	});
export type DiscordMessageComponentInteraction = z.infer<
	typeof DiscordMessageComponentInteractionSchema
>;

export const DiscordModalSubmitInteractionSchema =
	DiscordInteractionBaseSchema.extend({
		type: z.literal(5),
		data: ModalSubmitDataSchema,
	});
export type DiscordModalSubmitInteraction = z.infer<
	typeof DiscordModalSubmitInteractionSchema
>;

export const DiscordInteractionSchema = z.union([
	DiscordPingInteractionSchema,
	DiscordApplicationCommandInteractionSchema,
	DiscordMessageComponentInteractionSchema,
	DiscordModalSubmitInteractionSchema,
]);
export type DiscordInteraction = z.infer<typeof DiscordInteractionSchema>;

// ── Webhook Output Types ───────────────────────────────────────────────────────

export type DiscordWebhookOutputs = {
	ping: { type: 1 };
	applicationCommand: DiscordApplicationCommandInteraction;
	messageComponent: DiscordMessageComponentInteraction;
	modalSubmit: DiscordModalSubmitInteraction;
};

// ── Signature Verification ─────────────────────────────────────────────────────

/**
 * Verifies a Discord interaction webhook using Ed25519.
 * Discord uses Ed25519 asymmetric signatures, not HMAC.
 * The public key comes from the Discord Developer Portal (Application > General Information).
 */
export function verifyDiscordWebhookSignature(
	request: WebhookRequest<unknown>,
	publicKey: string,
): { valid: boolean; error?: string } {
	if (!publicKey) {
		return { valid: false, error: 'Missing Discord application public key' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-signature-ed25519'])
		? headers['x-signature-ed25519'][0]
		: headers['x-signature-ed25519'];
	const timestamp = Array.isArray(headers['x-signature-timestamp'])
		? headers['x-signature-timestamp'][0]
		: headers['x-signature-timestamp'];

	if (!signature || !timestamp) {
		return {
			valid: false,
			error: 'Missing x-signature-ed25519 or x-signature-timestamp header',
		};
	}

	try {
		// Discord's message to sign: timestamp + rawBody (concatenated, not hashed)
		const message = Buffer.concat([
			Buffer.from(timestamp, 'utf8'),
			Buffer.from(rawBody, 'utf8'),
		]);

		// Wrap the raw 32-byte public key in a DER SubjectPublicKeyInfo envelope
		// OID 1.3.101.112 (id-EdDSA Ed25519) = 06 03 2b 65 70; BIT STRING wrapper
		const publicKeyDer = Buffer.concat([
			Buffer.from('302a300506032b6570032100', 'hex'),
			Buffer.from(publicKey, 'hex'),
		]);

		const keyObject = crypto.createPublicKey({
			key: publicKeyDer,
			format: 'der',
			type: 'spki',
		});

		const signatureBuffer = Buffer.from(signature, 'hex');
		const isValid = crypto.verify(null, message, keyObject, signatureBuffer);

		return {
			valid: isValid,
			error: isValid ? undefined : 'Invalid Ed25519 signature',
		};
	} catch (error) {
		return {
			valid: false,
			error: `Signature verification failed: ${error instanceof Error ? error.message : 'unknown error'}`,
		};
	}
}

// ── Webhook Matcher Factory ────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	return (body as Record<string, unknown>) ?? {};
}

/**
 * Creates a matcher function for a specific Discord interaction type.
 * Checks both required Discord signature headers and the interaction type field.
 */
export function createDiscordInteractionMatch(
	interactionType: DiscordInteractionTypeValue,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headers = request.headers as Record<
			string,
			string | string[] | undefined
		>;
		const hasSignature = Boolean(headers['x-signature-ed25519']);
		const hasTimestamp = Boolean(headers['x-signature-timestamp']);

		if (!hasSignature || !hasTimestamp) {
			return false;
		}

		const parsedBody = parseBody(request.body);
		return (parsedBody.type as number) === interactionType;
	};
}
