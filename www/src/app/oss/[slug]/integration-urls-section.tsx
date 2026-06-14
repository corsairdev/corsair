import type { UserIntegrationStatus } from '@/db/schema';

import {
	FinishedStatusCallout,
	MarkFinishedButton,
} from '../mark-finished-button';
import {
	hasIntegrationUrls,
	IntegrationUrlsDisplay,
} from './integration-urls-display';
import { IntegrationUrlsForm } from './integration-urls-form';

type IntegrationUrls = {
	issueUrl: string | null;
	prUrl: string | null;
	docsUrl: string | null;
};

export function IntegrationUrlsSection({
	integrationId,
	urls,
	canEdit,
	status,
	variant = 'default',
}: {
	integrationId: string;
	urls: IntegrationUrls;
	canEdit: boolean;
	status: UserIntegrationStatus | null;
	variant?: 'default' | 'sidebar';
}) {
	if (!canEdit && !hasIntegrationUrls(urls)) {
		return null;
	}

	if (variant === 'sidebar') {
		return (
			<section>
				<h2 className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					Links
				</h2>
				<div className="mt-4">
					{canEdit ? (
						<div className="space-y-4">
							<p className="text-[13px] leading-relaxed text-[#1c1c1c66]">
								Add links for the issue, pull request, and documentation for this
								integration.
							</p>
							<IntegrationUrlsForm integrationId={integrationId} urls={urls} />
							{status === 'finished' ? (
								<FinishedStatusCallout />
							) : (
								<MarkFinishedButton
									integrationId={integrationId}
									hasRequiredUrls={Boolean(urls.issueUrl && urls.prUrl)}
								/>
							)}
						</div>
					) : (
						<IntegrationUrlsDisplay urls={urls} variant="sidebar" />
					)}
				</div>
			</section>
		);
	}

	return (
		<section className="mb-8">
			<h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
				Links
			</h2>
			{canEdit ? (
				<div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
					<p className="mb-4 text-sm text-muted-foreground">
						Add links for the issue, pull request, and documentation for this
						integration.
					</p>
					<IntegrationUrlsForm integrationId={integrationId} urls={urls} />
					{status === 'finished' ? (
						<FinishedStatusCallout />
					) : (
						<MarkFinishedButton
							integrationId={integrationId}
							hasRequiredUrls={Boolean(urls.issueUrl && urls.prUrl)}
						/>
					)}
				</div>
			) : (
				<IntegrationUrlsDisplay urls={urls} />
			)}
		</section>
	);
}
