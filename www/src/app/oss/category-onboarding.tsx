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
	signedIn: boolean;
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
	signedIn,
}: CategoryOnboardingProps) {
	const router = useRouter();
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState<string[]>([]);

	useEffect(() => {
		if (!signedIn || hasActiveFilters) return;
		const stored = readStored();
		if (!stored?.dismissed) {
			setVisible(true);
			setSelected(stored?.categories ?? []);
		}
	}, [signedIn, hasActiveFilters]);

	useEffect(() => {
		if (!visible) return;

		document.body.style.overflow = 'hidden';

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				writeStored({ dismissed: true, categories: [] });
				setVisible(false);
			}
		};
		window.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [visible]);

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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="onboarding-heading"
		>
			<button
				type="button"
				aria-label="Dismiss"
				onClick={dismiss}
				className="absolute inset-0 cursor-default bg-[#1c1c1c]/40 backdrop-blur-[2px]"
				tabIndex={-1}
			/>
			<FramedPanel className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto animate-in duration-300 fade-in zoom-in-95">
				<div className="px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-8">
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
					<h2
						id="onboarding-heading"
						className="mt-3 text-[clamp(1.5rem,3vw,1.875rem)] font-light leading-[1.15] tracking-[-0.01em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)] italic">
							What do you
						</span>{' '}
						<span className="font-[family-name:var(--landing-font-sans)]">
							build with?
						</span>
					</h2>
					<p className="mt-2.5 max-w-md text-[14px] leading-[1.65] text-[#1c1c1c99]">
						Pick a few categories and we&apos;ll surface the best integrations
						to claim first. You can change filters anytime.
					</p>

					<div className="mt-6 flex flex-wrap gap-2">
						{tags.slice(0, 14).map((tag) => {
							const isSelected = selected.includes(tag.slug);

							return (
								<button
									key={tag.slug}
									type="button"
									onClick={() => toggle(tag.slug)}
									aria-pressed={isSelected}
									className={cn(
										'border px-3 py-1.5 text-[13px] font-medium transition-colors duration-200',
										isSelected
											? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
											: 'border-[#1c1c1c1a] bg-white text-[#1c1c1c] hover:border-[#1c1c1c66]',
									)}
								>
									{tag.name}
									<span
										className={cn(
											'ml-1.5 font-[family-name:var(--font-landing-mono)] text-[10px] tabular-nums',
											isSelected ? 'text-white/60' : 'text-[#1c1c1c66]',
										)}
									>
										{tag.integrationCount}
									</span>
								</button>
							);
						})}
					</div>

					<div className="mt-8 flex items-center justify-between gap-4 border-t border-[#1c1c1c1a] pt-5">
						<button
							type="button"
							onClick={dismiss}
							className="text-[13px] font-medium text-[#1c1c1c66] transition-colors hover:text-[#1c1c1c]"
						>
							Skip for now
						</button>
						<button
							type="button"
							onClick={apply}
							disabled={selected.length === 0}
							className="inline-flex items-center border border-[#1c1c1c] bg-[#1c1c1c] px-5 py-2.5 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-30"
						>
							{selected.length > 0
								? `Show ${selected.length} ${selected.length === 1 ? 'category' : 'categories'}`
								: 'Show my integrations'}
						</button>
					</div>
				</div>
			</FramedPanel>
		</div>
	);
}
