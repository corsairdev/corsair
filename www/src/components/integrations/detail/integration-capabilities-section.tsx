import { IntegrationCapabilityTabs } from '@/components/integrations/detail/integration-capability-tabs';
import type { IntegrationDetailData } from '@/lib/integration-page.types';

export function IntegrationCapabilitiesSection({
	operations,
	triggers,
}: {
	operations: IntegrationDetailData['operations'];
	triggers: IntegrationDetailData['triggers'];
}) {
	return (
		<section className="py-10 md:py-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.06em] text-[#1c1c1c66]">
					Supported operations
				</h2>
				<IntegrationCapabilityTabs groups={operations} showPopular />

				{triggers.length > 0 ? (
					<>
						<h2 className="mt-12 font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.06em] text-[#1c1c1c66]">
							Supported triggers
						</h2>
						<IntegrationCapabilityTabs groups={triggers} showPopular={false} />
					</>
				) : null}
			</div>
		</section>
	);
}
