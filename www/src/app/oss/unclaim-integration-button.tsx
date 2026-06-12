'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { unclaimIntegration } from './actions';

export function UnclaimIntegrationButton({
	integrationId,
}: {
	integrationId: string;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleClick = async () => {
		setLoading(true);
		setError('');

		try {
			await unclaimIntegration(integrationId);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to unclaim integration',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<span className="inline-flex items-center gap-2">
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={handleClick}
				disabled={loading}
				className="rounded-lg"
			>
				{loading ? 'Unclaiming...' : 'Unclaim'}
			</Button>
			{error ? <span className="text-xs text-destructive">{error}</span> : null}
		</span>
	);
}
