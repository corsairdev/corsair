import { ClaimIntegrationButton, SignInToClaimLink } from '../claim-integration-button';
import { FramedPanel } from '../framed-panel';

export function IntegrationClaimCallout({
	integrationId,
	integrationSlug,
	integrationName,
	points,
	session,
}: {
	integrationId: string;
	integrationSlug: string;
	integrationName: string;
	points: number;
	session: boolean;
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
						<span className="font-medium text-[#1c1c1c]">{integrationName}</span>{' '}
						plugin to earn{' '}
						<span className="font-[family-name:var(--font-landing-mono)] font-medium text-[#1c1c1c]">
							{points} pts
						</span>
						.
					</p>
					<div className="mt-6">
						{session ? (
							<ClaimIntegrationButton
								integrationId={integrationId}
								integrationSlug={integrationSlug}
								size="lg"
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
