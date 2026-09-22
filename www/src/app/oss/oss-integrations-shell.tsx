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
	pickButton: ReactNode;
	tagFilter: ReactNode;
	integrationsContent: ReactNode;
	leaderboardContent: ReactNode;
};

function OssIntegrationsShellInner({
	q,
	view,
	pickButton,
	tagFilter,
	integrationsContent,
	leaderboardContent,
}: OssIntegrationsShellProps) {
	return (
		<>
			<div className="mb-6 flex items-end justify-between gap-4 border-b border-[#1c1c1c1a]">
				<ViewTabs activeView={view} />
				{view === 'integrations' ? (
					<div className="pb-2">{pickButton}</div>
				) : null}
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
