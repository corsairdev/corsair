'use client';

import { CaretDown, RocketLaunch } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { integrationToPluginName } from '@/lib/integration-plugin-name';
import {
	DISCORD_URL,
	DOCS_URL,
	GITHUB_ISSUES_URL,
	GITHUB_URL,
} from '@/lib/site-links';
import { cn } from '@/lib/utils';

import { CopyableCommand } from './copyable-command';

export function ContributorGettingStartedCallout({
	integrationName,
	integrationSlug,
	githubUsername,
	defaultOpen = false,
}: {
	integrationName: string;
	integrationSlug: string;
	githubUsername: string | null;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const pluginName = integrationToPluginName(integrationName, integrationSlug);

	const cloneCommand = githubUsername
		? `git clone https://github.com/${githubUsername}/corsair.git
cd corsair
pnpm install`
		: `git clone https://github.com/<your-username>/corsair.git
cd corsair
pnpm install`;

	const branchCommand = `git checkout -b feat/${integrationSlug}-plugin`;

	const generateCommand = `pnpm run generate:plugin ${pluginName}`;

	const testCommand = `cd demo/testing
pnpm test`;

	useEffect(() => {
		if (!defaultOpen) {
			return;
		}

		const url = new URL(window.location.href);
		if (!url.searchParams.has('gettingStarted')) {
			return;
		}

		url.searchParams.delete('gettingStarted');
		const nextUrl = `${url.pathname}${url.search}${url.hash}`;
		window.history.replaceState({}, '', nextUrl);
	}, [defaultOpen]);

	return (
		<section className="mb-6">
			<details
				open={defaultOpen}
				onToggle={(event) => setOpen(event.currentTarget.open)}
				className="overflow-hidden rounded-xl border border-[#d3e3fd] bg-[#f0f6ff] shadow-sm"
			>
				<style>{`summary::-webkit-details-marker { display: none; }`}</style>
				<summary
					className={cn(
						'flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold select-none',
						'hover:bg-[#e8f0fe]/50',
					)}
				>
					<CaretDown
						size={14}
						aria-hidden
						className="shrink-0 transition-transform duration-150"
						style={{
							transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
						}}
					/>
					<RocketLaunch size={16} className="text-[#1a4a8a]" aria-hidden />
					<span>Getting started — build the {integrationName} plugin</span>
					<Badge variant="accent" className="ml-auto text-[10px]">
						Guide
					</Badge>
				</summary>
				<div className="border-t border-[#d3e3fd] px-4 py-4 text-sm">
					<p className="mb-4 text-muted-foreground">
						You claimed this integration. Follow these steps to contribute the{' '}
						<Badge variant="outline" className="font-mono text-[10px]">
							{integrationSlug}
						</Badge>{' '}
						plugin to Corsair.
					</p>

					<ol className="m-0 list-decimal space-y-4 pl-5">
						<li>
							<strong>Open an issue first.</strong> Search{' '}
							<a
								href={GITHUB_ISSUES_URL}
								className="font-medium text-foreground underline-offset-2 hover:underline"
							>
								existing issues
							</a>{' '}
							and file an integration request if needed. Include API docs,
							endpoints, webhook needs, and auth constraints.
						</li>
						<li>
							<strong>Fork and clone the repo.</strong>{' '}
							<a
								href={`${GITHUB_URL}/fork`}
								className="font-medium text-foreground underline-offset-2 hover:underline"
								target="_blank"
							>
								Fork corsair on GitHub
							</a>
							, then clone your fork and install dependencies:
							<CopyableCommand command={cloneCommand} />
						</li>
						<li>
							<strong>Create a branch.</strong>
							<CopyableCommand command={branchCommand} />
						</li>
						<li>
							<strong>Generate the plugin scaffold.</strong> From the repo root,
							run the generator with PascalCase plugin name{' '}
							<Badge variant="outline" className="font-mono text-[10px]">
								{pluginName}
							</Badge>
							:
							<CopyableCommand command={generateCommand} />
							See the{' '}
							<a
								href={`${DOCS_URL}/guides/create-your-own-plugin`}
								className="font-medium text-foreground underline-offset-2 hover:underline"
								target="_blank"
							>
								Create Your Own Plugin
							</a>{' '}
							guide for details.
						</li>
						<li>
							<strong>Implement the integration.</strong> Add endpoints, auth,
							schemas, and webhooks where the provider supports them.
						</li>
						<li>
							<strong>Test in demo/testing.</strong> Register the plugin in{' '}
							<code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
								demo/testing/src/server/corsair.ts
							</code>
							, exercise it from{' '}
							<code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
								demo/testing/src/scripts/test-script.ts
							</code>
							, then run:
							<CopyableCommand command={testCommand} />
						</li>
						<li>
							<strong>Add your links below.</strong> Save the issue URL, PR URL,
							and docs URL on this page so others can follow your work.
						</li>
						<li>
							<strong>Open a pull request.</strong> Link the issue, describe the
							API surface, and explain how you tested it.
						</li>
					</ol>

					<p className="mt-4 text-xs text-muted-foreground">
						Stuck? Open an issue or ask on{' '}
						<a
							href={DISCORD_URL}
							className="font-medium text-foreground underline-offset-2 hover:underline"
							target="_blank"
						>
							Discord
						</a>
						.
					</p>
				</div>
			</details>
		</section>
	);
}
