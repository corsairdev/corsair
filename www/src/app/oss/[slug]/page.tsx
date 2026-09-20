import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import {
	getIntegrationCapabilitiesForPage,
	getIntegrationSummaryForPage,
} from '@/server/integration-cache';

import {
	IntegrationCapabilitiesSection,
	IntegrationCapabilitiesSkeleton,
	IntegrationHeaderSection,
	IntegrationHeaderSkeleton,
} from './integration-detail-sections';

type PageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;

	try {
		const integration = await getIntegrationSummaryForPage(slug);
		return { title: integration.name };
	} catch {
		return { title: 'Integration not found' };
	}
}

export default async function OssIntegrationPage({ params }: PageProps) {
	const { slug } = await params;
	void getIntegrationSummaryForPage(slug);
	void getIntegrationCapabilitiesForPage(slug);

	return (
		<main className="pb-16">
			<Link
				href="/oss"
				className="mb-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66] no-underline transition-colors hover:text-[#1c1c1c]"
			>
				← All integrations
			</Link>

			<Suspense fallback={<IntegrationHeaderSkeleton />}>
				<IntegrationHeaderSection
					slug={slug}
					capabilitiesSlot={
						<Suspense fallback={<IntegrationCapabilitiesSkeleton />}>
							<IntegrationCapabilitiesSection slug={slug} />
						</Suspense>
					}
				/>
			</Suspense>
		</main>
	);
}
