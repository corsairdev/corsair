import { FileOutputSchema } from 'corsair/http';
import { z } from 'zod';

// Request and response shapes for the account, admin, billing, web push and
// server routes, from the ntfy server source (v2.38.3, server/types.go,
// user/types.go) and checked against a self-hosted server on 2026-11-28.
// Responses are loose: fields the server omits when empty are optional.

const TOPIC = z
	.string()
	.regex(/^[-_A-Za-z0-9]{1,64}$/)
	.describe('Topic name, [-_A-Za-z0-9]{1,64}');
const TOPIC_LIST = z
	.string()
	.regex(/^[-_A-Za-z0-9]{1,64}(,[-_A-Za-z0-9]{1,64})*$/)
	.describe('Topic name, or a comma-separated list of topics');

export const Empty = z.object({}).loose();

export const SuccessSchema = z.object({ success: z.boolean() }).loose();

// ── messages.sendFile / topics / files ──────────────────────────────────────

export const MessagesSendFileInputSchema = z.object({
	topic: TOPIC,
	contentBase64: z
		.string()
		.min(1)
		.describe('The file, base64-encoded. It becomes the message attachment.'),
	filename: z
		.string()
		.min(1)
		.describe('Attachment file name shown to subscribers'),
	contentType: z
		.string()
		.optional()
		.describe('Media type of the file; defaults to application/octet-stream'),
	message: z.string().optional().describe('Notification body'),
	title: z.string().optional().describe('Notification title'),
	priority: z
		.union([
			z.number().int().min(1).max(5),
			z.enum(['min', 'low', 'default', 'high', 'urgent']),
		])
		.optional(),
	tags: z.array(z.string()).optional(),
	click: z.string().optional(),
	icon: z.string().optional(),
	delay: z.string().optional(),
	sequenceId: z
		.string()
		.regex(/^[-_A-Za-z0-9]{1,64}$/)
		.optional(),
});

export const TopicsCheckAuthInputSchema = z.object({ topic: TOPIC_LIST });

export const FilesDownloadInputSchema = z.object({
	id: z
		.string()
		.regex(/^[-_A-Za-z0-9]{1,64}(\.[A-Za-z0-9]{1,16})?$/)
		.describe(
			'Attachment id from a message `attachment.url` (/file/<id>, an extension is allowed)',
		),
});

export const FileSchema = FileOutputSchema;

// ── server ───────────────────────────────────────────────────────────────────

export const ServerReadySchema = z
	.object({
		ready: z.boolean(),
		role: z.string().optional(),
		draining: z.boolean().optional(),
	})
	.loose();

export const ServerVersionSchema = z
	.object({
		version: z.string(),
		commit: z.string().optional(),
		date: z.string().optional(),
	})
	.loose();

export const ServerConfigSchema = z
	.object({
		base_url: z.string().optional(),
		app_root: z.string().optional(),
		enable_login: z.boolean().optional(),
		require_login: z.boolean().optional(),
		enable_signup: z.boolean().optional(),
		enable_payments: z.boolean().optional(),
		enable_calls: z.boolean().optional(),
		enable_emails: z.boolean().optional(),
		enable_reset_password: z.boolean().optional(),
		enable_reservations: z.boolean().optional(),
		enable_web_push: z.boolean().optional(),
		billing_contact: z.string().optional(),
		web_push_public_key: z.string().optional(),
		disallowed_topics: z.array(z.string()).nullish(),
		config_hash: z.string().optional(),
	})
	.loose();

export const MetricsSchema = z.object({
	text: z.string().describe('Prometheus text exposition format'),
});

const LimitsSchema = z
	.object({
		basis: z.string().optional(),
		messages: z.number().optional(),
		messages_expiry_duration: z.number().optional(),
		emails: z.number().optional(),
		calls: z.number().optional(),
		reservations: z.number().optional(),
		attachment_total_size: z.number().optional(),
		attachment_file_size: z.number().optional(),
		attachment_expiry_duration: z.number().optional(),
		attachment_bandwidth: z.number().optional(),
	})
	.loose();

export const BillingTiersSchema = z.object({
	tiers: z.array(
		z
			.object({
				code: z.string().optional(),
				name: z.string().optional(),
				prices: z
					.object({ month: z.number(), year: z.number() })
					.loose()
					.nullish(),
				limits: LimitsSchema.nullish(),
			})
			.loose(),
	),
});

// ── account ──────────────────────────────────────────────────────────────────

