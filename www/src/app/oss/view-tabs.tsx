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
		<div className="flex gap-6 border-b border-[#1c1c1c1a]">
			{tabs.map((tab) => (
				<Link
					key={tab.id}
					href={buildViewHref(tab.id, searchParams)}
					className={cn(
						'-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors',
						activeView === tab.id
							? 'border-[#1c1c1c] text-[#1c1c1c]'
							: 'border-transparent text-[#1c1c1c66] hover:text-[#1c1c1c]',
					)}
				>
					{tab.label}
				</Link>
			))}
		</div>
	);
}
