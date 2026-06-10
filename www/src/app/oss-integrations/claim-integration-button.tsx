'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { claimIntegration } from './actions';

export function ClaimIntegrationButton({
	integrationId,
	integrationSlug,
}: {
	integrationId: string;
	integrationSlug: string;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleClick = async () => {
		setLoading(true);
		setError('');

		try {
			await claimIntegration(integrationId);
			router.push(`/integrations/${integrationSlug}?gettingStarted=1`);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to claim integration',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<span className="inline-flex items-center gap-2">
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
