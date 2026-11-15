import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ossIntegrationSeoText } from '@/lib/page-seo';
import { socialMetadata } from '@/lib/social-metadata';
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
		const { title, description } = ossIntegrationSeoText(integration.name);
		const path = `/oss/${slug}`;
		return {
			title,
			description,
			alternates: { canonical: path },
			...socialMetadata({
				title: `${integration.name} | Corsair OSS`,
				description,
				path,
			}),
		};
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
