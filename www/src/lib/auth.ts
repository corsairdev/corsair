import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { Resend } from 'resend';
import { db } from '@/db';
import * as authSchema from '@/db/auth-schema';
import { buildMagicLinkEmailFromUrl } from '@/lib/auth-emails';

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
	secret: process.env.BETTER_AUTH_SECRET,
	...(baseURL ? { baseURL } : {}),
	trustedOrigins: [
		...(baseOrigin ? [baseOrigin] : []),
		'http://localhost:3000',
		'http://127.0.0.1:3000',
	],
});

export type Auth = typeof auth;
