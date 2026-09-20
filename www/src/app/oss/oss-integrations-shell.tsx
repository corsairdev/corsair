'use client';

import type { ReactNode } from 'react';

import { IntegrationSearch } from './integration-search';
import { OssIntegrationsResults } from './oss-integrations-results';
import { OssNavigationProvider } from './oss-navigation';
import type { OssIntegrationsView } from './view-tabs';
import { ViewTabs } from './view-tabs';

type OssIntegrationsShellProps = {
	q: string;
	selectedTags: string[];
	view: OssIntegrationsView;
	tagFilter: ReactNode;
	integrationsContent: ReactNode;
	leaderboardContent: ReactNode;
};

function OssIntegrationsShellInner({
	q,
	view,
	tagFilter,
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
					{tagFilter}
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
