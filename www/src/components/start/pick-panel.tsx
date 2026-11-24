'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';

import type { AppCatalog } from '@/lib/claim-apps';
import { MAX_APPS } from '@/lib/claim-passage';
import { listNames, skillApps, skillBySlug } from '@/lib/gateway-skills';
import { cn } from '@/lib/utils';

import { AppIcon } from './start-icons';
import type { PassageApi } from './use-passage';

const SEARCH_LIMIT = 18;

/** Step 2: the apps this URL reaches, up to 8. A skill's apps lead the shelf. */
export function PickPanel({
	api,
	catalog,
}: {
	api: PassageApi;
	catalog: AppCatalog;
}) {
	const { p, send } = api;
	const [query, setQuery] = useState('');
	const skill = p.skill ? skillBySlug(p.skill) : undefined;
	const nameOf = (id: string) => catalog.byId(id)?.name ?? id;
	const grid = query
		? catalog.search(query, SEARCH_LIMIT).map((a) => a.id)
		: catalog.shelf(skill ? skillApps(skill) : []);
	const full = p.apps.length >= MAX_APPS;
	const needs = skill ? skill.required.filter((id) => catalog.byId(id)) : [];

	return (
		<div className="border-t border-[#1c1c1c1a] px-5 pt-4 pb-5 sm:px-6">
			{skill ? (
				<p className="mb-3 text-[13px] text-[#1c1c1c99]">
					Setting up{' '}
					<span className="font-medium text-[#1c1c1c]">{skill.name}</span>
					{needs.length
						? `. It needs ${listNames(needs)}; the others add to it.`
						: '. Keep the apps you use.'}
				</p>
			) : null}
			<div className="mb-3 flex items-baseline justify-between gap-3">
				<h2 className="text-[15px] font-medium text-[#1c1c1c]">
					Which apps should your agents reach?
				</h2>
				<span className="shrink-0 text-[12px] tabular-nums text-[#1c1c1c66]">
					{p.apps.length} of {MAX_APPS}
				</span>
			</div>
			<label className="mb-3 flex h-10 items-center gap-2 rounded-lg border border-[#1c1c1c1a] bg-[#fafafa] px-3 text-[14px] transition-colors focus-within:border-[#4a38f5]/60 focus-within:bg-white">
				<MagnifyingGlass
					size={15}
					className="shrink-0 text-[#1c1c1c66]"
					aria-hidden
				/>
				<span className="sr-only">Search apps</span>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={`Search ${catalog.countLabel} apps`}
					className="w-full bg-transparent text-[#1c1c1c] outline-none placeholder:text-[#1c1c1c66]"
				/>
			</label>
			<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
				{grid.map((id) => {
					const on = p.apps.includes(id);
					const name = nameOf(id);
					return (
						<button
							key={id}
							type="button"
							aria-pressed={on}
							disabled={!on && full}
							title={!on && full ? `Up to ${MAX_APPS} apps` : undefined}
							onClick={() => send({ type: 'toggleApp', id })}
							className={cn(
								'relative flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-2 pt-3 pb-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5] disabled:cursor-default disabled:opacity-40',
								on
									? 'border-[#4a38f5] bg-[#4a38f5]/[0.05]'
									: 'border-[#1c1c1c1a] bg-white enabled:hover:border-[#1c1c1c33]',
							)}
						>
							<AppIcon id={id} name={name} size={28} />
							<span className="w-full truncate text-[12px] text-[#1c1c1c]">
								{name}
							</span>
							{on ? <Check className="absolute top-1.5 right-1.5" /> : null}
						</button>
					);
				})}
			</div>
			{query && grid.length === 0 ? (
				<p className="ph-no-capture py-6 text-center text-[13px] text-[#1c1c1c66]">
					Nothing called “{query}” yet.
				</p>
			) : null}
			{!query && grid.length === 0 ? (
				<p className="py-6 text-center text-[13px] text-[#1c1c1c66]">
					The app list didn't load. Refresh the page to try again.
				</p>
			) : null}
		</div>
	);
}

export function Check({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				'grid size-4 place-items-center rounded-[5px] bg-[#4a38f5]',
				className,
			)}
		>
			<svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
				<path
					d="m2.5 6.2 2.3 2.3 4.7-5"
					stroke="#fff"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
}
