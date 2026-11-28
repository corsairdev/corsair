import { toFileOutput } from 'corsair/http';
import { z } from 'zod';
import { ntfyHeaderValue } from '../client';
import * as T from './api-types';
import { op } from './call';
import { NtfyEndpointOutputSchemas as Outputs } from './types';

// The routes past publish/poll/clear/delete: topics, attachments, server
// info, the signed-in account, admin user and tier management, billing and
// web push. Paths and bodies follow the ntfy server source (v2.38.3).

function priorityHeader(
	priority: number | 'min' | 'low' | 'default' | 'high' | 'urgent' | undefined,
): string | undefined {
	return priority === undefined ? undefined : String(priority);
}

// ── messages.sendFile ────────────────────────────────────────────────────────

/** PUT /{topic} with the file as the body; publish options travel as headers. */
export const sendFile = op({
	event: 'messages.sendFile',
	input: T.MessagesSendFileInputSchema,
	output: Outputs.messagesSend,
	request: (input) => {
		const type = input.contentType ?? 'application/octet-stream';
		return {
			method: 'PUT',
			path: `/${input.topic}`,
			body: new Blob([Buffer.from(input.contentBase64, 'base64')], { type }),
			// Always octet-stream on the wire: core would JSON-encode a Blob
			// sent as application/json. ntfy names the attachment type from the
			// bytes and the file name, not from this header.
			rawMediaType: 'application/octet-stream',
			headers: {
				'X-Filename': ntfyHeaderValue(input.filename),
				'X-Title': ntfyHeaderValue(input.title),
				'X-Message': ntfyHeaderValue(input.message),
				'X-Priority': priorityHeader(input.priority),
				'X-Tags': ntfyHeaderValue(input.tags?.join(',')),
				'X-Click': input.click,
				'X-Icon': input.icon,
				'X-Delay': input.delay,
				'X-Sequence-ID': input.sequenceId,
			},
		};
	},
	// No topic: on ntfy.sh an unreserved topic name works as a password.
	log: (_, result) => ({
		messageId: result.id,
		bytes: result.attachment?.size ?? undefined,
	}),
});

// ── topics / files ───────────────────────────────────────────────────────────

export const checkAuth = op({
	event: 'topics.checkAuth',
	input: T.TopicsCheckAuthInputSchema,
	output: T.SuccessSchema,
	request: ({ topic }) => ({ method: 'GET', path: `/${topic}/auth` }),
});

export const download = op({
	event: 'files.download',
	input: T.FilesDownloadInputSchema,
	output: T.FileSchema,
	request: ({ id }) => ({
		method: 'GET',
		path: `/file/${id}`,
		responseType: 'binary',
	}),
	shape: (raw, { id }) => {
		const binary = raw as { bytes?: Uint8Array; contentType?: string };
		if (!binary?.bytes) throw new Error('ntfy answered without a file body');
		return toFileOutput(binary.bytes, binary.contentType, { filename: id });
	},
	log: ({ id }, result) => ({ id, bytes: result.byteLength }),
});

// ── server ───────────────────────────────────────────────────────────────────

export const ready = op({
	event: 'server.ready',
	input: T.Empty,
	output: T.ServerReadySchema,
	request: () => ({ method: 'GET', path: '/v1/ready' }),
});

export const version = op({
	event: 'server.version',
	input: T.Empty,
	output: T.ServerVersionSchema,
	request: () => ({ method: 'GET', path: '/v1/version' }),
});

export const config = op({
	event: 'server.config',
	input: T.Empty,
	output: T.ServerConfigSchema,
	request: () => ({ method: 'GET', path: '/v1/config' }),
});

export const metrics = op({
	event: 'server.metrics',
	input: T.Empty,
	output: T.MetricsSchema,
	request: () => ({ method: 'GET', path: '/metrics' }),
	shape: (raw) => {
		if (typeof raw !== 'string' || raw.length === 0) {
			throw new Error('ntfy /metrics answered without Prometheus text');
		}
		return { text: raw };
	},
});

// ── account ──────────────────────────────────────────────────────────────────

export const accountCreate = op({
	event: 'account.create',
	input: T.AccountCreateInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'POST', path: '/v1/account', body }),
});

export const accountDelete = op({
	event: 'account.delete',
	input: T.AccountDeleteInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/account', body }),
});

export const accountChangePassword = op({
	event: 'account.changePassword',
	input: T.AccountChangePasswordInputSchema,
	output: T.SuccessSchema,
	request: ({ password, newPassword }) => ({
		method: 'POST',
		path: '/v1/account/password',
		body: { password, new_password: newPassword },
	}),
});

export const accountLogin = op({
	event: 'account.login',
	input: T.Empty,
	output: T.AccountLoginSchema,
	request: () => ({ method: 'POST', path: '/v1/account/login' }),
});

export const accountUpdateSettings = op({
	event: 'account.updateSettings',
	input: T.AccountUpdateSettingsInputSchema,
	output: T.SuccessSchema,
	request: ({ language, dateFormat, timeFormat, notification }) => ({
		method: 'PATCH',
		path: '/v1/account/settings',
		body: {
			language,
			date_format: dateFormat,
			time_format: timeFormat,
			notification,
		},
	}),
});

