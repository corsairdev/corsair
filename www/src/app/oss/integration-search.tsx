'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useOssNavigation } from './oss-navigation';
import { shouldApplySearch, shouldSyncSearchValue } from './oss-search-sync';
import { buildOssHref, parseTagSlugs } from './oss-url';

const DEBOUNCE_MS = 500;

export function IntegrationSearch({ defaultValue }: { defaultValue: string }) {
	const { navigate } = useOssNavigation();
	const searchParams = useSearchParams();
	const [value, setValue] = useState(defaultValue);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const paramsRef = useRef(searchParams);
	paramsRef.current = searchParams;
	const lastAppliedRef = useRef(defaultValue);

	useEffect(() => {
		const isFocused =
			typeof document !== 'undefined' &&
			document.activeElement === inputRef.current;
		if (
			shouldSyncSearchValue({
				defaultValue,
				lastApplied: lastAppliedRef.current,
				isFocused,
			})
		) {
			lastAppliedRef.current = defaultValue;
			setValue(defaultValue);
		}
	}, [defaultValue]);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const applySearch = (query: string) => {
		const trimmed = query.trim();

		if (!shouldApplySearch(trimmed, lastAppliedRef.current)) return;

		lastAppliedRef.current = trimmed;
		const tags = parseTagSlugs(paramsRef.current.get('tags') ?? undefined);
		navigate(buildOssHref({ q: trimmed, tags }));
	};

	const scheduleSearch = (next: string, immediate = false) => {
		setValue(next);

		if (debounceRef.current) clearTimeout(debounceRef.current);

		if (immediate) {
			applySearch(next);
			return;
		}

		debounceRef.current = setTimeout(() => {
			applySearch(next);
		}, DEBOUNCE_MS);
	};

	const handleChange = (next: string) => {
		scheduleSearch(next);
	};

	return (
		<div className="relative">
			<MagnifyingGlass
				size={16}
				className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#1c1c1c66]"
				aria-hidden
			/>
			<input
				ref={inputRef}
				type="search"
				aria-label="Search integrations"
				value={value}
				onChange={(event) => handleChange(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						event.preventDefault();
						scheduleSearch(value, true);
					}
				}}
				placeholder="Search integrations..."
				className={cn(
					'w-full border border-[#1c1c1c1a] bg-white py-2.5 pr-4 pl-10 text-sm transition-colors',
					'placeholder:text-[#1c1c1c66] focus:border-[#1c1c1c66] focus:outline-none',
				)}
			/>
		</div>
	);
}
