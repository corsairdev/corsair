import {
	formatIntegrationIssueLabel,
	formatIntegrationPrLabel,
} from '@/lib/integration-urls';
import { cn } from '@/lib/utils';

type IntegrationUrls = {
	issueUrl: string | null;
	prUrl: string | null;
};

const chipClassName =
	'inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-muted';

export function IntegrationLinkLabels({
	urls,
	layout = 'inline',
}: {
	urls: IntegrationUrls;
	layout?: 'inline' | 'stacked';
}) {
	const issue = formatIntegrationIssueLabel(urls.issueUrl);
	const pr = formatIntegrationPrLabel(urls.prUrl);

	if (!issue && !pr) {
		return null;
	}

	const content = (
		<>
			{issue ? (
				<a href={issue.href} className={chipClassName} target="_blank">
					{issue.label}
				</a>
			) : null}
			{pr ? (
				<a href={pr.href} className={chipClassName} target="_blank">
					{pr.label}
				</a>
			) : null}
		</>
	);

	return (
		<div
			className={cn(
				layout === 'stacked'
					? 'flex flex-col items-start gap-2'
					: 'ml-2 inline-flex items-center gap-2',
			)}
		>
			{content}
		</div>
	);
}