export const accountRequestPasswordReset = op({
	event: 'account.requestPasswordReset',
	input: T.AccountRequestPasswordResetInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'POST',
		path: '/v1/account/password/reset/request',
		body,
	}),
});

export const accountResetPassword = op({
	event: 'account.resetPassword',
	input: T.AccountResetPasswordInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'POST',
		path: '/v1/account/password/reset',
		body,
	}),
});

// ── tokens ───────────────────────────────────────────────────────────────────

export const tokensCreate = op({
	event: 'tokens.create',
	input: T.TokensCreateInputSchema,
	output: T.TokenSchema,
	request: (body) => ({ method: 'POST', path: '/v1/account/token', body }),
	// The token itself never goes to the log.
	log: (_, result) => ({ label: result.label }),
});

export const tokensUpdate = op({
	event: 'tokens.update',
	input: T.TokensUpdateInputSchema,
	output: T.TokenSchema,
	request: (body) => ({ method: 'PATCH', path: '/v1/account/token', body }),
	log: (_, result) => ({ label: result.label }),
});

// DELETE carries no body: the token goes in X-Token (none = the caller's).
export const tokensDelete = op({
	event: 'tokens.delete',
	input: T.TokensDeleteInputSchema,
	output: T.SuccessSchema,
	request: ({ token }) => ({
		method: 'DELETE',
		path: '/v1/account/token',
		headers: { 'X-Token': token },
	}),
});

// ── subscriptions / reservations ─────────────────────────────────────────────

function subscriptionBody(input: {
	baseUrl: string;
	topic: string;
	displayName?: string | null;
}) {
	return {
		base_url: input.baseUrl,
		topic: input.topic,
		display_name: input.displayName ?? null,
	};
}

export const subscriptionsAdd = op({
	event: 'subscriptions.add',
	input: T.SubscriptionInputSchema,
	output: T.SubscriptionSchema,
	request: (input) => ({
		method: 'POST',
		path: '/v1/account/subscription',
		body: subscriptionBody(input),
	}),
});

export const subscriptionsUpdate = op({
	event: 'subscriptions.update',
	input: T.SubscriptionInputSchema,
	output: T.SubscriptionSchema,
	request: (input) => ({
		method: 'PATCH',
		path: '/v1/account/subscription',
		body: subscriptionBody(input),
	}),
});

export const subscriptionsDelete = op({
	event: 'subscriptions.delete',
	input: T.SubscriptionDeleteInputSchema,
	output: T.SuccessSchema,
	request: ({ baseUrl, topic }) => ({
		method: 'DELETE',
		path: '/v1/account/subscription',
		headers: { 'X-BaseURL': baseUrl, 'X-Topic': topic },
	}),
});

export const reservationsAdd = op({
	event: 'reservations.add',
	input: T.ReservationAddInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'POST',
		path: '/v1/account/reservation',
		body,
	}),
	log: ({ everyone }) => ({ everyone }),
});

export const reservationsDelete = op({
	event: 'reservations.delete',
	input: T.ReservationDeleteInputSchema,
	output: T.SuccessSchema,
	request: ({ topic, deleteMessages }) => ({
		method: 'DELETE',
		path: `/v1/account/reservation/${topic}`,
		headers: {
			'X-Delete-Messages': deleteMessages ? 'true' : undefined,
		},
	}),
});

// ── phone numbers / emails ───────────────────────────────────────────────────

export const phoneSendVerification = op({
	event: 'phoneNumbers.sendVerification',
	input: T.PhoneSendVerificationInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'PUT',
		path: '/v1/account/phone/verify',
		body,
	}),
	log: ({ channel }) => ({ channel }),
});

export const phoneAdd = op({
	event: 'phoneNumbers.add',
	input: T.PhoneAddInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'PUT', path: '/v1/account/phone', body }),
});

export const phoneDelete = op({
	event: 'phoneNumbers.delete',
	input: T.PhoneDeleteInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/account/phone', body }),
});

export const emailsAdd = op({
	event: 'emails.add',
	input: T.EmailInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'PUT', path: '/v1/account/email', body }),
});

export const emailsVerify = op({
	event: 'emails.verify',
	input: T.EmailVerifyInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'POST',
		path: '/v1/account/email/verify',
		body,
	}),
});

export const emailsDelete = op({
	event: 'emails.delete',
	input: T.EmailInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/account/email', body }),
});

export const emailsSetPrimary = op({
	event: 'emails.setPrimary',
	input: T.EmailInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'POST',
		path: '/v1/account/email/primary',
		body,
	}),
});

export const emailsResendVerification = op({
	event: 'emails.resendVerification',
	input: T.EmailInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'POST',
		path: '/v1/account/email/resend',
		body,
	}),
});

// ── billing ──────────────────────────────────────────────────────────────────

export const billingTiers = op({
	event: 'billing.tiers',
	input: T.Empty,
	output: T.BillingTiersSchema,
	request: () => ({ method: 'GET', path: '/v1/account/billing/tiers' }),
	shape: (raw) => ({ tiers: z.array(z.unknown()).parse(raw) }),
});

