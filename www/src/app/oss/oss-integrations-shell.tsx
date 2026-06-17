'use client';

import type { ReactNode } from 'react';

import { IntegrationSearch } from './integration-search';
import { IntegrationTagFilter } from './integration-tag-filter';
import { OssIntegrationsResults } from './oss-integrations-results';
import { OssNavigationProvider } from './oss-navigation';
import type { OssIntegrationsView } from './view-tabs';
import { ViewTabs } from './view-tabs';

type OssIntegrationsShellProps = {
	q: string;
	selectedTags: string[];
	tags: Array<{
		slug: string;
		name: string;
		color: string;
		integrationCount: number;
	}> | null;
	view: OssIntegrationsView;
	integrationsContent: ReactNode;
	leaderboardContent: ReactNode;
};

function OssIntegrationsShellInner({
	q,
	selectedTags,
	tags,
	view,
	integrationsContent,
	leaderboardContent,
}: OssIntegrationsShellProps) {
	return (
		<>
			<div className="mb-6">
				<ViewTabs activeView={view} />
			</div>

			{view === 'integrations' ? (
				<div className="mb-4 space-y-3">
					<IntegrationSearch defaultValue={q} />
					{tags ? (
						<IntegrationTagFilter tags={tags} selectedSlugs={selectedTags} />
					) : null}
				</div>
			) : null}

			{view === 'integrations' ? (
				<OssIntegrationsResults>{integrationsContent}</OssIntegrationsResults>
			) : (
				leaderboardContent
			)}
		</>
	);
}

export function OssIntegrationsShell(props: OssIntegrationsShellProps) {
	return (
		<OssNavigationProvider>
			<OssIntegrationsShellInner {...props} />
		</OssNavigationProvider>
	);
}
