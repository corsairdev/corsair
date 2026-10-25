'use client';

import { CheckCircle, DiscordLogo, GithubLogo } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import type { ConnectProvider } from '@/server/oss-connect/linked-account';

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

// better-auth adds ?error=<code> to the error callback URL.
const LINK_ERRORS: Record<string, string> = {
	account_already_linked_to_different_user:
		'That account is already connected to another corsair.dev profile.',
};

export function ConnectAccountsCallout({
	accounts,
}: {
	accounts: ConnectableAccount[];
}) {
	const searchParams = useSearchParams();
	const [pending, setPending] = useState<ConnectProvider | null>(null);
	const [error, setError] = useState('');

	const linkError =
		searchParams.get('connect') === 'failed'
			? (LINK_ERRORS[searchParams.get('error') ?? ''] ??
				"Couldn't connect that account. Try again.")
			: '';

	const connect = async (provider: ConnectProvider) => {
		setPending(provider);
		setError('');
		posthog.capture('oss_account_connect_started', { provider });
		// Redirects to the provider and back to /oss once the account is linked.
		const { error: linkStartError } = await authClient.linkSocial({
			provider,
			callbackURL: '/oss',
			errorCallbackURL: '/oss?connect=failed',
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
