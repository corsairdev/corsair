import { IntegrationCapabilitiesSection } from '@/components/integrations/detail/integration-capabilities-section';
import { IntegrationDetailHero } from '@/components/integrations/detail/integration-detail-hero';
import { IntegrationFaqSection } from '@/components/integrations/detail/integration-faq-section';
import type { IntegrationDetailData } from '@/lib/integration-page.types';

export function IntegrationDetailPage({
	integration,
}: {
	integration: IntegrationDetailData;
}) {
	return (
		<main className="pb-16">
			<IntegrationDetailHero integration={integration} />
			<IntegrationCapabilitiesSection
				operations={integration.operations}
				triggers={integration.triggers}
			/>
			<IntegrationFaqSection faqs={integration.faqs} />
		</main>
	);
}
