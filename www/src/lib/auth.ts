import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { magicLink } from 'better-auth/plugins';
import { Resend } from 'resend';
import { db } from '@/db';
import * as authSchema from '@/db/auth-schema';
import { buildMagicLinkEmailFromUrl } from '@/lib/auth-emails';
import {
	connectProviderCredentials,
	syncLinkedAccount,
} from '@/server/oss-connect/linked-account';
import { UNVERIFIED_EMAIL_MESSAGE } from '@/server/oss-connect/sign-up';

const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@corsair.dev';

function getBaseUrl() {
	const url =
		process.env.BETTER_AUTH_URL ??
		process.env.NEXT_PUBLIC_APP_URL ??
		(process.env.NODE_ENV !== 'production'
			? 'http://localhost:3000'
			: undefined);

	if (!url) return undefined;
	return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

const baseURL = getBaseUrl();
const baseOrigin = baseURL ? new URL(baseURL).origin : undefined;

// GitHub signs people in, and connects to an account that signed in with a magic
// link. Discord only connects; it never signs anyone in or creates an account.
const github = connectProviderCredentials('github');
const discord = connectProviderCredentials('discord');

async function syncAfterLink(linked: {
	userId: string;
	providerId: string;
	accountId: string;
	accessToken?: string | null;
}) {
	try {
		await syncLinkedAccount(db, linked);
	} catch (error) {
		// The account is linked either way; only the copied username is missing.
		console.error('[oss-connect] profile sync failed', error);
	}
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: authSchema,
	}),
	plugins: [
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				if (!resend) {
					console.warn('[auth] RESEND_API_KEY not set — magic link URL:', url);
					return;
				}

				const { subject, html } = buildMagicLinkEmailFromUrl(url);

				await resend.emails.send({
					from: fromEmail,
					to: email,
					subject,
					html,
				});
			},
		}),
	],
	socialProviders: {
		...(github
			? {
					github: {
						...github,
						disableDefaultScope: true,
						// user:email lets a sign-in read an email the user keeps private,
						// and tells better-auth whether GitHub has verified it.
						scope: ['read:user', 'user:email'],
					},
				}
			: {}),
		...(discord
			? {
					discord: {
						...discord,
						disableSignUp: true,
						disableDefaultScope: true,
						scope: ['identify'],
						// better-auth defaults to prompt=none, which can skip Discord's
						// approval screen; always show contributors what they connect.
						prompt: 'consent',
					},
				}
			: {}),
	},
	account: {
		accountLinking: {
			enabled: true,
			// A trusted provider links without a verified email. Discord's identify
			// scope returns no email, so its Connect button needs this, and it can't
			// sign in to match an account by email. Don't add its email scope while
			// it's listed. GitHub isn't listed: a GitHub sign-in joins an existing
			// account only when GitHub has verified that account's email, and
			// connecting GitHub needs a verified GitHub email too.
			trustedProviders: ['discord'],
			// The magic-link email rarely matches the GitHub or Discord email.
			allowDifferentEmails: true,
			// A magic-link account has no other linked account to fall back on, and
			// a GitHub sign-up can hand its GitHub to an older email account.
			allowUnlinkingAll: true,
		},
	},
	databaseHooks: {
		user: {
			create: {
				// Every account needs an email its owner has proved. A magic link proves
				// it; a GitHub sign-in only when GitHub has verified the address.
				// Otherwise someone could put another person's address on a GitHub
				// account, sign in first, and own the account that person's magic link
				// later opens.
				before: async (newUser) => {
					if (!newUser.emailVerified) {
						throw new APIError('FORBIDDEN', {
							message: UNVERIFIED_EMAIL_MESSAGE,
						});
					}
				},
			},
		},
		account: {
			create: { after: syncAfterLink },
			update: { after: syncAfterLink },
		},
	},
	secret: process.env.BETTER_AUTH_SECRET,
	...(baseURL ? { baseURL } : {}),
	trustedOrigins: [
		...(baseOrigin ? [baseOrigin] : []),
		'http://localhost:3000',
		'http://127.0.0.1:3000',
	],
});

export type Auth = typeof auth;
