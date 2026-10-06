'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function PluginSearchButton() {
	const { setOpenSearch, hotKey } = useSearchContext();

	return (
		<button
			type="button"
			onClick={() => setOpenSearch(true)}
			className="flex w-full items-center gap-2.5 rounded-md border border-fd-border bg-fd-card px-3 py-2.5 text-left text-sm text-fd-muted-foreground transition-colors hover:border-fd-foreground/25 hover:text-fd-foreground"
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="size-4 shrink-0"
			>
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
			<span className="flex-1">Search integrations</span>
			<kbd className="hidden gap-0.5 font-mono text-[11px] text-fd-muted-foreground sm:flex">
				{hotKey.map((k) => (
					<span key={String(k.display)}>{k.display}</span>
				))}
			</kbd>
		</button>
	);
}
