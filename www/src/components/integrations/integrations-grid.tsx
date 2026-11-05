'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';

import { IntegrationCard } from '@/components/integrations/integration-card';
import type { IntegrationCatalogEntry } from '@/lib/integrations-catalog.types';
import { partitionIntegrations } from '@/lib/popular-integrations';

function filterIntegrations(
	integrations: IntegrationCatalogEntry[],
	query: string,
) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return integrations;

	return integrations.filter(
		(integration) =>
			integration.displayName.toLowerCase().includes(normalizedQuery) ||
			integration.id.toLowerCase().includes(normalizedQuery) ||
			integration.npmPackageName.toLowerCase().includes(normalizedQuery),
	);
}

function IntegrationGrid({
	integrations,
}: {
	integrations: IntegrationCatalogEntry[];
}) {
	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{integrations.map((integration) => (
				<IntegrationCard key={integration.id} integration={integration} />
			))}
		</div>
	);
}

export function IntegrationsGrid({
	integrations,
}: {
	integrations: IntegrationCatalogEntry[];
}) {
	const [query, setQuery] = useState('');

	const { popular, rest } = useMemo(
		() => partitionIntegrations(integrations),
		[integrations],
	);

	const filteredPopular = useMemo(
		() => filterIntegrations(popular, query),
		[popular, query],
	);
	const filteredRest = useMemo(
		() => filterIntegrations(rest, query),
		[rest, query],
	);

	const hasResults = filteredPopular.length > 0 || filteredRest.length > 0;
	const isSearching = query.trim().length > 0;

	return (
		<section className="mx-auto max-w-[1440px] px-4 pb-20 pt-8 sm:px-6 md:px-10 md:pt-10">
			<div className="-mx-4 border-b border-[#1c1c1c]/10 px-4 pb-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10">
				<div className="relative">
					<MagnifyingGlass
						size={16}
						className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#1c1c1c66]"
						aria-hidden
					/>
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search integrations…"
						className="w-full rounded-sm border border-[#1c1c1c]/10 bg-white py-2.5 pr-3 pl-9 text-sm text-[#1c1c1c] outline-none transition-colors placeholder:text-[#1c1c1c66] focus:border-[#1c1c1c]/25 font-[family-name:var(--landing-font-sans)]"
					/>
				</div>
			</div>

			{!hasResults ? (
				<div className="mt-12 rounded-sm border border-dashed border-[#1c1c1c]/15 bg-white px-6 py-16 text-center">
					<p className="text-sm text-[#1c1c1c99]">
						No integrations match your search.
					</p>
				</div>
			) : (
				<div className="mt-6 space-y-10">
					{filteredPopular.length > 0 ? (
						<div>
							{!isSearching ? (
								<h2 className="mb-4 font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.06em] text-[#1c1c1c66]">
									Popular
								</h2>
							) : null}
							<IntegrationGrid integrations={filteredPopular} />
						</div>
					) : null}

					{filteredRest.length > 0 ? (
						<div>
							{!isSearching && filteredPopular.length > 0 ? (
								<h2 className="mb-4 font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.06em] text-[#1c1c1c66]">
									All integrations
								</h2>
							) : null}
							<IntegrationGrid integrations={filteredRest} />
						</div>
					) : null}
				</div>
			)}
		</section>
	);
}
