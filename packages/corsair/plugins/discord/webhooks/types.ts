import * as crypto from 'crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';
import type { DiscordUser, Embed } from '../endpoints/types';

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

export type DiscordGuildMemberPartial = {
	user?: DiscordUser;
	nick: string | null;
	roles: string[];
	joined_at: string;
	permissions: string;
	deaf: boolean;
	mute: boolean;
};

export type ApplicationCommandOption = {
	name: string;
	type: number;
	value?: string | number | boolean;
	options?: ApplicationCommandOption[];
	focused?: boolean;
};

export type ApplicationCommandData = {
	id: string;
	name: string;
	type: number;
	options?: ApplicationCommandOption[];
	guild_id?: string;
	target_id?: string;
};

export type MessageComponentData = {
	custom_id: string;
	component_type: number;
	values?: string[];
};

export type ModalSubmitData = {
	custom_id: string;
	components: {
		type: number;
		components: {
			type: number;
			custom_id: string;
			value: string;
		}[];
	}[];
};

export type DiscordMessagePartial = {
	id: string;
	channel_id: string;
	content: string;
	author: DiscordUser;
	timestamp: string;
	edited_timestamp: string | null;
	tts: boolean;
	mention_everyone: boolean;
	mentions: DiscordUser[];
	attachments: unknown[];
	embeds: Embed[];
	pinned: boolean;
	type: number;
};

// Base interaction shape shared by all types
type DiscordInteractionBase = {
	id: string;
	application_id: string;
	token: string;
	version: 1;
	guild_id?: string;
	channel_id?: string;
	member?: DiscordGuildMemberPartial;
	user?: DiscordUser;
	locale?: string;
	guild_locale?: string;
	app_permissions?: string;
};

export type DiscordPingInteraction = DiscordInteractionBase & {
	type: 1;
};

export type DiscordApplicationCommandInteraction = DiscordInteractionBase & {
	type: 2;
	data: ApplicationCommandData;
};

export type DiscordMessageComponentInteraction = DiscordInteractionBase & {
	type: 3;
	data: MessageComponentData;
	message: DiscordMessagePartial;
};

export type DiscordModalSubmitInteraction = DiscordInteractionBase & {
	type: 5;
	data: ModalSubmitData;
};

export type DiscordInteraction =
	| DiscordPingInteraction
	| DiscordApplicationCommandInteraction
	| DiscordMessageComponentInteraction
	| DiscordModalSubmitInteraction;

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
