import { Badge } from '@/components/ui/badge';

type IntegrationUrls = {
	issueUrl: string | null;
	prUrl: string | null;
	docsUrl: string | null;
};

const linkRows = [
	{ key: 'issueUrl' as const, label: 'Issue', variant: 'accent' as const },
	{ key: 'prUrl' as const, label: 'PR', variant: 'success' as const },
	{ key: 'docsUrl' as const, label: 'Docs', variant: 'secondary' as const },
];

export function IntegrationUrlsDisplay({ urls }: { urls: IntegrationUrls }) {
	const visibleRows = linkRows.filter((row) => urls[row.key]);

	if (visibleRows.length === 0) {
		return null;
	}

	return (
		<ul className="m-0 flex flex-col gap-2 p-0">
			{visibleRows.map((row) => {
				const href = urls[row.key];
				if (!href) return null;

				return (
					<li
						key={row.key}
						className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
					>
						<Badge
							variant={row.variant}
							className="mt-0.5 shrink-0 text-[10px]"
						>
							{row.label}
						</Badge>
						<a
							href={href}
							className="break-all text-sm text-foreground underline-offset-2 hover:underline"
							target="_blank"
						>
							{href}
						</a>
					</li>
				);
			})}
		</ul>
	);
}

export function hasIntegrationUrls(urls: IntegrationUrls) {
	return Boolean(urls.issueUrl || urls.prUrl || urls.docsUrl);
}
