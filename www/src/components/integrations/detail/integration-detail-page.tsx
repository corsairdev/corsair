import { WorksWithSection } from '@/components/integrations/combo/works-with-section';
import { IntegrationCapabilitiesSection } from '@/components/integrations/detail/integration-capabilities-section';
import { IntegrationDetailHero } from '@/components/integrations/detail/integration-detail-hero';
import { IntegrationFaqSection } from '@/components/integrations/detail/integration-faq-section';
import { IntegrationHubCta } from '@/components/integrations/detail/integration-hub-cta';
import { IntegrationMcpSetup } from '@/components/integrations/detail/integration-mcp-setup';
import type { IntegrationDetailData } from '@/lib/integration-page.types';
import {
	buildIntegrationJsonLd,
	countToolsByRisk,
	escapeJsonLd,
	integrationMcpFaqs,
} from '@/lib/integration-seo';

export function IntegrationDetailPage({
	integration,
}: {
	integration: IntegrationDetailData;
}) {
	const faqs = [
		...integration.faqs,
		...integrationMcpFaqs(
			integration.displayName,
			countToolsByRisk(integration.operations),
		),
	];
	const jsonLd = buildIntegrationJsonLd({
		id: integration.id,
		displayName: integration.displayName,
		faqs,
	});

	return (
		<main className="pb-16">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: escapeJsonLd(JSON.stringify(jsonLd)),
				}}
			/>
			<IntegrationDetailHero integration={integration} />
			<IntegrationHubCta
				pluginId={integration.id}
				displayName={integration.displayName}
			/>
			<IntegrationMcpSetup integration={integration} />
			<IntegrationCapabilitiesSection
				displayName={integration.displayName}
				operations={integration.operations}
				triggers={integration.triggers}
			/>
			<WorksWithSection
				integrationId={integration.id}
				displayName={integration.displayName}
			/>
			<IntegrationFaqSection faqs={faqs} />
		</main>
	);
}
