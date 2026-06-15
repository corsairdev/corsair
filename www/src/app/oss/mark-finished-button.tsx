'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IntegrationPhase } from '@/db/schema';

import { markIntegrationReadyToReview } from '@/server/actions/mark-ready-to-review';

export function MarkReadyToReviewButton({
	integrationId,
	hasRequiredUrls,
	phase,
	variant = 'default',
}: {
	integrationId: string;
	hasRequiredUrls: boolean;
	phase: IntegrationPhase | null;
	variant?: 'default' | 'workflow';
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleClick = async () => {
		setLoading(true);
		setError('');

		try {
			await markIntegrationReadyToReview(integrationId);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Failed to mark integration ready to review',
			);
		} finally {
			setLoading(false);
		}
	};

	if (phase === 'ready_to_review') {
		return <ReadyToReviewStatusCallout variant={variant} />;
	}

	if (phase === 'finished') {
		return <FinishedStatusCallout variant={variant} />;
	}

	if (variant === 'workflow') {
		return (
			<div className="mt-4">
				<div className="flex flex-wrap items-center gap-3">
					<Button
						type="button"
						size="sm"
						onClick={handleClick}
						disabled={loading || !hasRequiredUrls || phase !== 'building'}
						className="rounded-lg"
					>
						{loading ? 'Marking ready...' : 'Mark ready to review'}
					</Button>
					{phase !== 'building' ? (
						<span className="text-xs text-[#1c1c1c66]">
							Link your issue and PR first.
						</span>
					) : null}
					{!hasRequiredUrls ? (
						<span className="text-xs text-[#1c1c1c66]">
							Save an issue URL and PR URL first.
						</span>
					) : null}
					{error ? (
						<span className="text-xs text-destructive">{error}</span>
					) : null}
				</div>
			</div>
		);
	}

	return (
		<div className="mt-4 border-t border-border/60 pt-4">
			<p className="mb-3 text-sm text-muted-foreground">
				Once your issue and PR links are saved above and the plugin is
				implemented, mark this integration ready to review. You can then claim
				another integration while we review your work.
			</p>
			<div className="flex flex-wrap items-center gap-3">
				<Button
					type="button"
					size="sm"
					onClick={handleClick}
					disabled={loading || !hasRequiredUrls || phase !== 'building'}
					className="rounded-lg"
				>
					{loading ? 'Marking ready...' : 'Mark ready to review'}
				</Button>
				{phase !== 'building' ? (
					<span className="text-xs text-muted-foreground">
						Link your issue and PR first.
					</span>
				) : null}
				{!hasRequiredUrls ? (
					<span className="text-xs text-muted-foreground">
						Save an issue URL and PR URL first.
					</span>
				) : null}
				{error ? (
					<span className="text-xs text-destructive">{error}</span>
				) : null}
			</div>
		</div>
	);
}

export function ReadyToReviewStatusCallout({
	variant = 'default',
}: {
	variant?: 'default' | 'workflow';
}) {
	if (variant === 'workflow') {
		return (
			<div>
				<Badge variant="accent">Ready to review</Badge>
				<p className="mt-2 text-[14px] text-[#1c1c1c99]">
					This integration is ready for review. You can claim another integration
					while we review your work.
				</p>
			</div>
		);
	}

	return (
		<div className="mt-4 border-t border-border/60 pt-4">
			<Badge variant="accent">Ready to review</Badge>
			<p className="mt-2 text-sm text-muted-foreground">
				This integration is ready for review. You can claim another integration
				while we review your work.
			</p>
		</div>
	);
}

export function FinishedStatusCallout({
	variant = 'default',
}: {
	variant?: 'default' | 'workflow';
}) {
	if (variant === 'workflow') {
		return (
			<div>
				<Badge variant="success">Finished</Badge>
				<p className="mt-2 text-[14px] text-[#1c1c1c99]">
					This integration has been accepted. Thanks for contributing.
				</p>
			</div>
		);
	}

	return (
		<div className="mt-4 border-t border-border/60 pt-4">
			<Badge variant="success">Finished</Badge>
			<p className="mt-2 text-sm text-muted-foreground">
				This integration has been accepted. Thanks for contributing.
			</p>
		</div>
	);
}

/** @deprecated Use MarkReadyToReviewButton */
export const MarkFinishedButton = MarkReadyToReviewButton;
