/**
 * Why auth.ts refuses a new account. better-auth turns a sign-up error's message
 * into the `?error=` code on the sign-in page, spaces to underscores, so this
 * arrives as `unverified_email`.
 */
export const UNVERIFIED_EMAIL_MESSAGE = 'unverified email';
