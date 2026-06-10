'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function SignInForm() {
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError('');

		await authClient.signIn.magicLink(
			{
				email,
				callbackURL: '/oss-integrations',
			},
			{
				onSuccess: () => setSent(true),
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
				Enter your email and we&apos;ll send you a magic link.
			</p>

			<form
				onSubmit={handleSubmit}
				className="mt-6 rounded-xl border border-border/70 bg-card p-6 shadow-sm"
			>
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
					href="/oss-integrations"
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					← Back to integrations
				</Link>
			</p>
		</div>
	);
}
