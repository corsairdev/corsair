import { WorksWithSection } from '@/components/integrations/combo/works-with-section';
import { IntegrationDetailHero } from '@/components/integrations/detail/integration-detail-hero';
import { IntegrationFaqSection } from '@/components/integrations/detail/integration-faq-section';
import { IntegrationHubCta } from '@/components/integrations/detail/integration-hub-cta';
import { IntegrationMcpSetup } from '@/components/integrations/detail/integration-mcp-setup';
import { IntegrationToolsSection } from '@/components/integrations/detail/integration-tools-section';
import { IntegrationUseCasesSection } from '@/components/integrations/detail/integration-use-cases-section';
import {
	orderCapabilityGroups,
	visibleTriggerGroups,
} from '@/lib/integration-capabilities';
import type { IntegrationDetailData } from '@/lib/integration-page.types';
import {
	buildIntegrationJsonLd,
	countToolsByRisk,
	escapeJsonLd,
	integrationMcpFaqs,
} from '@/lib/integration-seo';
import { featuredOperationIds } from '@/lib/use-cases';

// Order: what the app can do (prompts, then every tool), then how to connect,
// then related apps and questions. The Connect card near the top links down to
// the setup steps for anyone ready to connect.
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
	const operations = orderCapabilityGroups(
		integration.operations,
		featuredOperationIds(integration.id),
	);
	const triggers = orderCapabilityGroups(
		visibleTriggerGroups(integration.triggers),
	);

	return (
		<main className="pb-16">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: escapeJsonLd(JSON.stringify(jsonLd)),
				}}
			/>
			<IntegrationDetailHero
				integration={{
					...integration,
					// Match the Triggers tab, which leaves out webhook plumbing.
					counts: {
						...integration.counts,
						webhooks: triggers.reduce((n, g) => n + g.actions.length, 0),
					},
				}}
			/>
			<IntegrationHubCta
				pluginId={integration.id}
				displayName={integration.displayName}
			/>
			<IntegrationUseCasesSection
				integrationId={integration.id}
				displayName={integration.displayName}
			/>
			<IntegrationToolsSection
				displayName={integration.displayName}
				operations={operations}
				triggers={triggers}
			/>
			<IntegrationMcpSetup integration={integration} />
			<WorksWithSection
				integrationId={integration.id}
				displayName={integration.displayName}
			/>
			<IntegrationFaqSection faqs={faqs} />
		</main>
	);
}
