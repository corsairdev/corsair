import { IntegrationFaqAccordion } from '@/components/integrations/detail/integration-faq-accordion';
import type { IntegrationDetailData } from '@/lib/integration-page.types';

export function IntegrationFaqSection({
	faqs,
}: {
	faqs: IntegrationDetailData['faqs'];
}) {
	return <IntegrationFaqAccordion faqs={faqs} />;
}
