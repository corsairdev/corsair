import type { Metadata, Viewport } from 'next';
import { Aleo, Azeret_Mono, Host_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import '@/components/landing/theme.css';
import { cn } from '@/lib/utils';

const hostGrotesk = Host_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
	variable: '--font-landing-sans',
	display: 'swap',
});

const aleo = Aleo({
	subsets: ['latin'],
	weight: ['300'],
	variable: '--font-landing-serif',
	display: 'swap',
});

const azeretMono = Azeret_Mono({
	subsets: ['latin'],
	weight: ['300', '500'],
	variable: '--font-landing-mono',
	display: 'swap',
});

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

export const metadata: Metadata = {
	metadataBase: new URL('https://corsair.dev'),
	title: {
		default: 'Corsair — Open Source Integration Layer for AI Agents',
		template: '%s | Corsair',
	},
	description:
		'Corsair helps AI products add secure, multi-tenant integrations with OAuth, permissions, MCP, webhooks, and hosted or self-hosted execution.',
	alternates: {
		canonical: '/',
	},
	icons: {
		icon: '/corsair-logo.ico',
		shortcut: '/corsair-logo.ico',
		apple: '/corsair-logo.ico',
	},
	openGraph: {
		title: 'Corsair — Open Source Integration Layer for AI Agents',
		description:
			'Corsair helps AI products add secure, multi-tenant integrations with OAuth, permissions, MCP, webhooks, and hosted or self-hosted execution.',
		url: 'https://corsair.dev',
		siteName: 'Corsair',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Corsair — Open Source Integration Layer for AI Agents',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Corsair — Open Source Integration Layer for AI Agents',
		description:
			'Corsair helps AI products add secure, multi-tenant integrations with OAuth, permissions, MCP, webhooks, and hosted or self-hosted execution.',
		images: ['/og-image.png'],
	},
};

const jsonLd = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'Organization',
			'@id': 'https://corsair.dev/#organization',
			name: 'Corsair',
			url: 'https://corsair.dev',
			logo: 'https://corsair.dev/corsair-logo.png',
			sameAs: [
				'https://github.com/corsairdev/corsair',
				'https://x.com/corsairdotdev',
			],
		},
		{
			'@type': 'WebSite',
			'@id': 'https://corsair.dev/#website',
			url: 'https://corsair.dev',
			name: 'Corsair',
			publisher: {
				'@id': 'https://corsair.dev/#organization',
			},
		},
		{
			'@type': 'SoftwareApplication',
			'@id': 'https://corsair.dev/#software',
			name: 'Corsair',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'All',
			description:
				'Corsair helps AI products add secure, multi-tenant integrations with OAuth, permissions, MCP, webhooks, and hosted or self-hosted execution.',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD',
			},
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				'scroll-smooth',
				hostGrotesk.variable,
				aleo.variable,
				azeretMono.variable,
			)}
		>
			<body className="min-h-screen antialiased">
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
					}}
				/>
				{children}
			</body>
		</html>
	);
}
