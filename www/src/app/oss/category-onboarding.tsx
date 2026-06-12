'use client';

import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { FramedPanel } from './framed-panel';
import { buildOssHref } from './oss-url';

const STORAGE_KEY = 'corsair-oss-onboarding';

type CategoryOnboardingProps = {
	tags: Array<{
		slug: string;
		name: string;
		integrationCount: number;
	}>;
	hasActiveFilters: boolean;
};

type StoredOnboarding = {
	dismissed: boolean;
	categories: string[];
};

function readStored(): StoredOnboarding | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as StoredOnboarding) : null;
	} catch {
		return null;
	}
}

function writeStored(value: StoredOnboarding) {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	} catch {
		// localStorage unavailable; onboarding will reappear next visit
	}
}

export function CategoryOnboarding({
	tags,
	hasActiveFilters,
}: CategoryOnboardingProps) {
	const router = useRouter();
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState<string[]>([]);

	useEffect(() => {
		if (hasActiveFilters) return;
		const stored = readStored();
		if (!stored?.dismissed) {
			setVisible(true);
			setSelected(stored?.categories ?? []);
		}
	}, [hasActiveFilters]);

	if (!visible) return null;

	const toggle = (slug: string) => {
		setSelected((current) =>
			current.includes(slug)
				? current.filter((value) => value !== slug)
				: [...current, slug],
		);
	};

	const dismiss = () => {
		writeStored({ dismissed: true, categories: selected });
		setVisible(false);
	};

	const apply = () => {
		writeStored({ dismissed: true, categories: selected });
		setVisible(false);
		if (selected.length > 0) {
			router.push(buildOssHref({ tags: selected }));
		}
	};

	return (
		<FramedPanel className="mb-8">
			<div className="relative px-5 py-5 sm:px-6 sm:py-6">
				<button
					type="button"
					onClick={dismiss}
					aria-label="Dismiss"
					className="absolute top-4 right-4 p-1 text-[#1c1c1c40] transition-colors hover:text-[#1c1c1c]"
				>
					<XIcon className="size-4" />
				</button>
				<p className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					Welcome aboard
				</p>
				<h2 className="mt-2 text-lg font-light tracking-[-0.01em] text-[#1c1c1c]">
					<span className="font-[family-name:var(--landing-font-serif)] italic">
						What do you build with?
					</span>
				</h2>
				<p className="mt-1.5 max-w-md text-[13px] leading-[1.65] text-[#1c1c1c99]">
					Pick a few categories and we&apos;ll surface the best integrations to
					claim first.
				</p>
				<div className="mt-5 flex flex-wrap gap-2">
					{tags.slice(0, 14).map((tag) => {
						const isSelected = selected.includes(tag.slug);

						return (
							<button
								key={tag.slug}
								type="button"
								onClick={() => toggle(tag.slug)}
								aria-pressed={isSelected}
								className={cn(
									'border px-3 py-1.5 text-xs font-medium transition-colors duration-200',
									isSelected
										? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
										: 'border-[#1c1c1c1a] bg-white text-[#1c1c1c] hover:border-[#1c1c1c66]',
								)}
							>
								{tag.name}
								<span
									className={cn(
										'ml-1.5 font-[family-name:var(--font-landing-mono)] text-[10px]',
										isSelected ? 'text-white/60' : 'text-[#1c1c1c66]',
									)}
								>
									{tag.integrationCount}
								</span>
							</button>
						);
					})}
				</div>
				<div className="mt-5 flex items-center gap-4">
					<button
						type="button"
						onClick={apply}
						disabled={selected.length === 0}
						className="inline-flex items-center border border-[#1c1c1c] bg-[#1c1c1c] px-4 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-30"
					>
						Show my integrations
					</button>
					<button
						type="button"
						onClick={dismiss}
						className="text-xs font-medium text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
					>
						Skip for now
					</button>
				</div>
			</div>
		</FramedPanel>
	);
}
