'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { ClaimBlockReason } from '@/lib/integration-claim-limits';
import { MAX_USER_BUILT_INTEGRATIONS } from '@/lib/integration-claim-limits';
import { cn } from '@/lib/utils';

import { claimIntegration } from '@/server/actions/claim-integration';

export function wipClaimTooltipMessage(integrationName: string) {
	return `Please complete ${integrationName} before claiming your next integration`;
}

export function claimBlockTooltipMessage(
	blockReason: ClaimBlockReason | null | undefined,
	wipIntegrationName?: string | null,
) {
	if (blockReason === 'wip' && wipIntegrationName) {
		return wipClaimTooltipMessage(wipIntegrationName);
	}

	if (blockReason === 'limit_reached') {
		return `You've built the maximum of ${MAX_USER_BUILT_INTEGRATIONS} integrations`;
	}

	return undefined;
}

function ClaimButtonTooltip({
	tooltip,
	children,
	className,
}: {
	tooltip?: string;
	children: ReactNode;
	className?: string;
}) {
	if (!tooltip) {
		return <>{children}</>;
	}

	return (
		<span className={cn('group/claim-tooltip relative inline-flex', className)}>
			{children}
			<span
				role="tooltip"
				className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 hidden w-max max-w-[260px] -translate-x-1/2 rounded-md bg-[#1c1c1c] px-2.5 py-1.5 text-center text-xs leading-snug text-white shadow-md group-hover/claim-tooltip:block"
			>
				{tooltip}
			</span>
		</span>
	);
}

export function ClaimIntegrationButton({
	integrationId,
	integrationSlug,
	disabled = false,
	wipIntegrationName,
	claimBlockReason,
	size = 'sm',
	className,
}: {
	integrationId: string;
	integrationSlug: string;
	disabled?: boolean;
	wipIntegrationName?: string | null;
	claimBlockReason?: ClaimBlockReason | null;
	size?: 'sm' | 'lg';
	className?: string;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const tooltip = disabled
		? claimBlockTooltipMessage(claimBlockReason, wipIntegrationName)
		: undefined;

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
				<ClaimButtonTooltip tooltip={tooltip} className="w-full sm:w-auto">
					<button
						type="button"
						onClick={handleClick}
						disabled={loading || disabled}
						className="inline-flex w-full items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-base font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2a2a2a] active:translate-y-0 disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
					>
						{loading ? 'Claiming...' : 'Claim this integration'}
					</button>
				</ClaimButtonTooltip>
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
			</div>
		);
	}

	return (
		<span className={cn('inline-flex flex-col items-end gap-1', className)}>
			<ClaimButtonTooltip tooltip={tooltip}>
				<Button
					type="button"
					size={size}
					onClick={handleClick}
					disabled={loading || disabled}
					className="rounded-lg"
				>
					{loading ? 'Claiming...' : 'Claim'}
				</Button>
			</ClaimButtonTooltip>
			{error ? <span className="text-xs text-destructive">{error}</span> : null}
		</span>
	);
}

export function SignInToClaimLink({ className }: { className?: string }) {
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
