'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { IntegrationTagBadge } from './integration-tag-badge';
import { useOssNavigation } from './oss-navigation';
import { buildOssHref } from './oss-url';

type IntegrationTagFilterProps = {
	tags: Array<{
		slug: string;
		name: string;
		color: string;
		integrationCount: number;
	}>;
	selectedSlugs: string[];
};

export function IntegrationTagFilter({
	tags,
	selectedSlugs,
}: IntegrationTagFilterProps) {
	const { navigate } = useOssNavigation();
	const searchParams = useSearchParams();
	const isLeaderboard = searchParams.get('view') === 'leaderboard';
	const q = searchParams.get('q')?.trim() ?? '';
	const [optimisticSlugs, setOptimisticSlugs] = useState(selectedSlugs);

	useEffect(() => {
		setOptimisticSlugs(selectedSlugs);
	}, [selectedSlugs]);

	const toggleTag = (slug: string) => {
		const nextSlugs = optimisticSlugs.includes(slug)
			? optimisticSlugs.filter((value) => value !== slug)
			: [...optimisticSlugs, slug];

		setOptimisticSlugs(nextSlugs);
		navigate(buildOssHref({ q, tags: nextSlugs }));
	};

	const clearTags = () => {
		setOptimisticSlugs([]);
		navigate(buildOssHref({ q }));
	};

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
				<span className="shrink-0 font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					Tags
				</span>
				{optimisticSlugs.length > 0 ? (
					<button
						type="button"
						onClick={clearTags}
						disabled={isLeaderboard}
						className="text-xs text-[#1c1c1c66] underline-offset-2 transition-colors hover:text-[#1c1c1c] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
					>
						Clear tags
					</button>
				) : null}
			</div>

			<div
				className={cn(
					'flex flex-wrap gap-1.5 sm:gap-2',
					isLeaderboard && 'pointer-events-none opacity-50',
				)}
			>
				{tags.map((tag) => (
					<IntegrationTagBadge
						key={tag.slug}
						tag={tag}
						selected={optimisticSlugs.includes(tag.slug)}
						count={tag.integrationCount}
						disabled={isLeaderboard}
						onClick={() => toggleTag(tag.slug)}
						className="px-2.5 py-1 sm:px-3 sm:py-1.5"
					/>
				))}
			</div>
		</div>
	);
}
