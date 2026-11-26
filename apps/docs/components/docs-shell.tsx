import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { treeForPage } from '@/lib/nav';
import { getPageTree } from '@/lib/source';

/**
 * The docs layout, rendered by each page rather than app/(docs)/layout.tsx:
 * a layout can't see the URL, and each page sends only the part of the
 * sidebar it shows (see treeForPage).
 */
export function DocsShell({
	url,
	children,
}: {
	url: string;
	children: ReactNode;
}) {
	return (
		<DocsLayout
			tree={treeForPage(getPageTree(), url)}
			{...baseOptions()}
			tabMode="navbar"
			sidebar={{
				collapsible: true,
				defaultOpenLevel: 0,
				prefetch: false,
			}}
		>
			{children}
		</DocsLayout>
	);
}
