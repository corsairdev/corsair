import type { ConnectProvider } from '@/server/oss-connect/linked-account';

// better-auth sends an OAuth failure back as ?error=<code>. access_denied comes
// from GitHub or Discord when the person cancels on their approval screen.

const SIGN_IN_ERRORS: Record<string, string> = {
	access_denied: 'GitHub sign-in was cancelled.',
	account_not_linked:
		'There is already a corsair.dev account with this email. Sign in with an email link, then connect GitHub on the OSS page.',
	unverified_email:
		'Your GitHub email is not verified. Verify it on GitHub, or sign in with an email link.',
	email_not_found:
		"GitHub didn't share an email address. Sign in with an email link instead.",
};

export function signInErrorMessage(code: string | undefined): string | null {
	if (!code) return null;
	return (
		SIGN_IN_ERRORS[code] ??
		"Couldn't sign in with GitHub. Try again, or use an email link."
	);
}

const LABEL: Record<ConnectProvider, string> = {
	github: 'GitHub',
	discord: 'Discord',
};

export function connectErrorMessage(
	code: string | null,
	provider: ConnectProvider | null,
): string {
	const label = provider ? LABEL[provider] : 'that account';
	switch (code) {
		case 'access_denied':
			return `Connecting ${label} was cancelled.`;
		case 'account_already_linked_to_different_user':
			return provider === 'github'
				? 'That GitHub account already signs in to another corsair.dev account. Ask in #support to move it here.'
				: `That ${label} account is already connected to another corsair.dev account.`;
		case 'unable_to_link_account':
			// Only GitHub is checked for a verified email (see accountLinking in auth.ts).
			if (provider === 'github') {
				return "Couldn't connect GitHub. Check that your GitHub email is verified, then try again.";
			}
			break;
	}
	return `Couldn't connect ${label}. Try again.`;
}
