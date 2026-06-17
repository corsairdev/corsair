'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useOssNavigation } from './oss-navigation';
import { buildOssHref, parseTagSlugs } from './oss-url';

const DEBOUNCE_MS = 500;

export function IntegrationSearch({ defaultValue }: { defaultValue: string }) {
	const { navigate } = useOssNavigation();
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

		const tags = parseTagSlugs(searchParams.get('tags') ?? undefined);
		navigate(buildOssHref({ q: trimmed, tags }));
	};

	const handleChange = (next: string) => {
		setValue(next);

		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(() => {
			applySearch(next);
		}, DEBOUNCE_MS);
	};

	return (
		<div className="relative">
			<MagnifyingGlass
				size={16}
				className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#1c1c1c66]"
				aria-hidden
			/>
			<input
				type="search"
				value={value}
				onChange={(event) => handleChange(event.target.value)}
				placeholder="Search integrations..."
				className={cn(
					'w-full border border-[#1c1c1c1a] bg-white py-2.5 pr-4 pl-10 text-sm transition-colors',
					'placeholder:text-[#1c1c1c66] focus:border-[#1c1c1c66] focus:outline-none',
				)}
			/>
		</div>
	);
}
