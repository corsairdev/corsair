'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useId, useMemo, useState } from 'react';

import { IntegrationRiskChip } from '@/components/integrations/detail/integration-risk-chip';
import type { CapabilityCard } from '@/lib/integration-capabilities';
import {
	flattenCapabilityGroups,
	matchesCapabilityQuery,
} from '@/lib/integration-capabilities';
import type { IntegrationCapabilityGroup } from '@/lib/integration-page.types';
import { cn } from '@/lib/utils';

// Enough to show what the app can do without a wall of cards; the rest stay in
// the page (hidden) so search engines and Ctrl+F still find them.
const COLLAPSED_COUNT = 12;

type Kind = 'tools' | 'triggers';

function ToolCard({ card }: { card: CapabilityCard }) {
	return (
		<div className="flex w-full min-w-0 flex-col rounded-md border border-[#1c1c1c]/10 bg-white px-4 py-3.5">
			<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
				<span className="min-w-0 text-[14px] font-medium leading-snug text-[#1c1c1c]">
					{card.label}
				</span>
				{card.riskLevel ? (
					<IntegrationRiskChip riskLevel={card.riskLevel} />
				) : null}
			</div>
			{card.description ? (
				<p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#1c1c1c99]">
					{card.description}
				</p>
			) : null}
			<p className="mt-auto pt-2 font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66] [overflow-wrap:anywhere]">
				{card.id}
			</p>
		</div>
	);
}

export function IntegrationToolsSection({
	displayName,
	operations,
	triggers,
}: {
	displayName: string;
	operations: IntegrationCapabilityGroup[];
	triggers: IntegrationCapabilityGroup[];
}) {
	const searchId = useId();
	const [kind, setKind] = useState<Kind>('tools');
	const [resource, setResource] = useState('all');
	const [query, setQuery] = useState('');
	const [expanded, setExpanded] = useState(false);

	const groups = kind === 'tools' ? operations : triggers;
	const cards = useMemo(
		() => flattenCapabilityGroups(groups, kind),
		[groups, kind],
	);
	const toolCount = operations.reduce((n, g) => n + g.actions.length, 0);
	const triggerCount = triggers.reduce((n, g) => n + g.actions.length, 0);

	const visible = cards.filter(
		(card) =>
			(resource === 'all' || card.resource === resource) &&
			matchesCapabilityQuery(card, query),
	);
	const filtering = resource !== 'all' || query.trim() !== '';
	const collapsed = !expanded && !filtering && visible.length > COLLAPSED_COUNT;
	const noun = kind === 'tools' ? 'tools' : 'triggers';

	const switchKind = (next: Kind) => {
		setKind(next);
		setResource('all');
		setExpanded(false);
	};

	if (toolCount === 0 && triggerCount === 0) return null;

	return (
		<section id="tools" className="scroll-mt-24 pt-8 pb-6 md:pt-10">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					{displayName} tools and triggers
				</h2>
				<p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#1c1c1c99]">
					Tools are what your agent can do in {displayName} through
					Corsair&apos;s MCP server. Triggers are the {displayName} events a
					routine can start from.
				</p>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div
						role="tablist"
						aria-label={`${displayName} tools or triggers`}
						className="inline-flex w-fit rounded-md border border-[#1c1c1c]/10 bg-white p-1"
					>
						{(
							[
								['tools', 'Tools', toolCount],
								['triggers', 'Triggers', triggerCount],
							] as const
						).map(([value, label, count]) => (
							<button
								key={value}
								type="button"
								role="tab"
								aria-selected={kind === value}
								disabled={count === 0}
								onClick={() => switchKind(value)}
								className={cn(
									'rounded px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5] disabled:cursor-not-allowed disabled:opacity-40',
									kind === value
										? 'bg-[#1c1c1c] text-white'
										: 'text-[#1c1c1c99] hover:text-[#1c1c1c]',
								)}
							>
								{label}{' '}
								<span
									className={cn(
										'font-[family-name:var(--landing-font-mono)] text-[11px]',
										kind === value ? 'text-white/70' : 'text-[#1c1c1c66]',
									)}
								>
									{count}
								</span>
							</button>
						))}
					</div>

					<label
						htmlFor={searchId}
						className="flex w-full items-center gap-2 rounded-md border border-[#1c1c1c]/10 bg-white px-3 py-2 focus-within:border-[#4a38f5]/50 sm:w-72"
					>
						<MagnifyingGlass
							size={16}
							className="shrink-0 text-[#1c1c1c66]"
							aria-hidden
						/>
						<span className="sr-only">
							Search {displayName} {noun}
						</span>
						<input
							id={searchId}
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder={`Search ${displayName} ${noun}`}
							className="w-full min-w-0 bg-transparent text-[14px] text-[#1c1c1c] outline-none placeholder:text-[#1c1c1c66]"
						/>
					</label>
				</div>

				{groups.length > 1 ? (
					<div
						className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
						aria-label={`Filter ${noun} by area`}
					>
						{[
							{ resource: 'all', resourceLabel: 'All', size: cards.length },
							...groups.map((group) => ({
								resource: group.resource,
								resourceLabel: group.resourceLabel,
								size: group.actions.length,
							})),
						].map((chip) => (
							<button
								key={chip.resource}
								type="button"
								aria-pressed={resource === chip.resource}
								onClick={() => setResource(chip.resource)}
								className={cn(
									'shrink-0 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]',
									resource === chip.resource
										? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
										: 'border-[#1c1c1c]/10 bg-white text-[#1c1c1c99] hover:border-[#1c1c1c]/25 hover:text-[#1c1c1c]',
								)}
							>
								{chip.resourceLabel}{' '}
								<span className="opacity-60">{chip.size}</span>
							</button>
						))}
					</div>
				) : null}

				{visible.length === 0 ? (
					<p className="mt-5 rounded-md border border-dashed border-[#1c1c1c]/15 bg-white px-6 py-8 text-center text-sm text-[#1c1c1c99]">
						No {displayName} {noun} match &ldquo;{query}&rdquo;.
					</p>
				) : (
					// Grouped by area: catalog names are verbs ("Post", "List"), so
					// the heading says what they act on.
					<div className="mt-5 space-y-6">
						{groups.map((group) => {
							const groupCards = visible.filter(
								(card) => card.resource === group.resource,
							);
							if (groupCards.length === 0) return null;
							const firstIndex = visible.indexOf(groupCards[0]);
							return (
								<div
									key={group.resource}
									className={cn(
										collapsed && firstIndex >= COLLAPSED_COUNT && 'hidden',
									)}
								>
									<h3 className="mb-2.5 text-[13px] font-medium text-[#1c1c1c99]">
										{group.resourceLabel}
									</h3>
									<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
										{groupCards.map((card) => (
											<li
												key={`${card.resource}:${card.id}`}
												className={cn(
													'flex',
													collapsed &&
														visible.indexOf(card) >= COLLAPSED_COUNT &&
														'hidden',
												)}
											>
												<ToolCard card={card} />
											</li>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				)}

				{collapsed ? (
					<div className="mt-4 flex justify-center">
						<button
							type="button"
							onClick={() => setExpanded(true)}
							className="rounded-md border border-[#1c1c1c]/15 bg-white px-4 py-2 text-[13px] font-medium text-[#1c1c1c] transition-colors hover:border-[#1c1c1c]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]"
						>
							Show all {visible.length} {noun}
						</button>
					</div>
				) : null}
			</div>
		</section>
	);
}
