import {
	ClaimIntegrationButton,
	SignInToClaimLink,
} from '../claim-integration-button';
import { FramedPanel } from '../framed-panel';
import { IntegrationRewardDisplay } from '../integration-reward-display';

export function IntegrationClaimCallout({
	integrationId,
	integrationSlug,
	integrationName,
	points,
	session,
	canClaimAnother = true,
	wipIntegrationName,
}: {
	integrationId: string;
	integrationSlug: string;
	integrationName: string;
	points: number;
	session: boolean;
	canClaimAnother?: boolean;
	wipIntegrationName?: string | null;
}) {
	return (
		<section className="mb-8">
			<FramedPanel>
				<div className="px-6 py-8 sm:px-8">
					<p className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
						Available to claim
					</p>
					<p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#1c1c1c99]">
						Build and ship the{' '}
						<span className="font-medium text-[#1c1c1c]">
							{integrationName}
						</span>{' '}
						plugin to earn{' '}
						<IntegrationRewardDisplay
							points={points}
							variant="inline"
							className="font-[family-name:var(--font-landing-mono)] text-[#1c1c1c]"
						/>
						{' when we merge it to main.'} You have 1 hour to link an issue, then
						3 hours to open a PR with the plugin scaffold.
					</p>
					<div className="mt-6">
						{session ? (
							<ClaimIntegrationButton
								integrationId={integrationId}
								integrationSlug={integrationSlug}
								size="lg"
								disabled={!canClaimAnother}
								wipIntegrationName={wipIntegrationName}
							/>
						) : (
							<SignInToClaimLink />
						)}
					</div>
				</div>
			</FramedPanel>
		</section>
	);
}
