'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { markIntegrationFinished } from './actions';

export function MarkFinishedButton({
	integrationId,
	hasRequiredUrls,
}: {
	integrationId: string;
	hasRequiredUrls: boolean;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleClick = async () => {
		setLoading(true);
		setError('');

		try {
			await markIntegrationFinished(integrationId);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Failed to mark integration as finished',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mt-4 border-t border-border/60 pt-4">
			<p className="mb-3 text-sm text-muted-foreground">
				Once your issue and PR links are saved above, mark this integration as
				finished so others know your work is ready for review.
			</p>
			<div className="flex flex-wrap items-center gap-3">
				<Button
					type="button"
					size="sm"
					onClick={handleClick}
					disabled={loading || !hasRequiredUrls}
					className="rounded-lg"
				>
					{loading ? 'Marking finished...' : 'Mark as finished'}
				</Button>
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

export function FinishedStatusCallout() {
	return (
		<div className="mt-4 border-t border-border/60 pt-4">
			<Badge variant="success">Finished</Badge>
			<p className="mt-2 text-sm text-muted-foreground">
				You marked this integration as finished. Thanks for contributing.
			</p>
		</div>
	);
}
