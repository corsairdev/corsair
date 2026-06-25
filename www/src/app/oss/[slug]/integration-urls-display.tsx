import { cn } from '@/lib/utils';

type IntegrationUrls = {
	issueUrl: string | null;
	prUrl: string | null;
	docsUrl: string | null;
};

const linkRows = [
	{ key: 'issueUrl' as const, label: 'Issue' },
	{ key: 'prUrl' as const, label: 'PR' },
	{ key: 'docsUrl' as const, label: 'Docs' },
];

export function IntegrationUrlsDisplay({
	urls,
	variant = 'default',
}: {
	urls: IntegrationUrls;
	variant?: 'default' | 'sidebar';
}) {
	const visibleRows = linkRows.filter((row) => urls[row.key]);

	if (visibleRows.length === 0) {
		return null;
	}

	if (variant === 'sidebar') {
		return (
			<ul className="m-0 space-y-2 p-0">
				{visibleRows.map((row) => {
					const href = urls[row.key];
					if (!href) return null;

					return (
						<li key={row.key}>
							<a
								href={href}
								target="_blank"
								rel="noreferrer"
								className="group flex flex-col gap-0.5 no-underline"
							>
								<span className="font-[family-name:var(--font-landing-mono)] text-[10px] font-medium tracking-[0.02em] text-[#1c1c1c66] uppercase">
									{row.label}
								</span>
								<span className="truncate text-[13px] text-[#1c1c1c] group-hover:text-[#4a38f5] group-hover:underline">
									{href}
								</span>
							</a>
						</li>
					);
				})}
			</ul>
		);
	}

	return (
		<ul className="m-0 flex flex-col gap-2 p-0">
			{visibleRows.map((row) => {
				const href = urls[row.key];
				if (!href) return null;

				return (
					<li
						key={row.key}
						className={cn(
							'flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5',
						)}
					>
						<span className="mt-0.5 shrink-0 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium">
							{row.label}
						</span>
						<a
							href={href}
							className="break-all text-sm text-foreground underline-offset-2 hover:underline"
							target="_blank"
							rel="noreferrer"
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
