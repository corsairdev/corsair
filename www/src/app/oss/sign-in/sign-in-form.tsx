'use client';

import { GithubLogo } from '@phosphor-icons/react';
import Link from 'next/link';
import posthog from 'posthog-js';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function SignInForm({
	github,
	githubError,
	switchedFromGithub,
}: {
	/** Whether GitHub sign-in is configured. */
	github: boolean;
	/** Why the last GitHub sign-in failed, from the ?error= code. */
	githubError: string | null;
	/** The person just handed their GitHub to an older email account. */
	switchedFromGithub: boolean;
}) {
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [githubPending, setGithubPending] = useState(false);
	const [githubStartError, setGithubStartError] = useState('');

	const signInWithGithub = async () => {
		setGithubPending(true);
		setGithubStartError('');
		posthog.capture('oss_github_sign_in_started');
		// Redirects to GitHub and back. A failure lands here with ?error=<code>.
		const { error: startError } = await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/oss',
			newUserCallbackURL: '/oss?welcome=github',
			errorCallbackURL: '/oss/sign-in',
		});
		if (startError) {
			setGithubStartError(
				startError.message ?? "Couldn't start signing in with GitHub.",
			);
			setGithubPending(false);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError('');

		await authClient.signIn.magicLink(
			{
				email,
				callbackURL: '/oss',
			},
			{
				onSuccess: () => {
					posthog.capture('magic_link_requested');
					setSent(true);
				},
				onError: (ctx) => {
					setError(ctx.error.message ?? 'Failed to send magic link');
				},
				onResponse: () => setLoading(false),
			},
		);
	};

	if (sent) {
		return (
			<div className="mx-auto max-w-md rounded-xl border border-border/70 bg-card p-6 shadow-sm">
				<h1 className="text-2xl font-semibold tracking-tight">
					Check your email
				</h1>
				<p className="mt-3 text-sm text-muted-foreground">
					We sent a sign-in link to{' '}
					<Badge variant="outline" className="font-normal">
						{email}
					</Badge>
					.
				</p>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="mt-4 rounded-lg"
					onClick={() => setSent(false)}
				>
					Send a new link
				</Button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-md">
			<h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Sign in to claim integrations, ship plugins, and earn points for every
				merge.
			</p>

			{switchedFromGithub ? (
				<p className="mt-4 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-sm">
					Sign in with the email you used before, then connect GitHub on the OSS
					page.
				</p>
			) : null}

			<form
				onSubmit={handleSubmit}
				className="mt-6 rounded-xl border border-border/70 bg-card p-6 shadow-sm"
			>
				{github ? (
					<>
						<Button
							type="button"
							variant="outline"
							className="w-full rounded-lg"
							disabled={githubPending}
							onClick={signInWithGithub}
						>
							<GithubLogo size={16} aria-hidden />
							{githubPending ? 'Opening GitHub...' : 'Continue with GitHub'}
						</Button>
						{githubStartError || githubError ? (
							<p className="mt-3 text-xs text-destructive">
								{githubStartError || githubError}
							</p>
						) : null}
						<div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
							<span className="h-px flex-1 bg-border/70" />
							or
							<span className="h-px flex-1 bg-border/70" />
						</div>
					</>
				) : null}

				<label
					htmlFor="email"
					className="text-xs font-medium text-muted-foreground"
				>
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					placeholder="you@example.com"
					className="mt-1.5 w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm shadow-sm transition-all focus:border-border focus:ring-2 focus:ring-foreground/5 focus:outline-none"
				/>

				{error ? (
					<p className="mt-3 text-xs text-destructive">{error}</p>
				) : null}

				<Button
					type="submit"
					disabled={loading}
					size="sm"
					className="mt-4 rounded-lg"
				>
					{loading ? 'Sending...' : 'Send magic link'}
				</Button>
			</form>

			<p className="mt-6 text-sm">
				<Link
					href="/oss"
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					← Back to integrations
				</Link>
			</p>
		</div>
	);
}
