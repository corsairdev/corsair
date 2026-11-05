import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IntegrationDetailPage } from '@/components/integrations/detail/integration-detail-page';
import {
	integrationMetaDescription,
	integrationMetaTitle,
} from '@/lib/integration-seo';
import { getCatalogIntegrationById } from '@/server/catalog-integration-cache';

type PageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const integration = await getCatalogIntegrationById(slug);

	if (!integration) {
		return { title: 'Integration not found' };
	}

	const title = integrationMetaTitle(integration.displayName);
	const description = integrationMetaDescription(
		integration.displayName,
		integration.counts.api,
	);

	return {
		title,
		description,
		alternates: {
			canonical: `/integrations/${slug}`,
		},
		openGraph: {
			title: `${title} | Corsair`,
			description,
			url: `https://corsair.dev/integrations/${slug}`,
			images: [{ url: '/og-image.png', width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${title} | Corsair`,
			description,
			images: ['/og-image.png'],
		},
	};
}

export default async function IntegrationDetailRoute({ params }: PageProps) {
	const { slug } = await params;
	const integration = await getCatalogIntegrationById(slug);

	if (!integration) {
		notFound();
	}

	return <IntegrationDetailPage integration={integration} />;
}
