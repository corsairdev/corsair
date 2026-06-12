'use client';

import type { ReactNode } from 'react';

import { IntegrationListSkeleton } from './integration-list-skeleton';
import { useOssNavigation } from './oss-navigation';

export function OssIntegrationsResults({ children }: { children: ReactNode }) {
	const { isPending } = useOssNavigation();

	if (isPending) {
		return <IntegrationListSkeleton />;
	}

	return children;
}
