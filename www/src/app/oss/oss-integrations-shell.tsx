'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { IntegrationSearch } from './integration-search';
import { OssIntegrationsResults } from './oss-integrations-results';
import { OssNavigationProvider } from './oss-navigation';

type OssIntegrationsShellProps = {
	q: string;
	tagFilter: ReactNode;
	integrationsContent: ReactNode;
};

function OssIntegrationsShellInner({
	q,
	tagFilter,
	integrationsContent,
}: OssIntegrationsShellProps) {
	return (
		<>
			<div className="mb-4 space-y-3">
				<Suspense fallback={null}>
					<IntegrationSearch defaultValue={q} />
				</Suspense>
				{tagFilter}
			</div>
			<OssIntegrationsResults>{integrationsContent}</OssIntegrationsResults>
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
