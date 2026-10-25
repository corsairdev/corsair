import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { Resend } from 'resend';
import { db } from '@/db';
import * as authSchema from '@/db/auth-schema';
import { buildMagicLinkEmailFromUrl } from '@/lib/auth-emails';
import {
	connectProviderCredentials,
	syncLinkedAccount,
} from '@/server/oss-connect/linked-account';

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

// GitHub and Discord are only connected from the OSS profile, to an account that
// signed in with a magic link. They never create an account, and ask for the
// smallest scope that returns the user id and name.
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
						disableSignUp: true,
						disableDefaultScope: true,
						scope: ['read:user'],
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
					},
				}
			: {}),
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['github', 'discord'],
			// The magic-link email rarely matches the GitHub or Discord email.
			allowDifferentEmails: true,
			// A magic-link account has no other linked account to fall back on.
			allowUnlinkingAll: true,
		},
	},
	databaseHooks: {
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