export const AccountCreateInputSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
	email: z
		.string()
		.optional()
		.describe(
			'Optional; with email configured on the server a verification link is sent',
		),
});

export const AccountDeleteInputSchema = z.object({
	password: z.string().min(1).describe('The current password, as confirmation'),
});

export const AccountChangePasswordInputSchema = z.object({
	password: z.string().min(1).describe('The current password'),
	newPassword: z.string().min(1),
});

export const AccountLoginSchema = z
	.object({ token: z.string(), username: z.string() })
	.loose();

const NotificationPrefsSchema = z
	.object({
		sound: z.string().optional(),
		min_priority: z.number().int().optional(),
		delete_after: z.number().int().optional(),
	})
	.loose();

export const AccountUpdateSettingsInputSchema = z.object({
	language: z.string().optional(),
	dateFormat: z.string().optional(),
	timeFormat: z.string().optional(),
	notification: NotificationPrefsSchema.optional().describe(
		'sound, min_priority (1-5) and delete_after (seconds)',
	),
});

export const AccountRequestPasswordResetInputSchema = z.object({
	identifier: z.string().min(1).describe('Username or email address'),
});

export const AccountResetPasswordInputSchema = z.object({
	token: z.string().min(1).describe('The token from the reset link'),
	password: z.string().min(1).describe('The new password'),
});

// ── tokens ───────────────────────────────────────────────────────────────────

const TokenSchema = z
	.object({
		token: z.string(),
		label: z.string().optional(),
		last_access: z.number().optional(),
		last_origin: z.string().optional(),
		expires: z.number().optional(),
		provisioned: z.boolean().optional(),
	})
	.loose();

export { TokenSchema };

export const TokensCreateInputSchema = z.object({
	label: z.string().optional(),
	expires: z
		.number()
		.int()
		.optional()
		.describe('Unix seconds the token expires; omit or 0 for never'),
});

export const TokensUpdateInputSchema = z.object({
	token: z.string().min(1).describe('The token to change (tk_...)'),
	label: z.string().optional(),
	expires: z.number().int().optional(),
});

export const TokensDeleteInputSchema = z.object({
	token: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The token to delete; omit to delete the token this call is made with',
		),
});

// ── subscriptions / reservations ─────────────────────────────────────────────

const SubscriptionSchema = z
	.object({
		base_url: z.string(),
		topic: z.string(),
		display_name: z.string().nullish(),
	})
	.loose();

export { SubscriptionSchema };

export const SubscriptionInputSchema = z.object({
	baseUrl: z
		.string()
		.min(1)
		.describe('Server the subscription belongs to, e.g. https://ntfy.sh'),
	topic: TOPIC,
	displayName: z.string().nullish(),
});

export const SubscriptionDeleteInputSchema = z.object({
	baseUrl: z.string().min(1),
	topic: TOPIC,
});

export const ReservationAddInputSchema = z.object({
	topic: TOPIC,
	everyone: z
		.enum(['read-write', 'read-only', 'write-only', 'deny-all'])
		.describe('What everyone else may do on the reserved topic'),
});

export const ReservationDeleteInputSchema = z.object({
	topic: TOPIC,
	deleteMessages: z
		.boolean()
		.optional()
		.describe("Also delete the topic's cached messages and attachments"),
});

// ── phone numbers / emails ───────────────────────────────────────────────────

const PHONE = z
	.string()
	.regex(/^\+\d{1,100}$/)
	.describe('E.164 phone number, e.g. +12223334444');

export const PhoneSendVerificationInputSchema = z.object({
	number: PHONE,
	channel: z.enum(['sms', 'call']).describe('How the code is delivered'),
});

export const PhoneAddInputSchema = z.object({
	number: PHONE,
	code: z.string().min(1).describe('The code the verification sent'),
});

export const PhoneDeleteInputSchema = z.object({ number: PHONE });

export const EmailInputSchema = z.object({
	email: z.string().regex(/^[^\s,;]+@[^\s,;]+$/),
});

export const EmailVerifyInputSchema = z.object({
	token: z.string().min(1).describe('The token from the verification link'),
});

// ── billing ──────────────────────────────────────────────────────────────────

export const BillingSubscriptionInputSchema = z.object({
	tier: z.string().min(1).describe('Tier code from billing.tiers'),
	interval: z.enum(['month', 'year']),
});

export const RedirectSchema = z.object({ redirect_url: z.string() }).loose();

// ── web push ─────────────────────────────────────────────────────────────────

