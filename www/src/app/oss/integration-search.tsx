'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 500;

export function IntegrationSearch({ defaultValue }: { defaultValue: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [value, setValue] = useState(defaultValue);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const applySearch = (query: string) => {
		const trimmed = query.trim();
		const current = searchParams.get('q')?.trim() ?? '';

		if (trimmed === current) return;

		const params = new URLSearchParams(searchParams.toString());

		if (trimmed) {
			params.set('q', trimmed);
		} else {
			params.delete('q');
		}

		params.delete('page');

		const qs = params.toString();
		router.replace(qs ? `/oss?${qs}` : '/oss');
	};

	const handleChange = (next: string) => {
		setValue(next);

		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(() => {
			applySearch(next);
		}, DEBOUNCE_MS);
	};

	const isLeaderboard = searchParams.get('view') === 'leaderboard';

	return (
		<div className="relative">
			<MagnifyingGlass
				size={16}
				className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
				aria-hidden
			/>
			<input
				type="search"
				value={value}
				onChange={(event) => handleChange(event.target.value)}
				placeholder="Search integrations..."
				disabled={isLeaderboard}
				className={cn(
					'w-full rounded-lg border border-border/70 bg-card py-2.5 pr-4 pl-9 text-sm shadow-sm transition-all',
					'placeholder:text-muted-foreground focus:border-border focus:ring-2 focus:ring-foreground/5 focus:outline-none',
					isLeaderboard && 'cursor-not-allowed opacity-50',
				)}
			/>
		</div>
	);
}
