import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { GithubStars } from '@/components/github-stars';
import { CorsairLogo } from '@/components/logo';

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: <CorsairLogo />,
			url: '/introduction',
		},
		links: [
			{
				type: 'custom',
				on: 'nav',
				children: (
					<a
						href="https://corsair.dev"
						className="inline-flex items-center gap-1 self-center text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
					>
						Website
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							className="size-3.5"
						>
							<path d="M7 17 17 7" />
							<path d="M8 7h9v9" />
						</svg>
					</a>
				),
			},
			// Replaces `githubUrl`, which renders a bare icon. The old Mintlify
			// navbar showed the star count.
			{
				type: 'custom',
				on: 'nav',
				children: <GithubStars />,
			},
		],
	};
}
