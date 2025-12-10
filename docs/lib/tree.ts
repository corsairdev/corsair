export const tree = {
	name: 'Documentation',
	children: [
		{
			type: 'page' as const,
			name: 'Introduction',
			url: '/docs',
		},
		{
			type: 'separator' as const,
			name: 'Getting Started',
		},
		{
			type: 'page' as const,
			name: 'Overview',
			url: '/docs/overview',
		},
		{
			type: 'page' as const,
			name: 'Installation',
			url: '/docs/installation',
		},
		{
			type: 'page' as const,
			name: 'Quickstart',
			url: '/docs/quickstart',
		},
		{
			type: 'separator' as const,
			name: 'Guides',
		},
		{
			type: 'page' as const,
			name: 'Core Concepts',
			url: '/docs/core-concepts',
		},
		{
			type: 'page' as const,
			name: 'Type Safety',
			url: '/docs/type-safety',
		},
		{
			type: 'page' as const,
			name: 'CLI',
			url: '/docs/cli',
		},
		{
			type: 'page' as const,
			name: 'Adapters',
			url: '/docs/adapters',
		},
		{
			type: 'page' as const,
			name: 'Plugins',
			url: '/docs/plugins',
		},
		{
			type: 'page' as const,
			name: 'Examples',
			url: '/docs/examples',
		},
	],
};