export const WebPushInputSchema = z.object({
	endpoint: z.string().min(1).describe('The browser push service endpoint'),
	auth: z.string().min(1),
	p256dh: z.string().min(1),
	topics: z.array(TOPIC).describe('Topics this browser subscription follows'),
});

export const WebPushDeleteInputSchema = z.object({
	endpoint: z.string().min(1),
});

// ── admin: users ─────────────────────────────────────────────────────────────

const UserSchema = z
	.object({
		username: z.string(),
		role: z.string(),
		tier: z.string().optional(),
		tier_name: z.string().optional(),
		provisioned: z.boolean().optional(),
		default_access: z.string().optional(),
		grants: z
			.array(
				z
					.object({
						topic: z.string(),
						permission: z.string(),
						provisioned: z.boolean().optional(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const UsersListInputSchema = z.object({
	username: z.string().optional().describe('Read only this user'),
});

export const UsersListSchema = z.object({ users: z.array(UserSchema) });

export const UsersCreateInputSchema = z.object({
	username: z.string().min(1),
	password: z.string().optional(),
	hash: z.string().optional().describe('A bcrypt hash instead of a password'),
	tier: z.string().optional().describe('Tier code'),
});

export const UsersUpdateInputSchema = z.object({
	username: z.string().min(1),
	password: z.string().optional(),
	hash: z.string().optional(),
	tier: z.string().optional().describe('Tier code; "-" removes the tier'),
});

export const UsernameInputSchema = z.object({ username: z.string().min(1) });

export const UsersGrantAccessInputSchema = z.object({
	username: z.string().min(1).describe('A user, or "*" for everyone'),
	topic: z.string().min(1).describe('Topic or pattern (* wildcard)'),
	permission: z.enum([
		'read-write',
		'rw',
		'read-only',
		'read',
		'ro',
		'write-only',
		'write',
		'wo',
		'deny-all',
		'deny',
		'none',
	]),
});

export const UsersResetAccessInputSchema = z.object({
	username: z.string().min(1),
	topic: z
		.string()
		.optional()
		.describe("Only this topic's grant; omit for all of the user's grants"),
});

const UserTokenSchema = z
	.object({
		username: z.string(),
		token: z.string(),
		label: z.string().optional(),
		expires: z.number().optional(),
		last_access: z.number().optional(),
		last_origin: z.string().optional(),
		provisioned: z.boolean().optional(),
	})
	.loose();

export { UserTokenSchema };

export const UsersListTokensSchema = z.object({
	tokens: z.array(UserTokenSchema),
});

export const UsersCreateTokenInputSchema = z.object({
	username: z.string().min(1),
	label: z.string().optional(),
	expires: z
		.number()
		.int()
		.optional()
		.describe('Unix seconds; omit or 0 for never'),
});

export const UsersDeleteTokenInputSchema = z.object({
	username: z.string().min(1),
	token: z.string().min(1),
});

export const UsersResetPasswordInputSchema = z.object({
	username: z.string().min(1),
	sendEmail: z
		.boolean()
		.optional()
		.describe("Also email the link to the user's primary address"),
});

export const UsersResetPasswordSchema = z
	.object({ link: z.string(), email: z.string().optional() })
	.loose();

// ── admin: tiers ─────────────────────────────────────────────────────────────

const TierFields = {
	code: z.string().min(1).describe('Tier code, e.g. pro'),
	name: z.string().min(1),
	messages_limit: z.number().int().optional().describe('Messages per day'),
	messages_expiry_duration: z
		.number()
		.int()
		.optional()
		.describe('Seconds messages stay cached'),
	emails_limit: z.number().int().optional(),
	calls_limit: z.number().int().optional(),
	reservations_limit: z.number().int().optional(),
	attachment_file_size_limit: z.number().int().optional().describe('Bytes'),
	attachment_total_size_limit: z.number().int().optional().describe('Bytes'),
	attachment_expiry_duration: z.number().int().optional().describe('Seconds'),
	attachment_bandwidth_limit: z
		.number()
		.int()
		.optional()
		.describe('Bytes per day'),
	stripe_monthly_price_id: z.string().optional(),
	stripe_yearly_price_id: z.string().optional(),
};

export const TierInputSchema = z.object(TierFields);

export const TiersListSchema = z.object({
	tiers: z.array(
		z
			.object({
				...TierFields,
				id: z.string().optional(),
				users: z.number().optional(),
			})
			.loose(),
	),
});

export const TierDeleteInputSchema = z.object({ code: z.string().min(1) });
