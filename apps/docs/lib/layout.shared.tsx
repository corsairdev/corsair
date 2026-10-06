import { GithubInfo } from 'fumadocs-ui/components/github-info';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { CorsairLogo } from '@/components/logo';

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: <CorsairLogo />,
			url: '/introduction',
		},
		links: [
			{
				type: 'main',
				text: 'Website',
				url: 'https://corsair.dev',
				on: 'nav',
			},
			// Replaces `githubUrl`, which renders a bare icon. The old Mintlify
			// navbar showed the star count.
			{
				type: 'custom',
				children: <GithubInfo owner="corsairdev" repo="corsair" />,
				on: 'nav',
			},
		],
	};
}
