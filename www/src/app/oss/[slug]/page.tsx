import type { Metadata } from 'next';
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
