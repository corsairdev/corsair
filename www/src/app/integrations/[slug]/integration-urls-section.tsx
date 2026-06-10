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
}: {
	integrationId: string;
	urls: IntegrationUrls;
	canEdit: boolean;
}) {
	if (!canEdit && !hasIntegrationUrls(urls)) {
		return null;
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
				</div>
			) : (
				<IntegrationUrlsDisplay urls={urls} />
			)}
		</section>
	);
}
