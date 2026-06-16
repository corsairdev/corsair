'use client';

import { GithubLogo } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { setGithubUsername } from '@/server/actions/set-github-username';

export function GithubUsernameCallout() {
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError('');

		try {
			await setGithubUsername(username);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to save GitHub username',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mb-6 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
			<div className="mb-3 flex items-center gap-2">
				<span className="flex size-8 items-center justify-center rounded-lg bg-muted">
					<GithubLogo size={18} aria-hidden />
				</span>
				<p className="text-sm font-semibold">Add your GitHub username</p>
			</div>
			<p className="mb-4 text-sm text-muted-foreground">
				Link your account to your GitHub profile to continue.
			</p>
			<form
				onSubmit={handleSubmit}
				className="flex flex-wrap items-center gap-2"
			>
				<input
					type="text"
					name="username"
					required
					value={username}
					onChange={(event) => setUsername(event.target.value)}
					placeholder="octocat"
					className="min-w-[200px] flex-1 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm shadow-sm transition-all focus:border-border focus:ring-2 focus:ring-foreground/5 focus:outline-none"
				/>
				<Button
					type="submit"
					disabled={loading}
					size="sm"
					className="rounded-lg"
				>
					{loading ? 'Saving...' : 'Save'}
				</Button>
			</form>
			{error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
		</div>
	);
}
