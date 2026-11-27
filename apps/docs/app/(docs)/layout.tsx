import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

// The docs layout itself is rendered per page (components/docs-shell.tsx).
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
			{children}
		</RootProvider>
	);
}
