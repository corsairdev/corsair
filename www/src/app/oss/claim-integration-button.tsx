'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { claimIntegration } from './actions';

export function ClaimIntegrationButton({
	integrationId,
	integrationSlug,
	size = 'sm',
	className,
}: {
	integrationId: string;
	integrationSlug: string;
	size?: 'sm' | 'lg';
	className?: string;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleClick = async () => {
		setLoading(true);
		setError('');

		try {
			await claimIntegration(integrationId);
			router.push(`/oss/${integrationSlug}?gettingStarted=1`);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to claim integration',
			);
		} finally {
			setLoading(false);
		}
	};

	if (size === 'lg') {
		return (
			<div className={cn('space-y-2', className)}>
				<button
					type="button"
					onClick={handleClick}
					disabled={loading}
					className="inline-flex w-full items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-base font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2a2a2a] active:translate-y-0 disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
				>
					{loading ? 'Claiming...' : 'Claim this integration'}
				</button>
				{error ? (
					<p className="text-sm text-destructive">{error}</p>
				) : null}
			</div>
		);
	}

	return (
		<span className={cn('inline-flex items-center gap-2', className)}>
			<Button
				type="button"
				size="sm"
				onClick={handleClick}
				disabled={loading}
				className="rounded-lg"
			>
				{loading ? 'Claiming...' : 'Claim'}
			</Button>
			{error ? <span className="text-xs text-destructive">{error}</span> : null}
		</span>
	);
}

export function SignInToClaimLink({
	className,
}: {
	className?: string;
}) {
	return (
		<Link
			href="/oss/sign-in"
			className={cn(
				'inline-flex w-full items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-base font-medium text-white no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2a2a2a] active:translate-y-0 sm:w-auto',
				className,
			)}
		>
			Sign in to claim
		</Link>
	);
}
