import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { CorsairLogo } from '@/components/logo';

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: <CorsairLogo />,
			url: '/introduction',
		},
		githubUrl: 'https://github.com/corsairdev/corsair',
		links: [
			{
				type: 'main',
				text: 'Website',
				url: 'https://corsair.dev',
				on: 'nav',
			},
			{
				type: 'main',
				text: 'Plugins',
				url: '/guides/plugins',
				on: 'nav',
			},
		],
	};
}