export const billingCreateSubscription = op({
	event: 'billing.createSubscription',
	input: T.BillingSubscriptionInputSchema,
	output: T.RedirectSchema,
	request: (body) => ({
		method: 'POST',
		path: '/v1/account/billing/subscription',
		body,
	}),
	log: ({ tier, interval }) => ({ tier, interval }),
});

export const billingUpdateSubscription = op({
	event: 'billing.updateSubscription',
	input: T.BillingSubscriptionInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({
		method: 'PUT',
		path: '/v1/account/billing/subscription',
		body,
	}),
	log: ({ tier, interval }) => ({ tier, interval }),
});

export const billingCancelSubscription = op({
	event: 'billing.cancelSubscription',
	input: T.Empty,
	output: T.SuccessSchema,
	request: () => ({
		method: 'DELETE',
		path: '/v1/account/billing/subscription',
	}),
});

export const billingCreatePortalSession = op({
	event: 'billing.createPortalSession',
	input: T.Empty,
	output: T.RedirectSchema,
	request: () => ({ method: 'POST', path: '/v1/account/billing/portal' }),
});

// ── web push ─────────────────────────────────────────────────────────────────

export const webPushSubscribe = op({
	event: 'webPush.subscribe',
	input: T.WebPushInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'POST', path: '/v1/webpush', body }),
	log: ({ topics }) => ({ topics: topics.length }),
});

export const webPushUnsubscribe = op({
	event: 'webPush.unsubscribe',
	input: T.WebPushDeleteInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/webpush', body }),
});

// ── admin: users ─────────────────────────────────────────────────────────────

export const usersList = op({
	event: 'users.list',
	input: T.UsersListInputSchema,
	output: T.UsersListSchema,
	request: ({ username }) => ({
		method: 'GET',
		path: '/v1/users',
		query: { username },
	}),
	shape: (raw) => ({ users: z.array(z.unknown()).parse(raw) }),
	log: (_, result) => ({ count: result.users.length }),
});

export const usersCreate = op({
	event: 'users.create',
	input: T.UsersCreateInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'POST', path: '/v1/users', body }),
});

export const usersUpdate = op({
	event: 'users.update',
	input: T.UsersUpdateInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'PUT', path: '/v1/users', body }),
});

export const usersDelete = op({
	event: 'users.delete',
	input: T.UsernameInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/users', body }),
});

export const usersGrantAccess = op({
	event: 'users.grantAccess',
	input: T.UsersGrantAccessInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'PUT', path: '/v1/users/access', body }),
	log: ({ permission }) => ({ permission }),
});

export const usersResetAccess = op({
	event: 'users.resetAccess',
	input: T.UsersResetAccessInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/users/access', body }),
});

export const usersListTokens = op({
	event: 'users.listTokens',
	input: T.UsernameInputSchema,
	output: T.UsersListTokensSchema,
	request: ({ username }) => ({
		method: 'GET',
		path: '/v1/users/tokens',
		query: { username },
	}),
	shape: (raw) => ({ tokens: z.array(z.unknown()).parse(raw) }),
	log: (_, result) => ({ count: result.tokens.length }),
});

export const usersCreateToken = op({
	event: 'users.createToken',
	input: T.UsersCreateTokenInputSchema,
	output: T.UserTokenSchema,
	request: (body) => ({ method: 'POST', path: '/v1/users/tokens', body }),
});

export const usersDeleteToken = op({
	event: 'users.deleteToken',
	input: T.UsersDeleteTokenInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/users/tokens', body }),
});

export const usersResetPassword = op({
	event: 'users.resetPassword',
	input: T.UsersResetPasswordInputSchema,
	output: T.UsersResetPasswordSchema,
	request: ({ username, sendEmail }) => ({
		method: 'POST',
		path: '/v1/users/password/reset',
		body: { username, send_email: sendEmail ?? false },
	}),
	// The link holds a reset token, so nothing from the answer is logged.
});

// ── admin: tiers ─────────────────────────────────────────────────────────────

export const tiersList = op({
	event: 'tiers.list',
	input: T.Empty,
	output: T.TiersListSchema,
	request: () => ({ method: 'GET', path: '/v1/tiers' }),
	shape: (raw) => ({ tiers: z.array(z.unknown()).parse(raw) }),
	log: (_, result) => ({ count: result.tiers.length }),
});

export const tiersCreate = op({
	event: 'tiers.create',
	input: T.TierInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'POST', path: '/v1/tiers', body }),
	log: ({ code }) => ({ code }),
});

export const tiersUpdate = op({
	event: 'tiers.update',
	input: T.TierInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'PUT', path: '/v1/tiers', body }),
	log: ({ code }) => ({ code }),
});

export const tiersDelete = op({
	event: 'tiers.delete',
	input: T.TierDeleteInputSchema,
	output: T.SuccessSchema,
	request: (body) => ({ method: 'DELETE', path: '/v1/tiers', body }),
	log: ({ code }) => ({ code }),
});
