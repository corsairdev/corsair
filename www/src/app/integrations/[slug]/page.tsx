import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IntegrationDetailPage } from '@/components/integrations/detail/integration-detail-page';
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

	return {
		title: `${integration.displayName} Integration`,
		description: integration.blurb,
		alternates: {
			canonical: `/integrations/${slug}`,
		},
		openGraph: {
			title: `${integration.displayName} Integration | Corsair`,
			description: integration.blurb,
			url: `https://corsair.dev/integrations/${slug}`,
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
