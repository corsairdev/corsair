import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboData } from '@/lib/combo-types';
import {
	integrationDocsUrl,
	integrationPageUrl,
} from '@/lib/integrations-catalog';
import { getCatalogIntegrationById } from '@/server/catalog-integration-cache';

export async function AppDetails({ combo }: { combo: ComboData }) {
	const [integrationA, integrationB] = await Promise.all([
		getCatalogIntegrationById(combo.slugA),
		getCatalogIntegrationById(combo.slugB),
	]);

	const cards = [
		{ slug: combo.slugA, integration: integrationA },
		{ slug: combo.slugB, integration: integrationB },
	].filter(
		(
			entry,
		): entry is {
			slug: string;
			integration: NonNullable<typeof integrationA>;
		} => entry.integration != null,
	);

	if (cards.length === 0) {
		return null;
	}

	return (
		<section className="py-10 md:py-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="text-center font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					{combo.displayA} and {combo.displayB} details
				</h2>
				<div className="mt-7 grid gap-3 md:grid-cols-2">
					{cards.map(({ slug, integration }) => (
						<article
							key={slug}
							className="rounded-md border border-[#1c1c1c]/10 bg-white px-4 py-5 transition-colors hover:border-[#1c1c1c]/22 sm:px-5"
						>
							<div className="flex items-center gap-3">
								<IntegrationLogo
									id={integration.id}
									displayName={integration.displayName}
									size={40}
									className="rounded-md"
								/>
								<h3 className="text-[17px] font-semibold text-[#1c1c1c]">
									{integration.displayName}
								</h3>
							</div>
							<p className="mt-3 text-[14px] leading-relaxed text-[#1c1c1c66]">
								{integration.blurb}
							</p>
							<div className="mt-4 flex flex-wrap gap-3 text-[13px] font-medium">
								<Link
									href={integrationPageUrl(slug)}
									className="text-[#4a38f5] no-underline hover:underline"
								>
									See {integration.displayName} integration
								</Link>
								<a
									href={integrationDocsUrl(slug)}
									className="text-[#4a38f5] no-underline hover:underline"
								>
									{integration.displayName} docs
								</a>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
