'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

export type OssIntegrationsView = 'integrations' | 'leaderboard';

function buildViewHref(
	view: OssIntegrationsView,
	searchParams: URLSearchParams,
) {
	const params = new URLSearchParams(searchParams.toString());

	if (view === 'integrations') {
		params.delete('view');
	} else {
		params.set('view', view);
	}

	params.delete('page');

	const query = params.toString();
	return query ? `/oss?${query}` : '/oss';
}

const tabs: Array<{ id: OssIntegrationsView; label: string }> = [
	{ id: 'integrations', label: 'Integrations' },
	{ id: 'leaderboard', label: 'Leaderboard' },
];

export function ViewTabs({ activeView }: { activeView: OssIntegrationsView }) {
	const searchParams = useSearchParams();

	return (
		<div className="inline-flex rounded-lg border border-border/70 bg-muted/40 p-1">
			{tabs.map((tab) => (
				<Link
					key={tab.id}
					href={buildViewHref(tab.id, searchParams)}
					className={cn(
						'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
						activeView === tab.id
							? 'bg-card text-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground',
					)}
				>
					{tab.label}
				</Link>
			))}
		</div>
	);
}
