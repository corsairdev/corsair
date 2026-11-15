'use client';

import { CheckCircle, DiscordLogo, GithubLogo } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import type { ConnectProvider } from '@/server/oss-connect/linked-account';

import { connectErrorMessage } from './oauth-error-messages';

export type ConnectableAccount = {
	provider: ConnectProvider;
	connected: boolean;
	username: string | null;
};

const PROVIDER_LABEL: Record<ConnectProvider, string> = {
	github: 'GitHub',
	discord: 'Discord',
};

const PROVIDER_REASON: Record<ConnectProvider, string> = {
	github: 'Your merged PR finishes your claim on its own.',
	discord: 'The #shipped channel tags you when your PR merges.',
};

export function ConnectAccountsCallout({
	accounts,
}: {
	accounts: ConnectableAccount[];
}) {
	const searchParams = useSearchParams();
	const [pending, setPending] = useState<ConnectProvider | null>(null);
	const [switching, setSwitching] = useState(false);
	const [error, setError] = useState('');

	const failedProvider =
		accounts.find(
			(account) => account.provider === searchParams.get('provider'),
		)?.provider ?? null;
	const linkError =
		searchParams.get('connect') === 'failed'
			? connectErrorMessage(searchParams.get('error'), failedProvider)
			: '';
	const github = accounts.find((account) => account.provider === 'github');
	// A first GitHub sign-in made a new account. Someone who signed up with
	// another email before has their claims there, so offer to move GitHub over.
	const offerSwitch =
		searchParams.get('welcome') === 'github' && github?.connected === true;

	const switchToEmailAccount = async () => {
		setSwitching(true);
		setError('');
		posthog.capture('oss_github_moved_to_email_account');
		const { error: unlinkError } = await authClient.unlinkAccount({
			providerId: 'github',
		});
		if (unlinkError) {
			setError(unlinkError.message ?? "Couldn't disconnect GitHub.");
			setSwitching(false);
			return;
		}
		await authClient.signOut();
		window.location.assign('/oss/sign-in?switched=github');
	};

	const connect = async (provider: ConnectProvider) => {
		setPending(provider);
		setError('');
		posthog.capture('oss_account_connect_started', { provider });
		// Redirects to the provider and back to /oss once the account is linked.
		const { error: linkStartError } = await authClient.linkSocial({
			provider,
			callbackURL: '/oss',
			errorCallbackURL: `/oss?connect=failed&provider=${provider}`,
		});
		if (linkStartError) {
			setError(linkStartError.message ?? "Couldn't start connecting.");
			setPending(null);
		}
	};

	return (
		<div className="mb-6 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
			<p className="mb-1 text-sm font-semibold">Connect your accounts</p>
			<p className="mb-4 text-sm text-muted-foreground">
				Prove which GitHub and Discord accounts are yours.
			</p>
			{offerSwitch ? (
				<div className="mb-4 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-sm">
					<p>
						You're signed in with GitHub on a new corsair.dev account. Signed up
						with a different email before? Your claims are on that account.
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="mt-2 rounded-lg"
						disabled={switching}
						onClick={switchToEmailAccount}
					>
						{switching ? 'Switching...' : 'Use my email account instead'}
					</Button>
				</div>
			) : null}
			<ul className="flex flex-col gap-3">
				{accounts.map((account) => {
					const Icon = account.provider === 'github' ? GithubLogo : DiscordLogo;
					return (
						<li
							key={account.provider}
							className="flex flex-wrap items-center justify-between gap-3"
						>
							<div className="flex min-w-0 items-center gap-3">
								<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
									<Icon size={18} aria-hidden />
								</span>
								<div className="min-w-0">
									<p className="text-sm font-medium">
										{PROVIDER_LABEL[account.provider]}
									</p>
									<p className="truncate text-xs text-muted-foreground">
										{account.connected
											? `Connected as ${account.username ? `@${account.username}` : 'you'}`
											: PROVIDER_REASON[account.provider]}
									</p>
								</div>
							</div>
							{account.connected ? (
								<CheckCircle
									size={20}
									weight="fill"
									className="text-emerald-600"
									aria-label="Connected"
								/>
							) : (
								<Button
									type="button"
									size="sm"
									className="rounded-lg"
									disabled={pending !== null}
									onClick={() => connect(account.provider)}
								>
									{pending === account.provider
										? 'Opening...'
										: `Connect ${PROVIDER_LABEL[account.provider]}`}
								</Button>
							)}
						</li>
					);
				})}
			</ul>
			{error || linkError ? (
				<p className="mt-3 text-xs text-destructive">{error || linkError}</p>
			) : null}
		</div>
	);
}
