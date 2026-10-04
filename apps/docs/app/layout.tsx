import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from '@/lib/fonts';
import './global.css';

export const metadata: Metadata = {
	metadataBase: new URL('https://docs.corsair.dev'),
	title: {
		default: 'Corsair Docs',
		template: '%s · Corsair Docs',
	},
	description:
		'Documentation for Corsair — the open-source integration layer for agents and apps.',
	icons: {
		icon: '/favicon.ico',
	},
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning className={fontVariables}>
			<body className="flex min-h-screen flex-col">
				<div className="docs-gradient-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />
				{children}
			</body>
		</html>
	);
}
