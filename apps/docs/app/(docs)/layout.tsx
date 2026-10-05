import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { cache } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

const getPageTree = cache(() => source.getPageTree());

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<RootProvider
			theme={{ defaultTheme: 'light' }}
			search={{
				links: [
					['Introduction', '/introduction'],
					['Quick start', '/quick-start'],
					['Slack plugin', '/plugins/slack/overview'],
					['Plugin catalog', '/guides/plugins'],
				],
			}}
		>
			<DocsLayout
				tree={getPageTree()}
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
		</RootProvider>
	);
}
