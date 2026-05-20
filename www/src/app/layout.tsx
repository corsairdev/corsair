import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Aleo, Azeret_Mono, Host_Grotesk } from 'next/font/google';
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

export const metadata: Metadata = {
	title: 'Corsair — Add any integration in minutes',
	description:
		'Corsair is the open source integration layer for products and agents.',
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
			<body className="min-h-screen antialiased">{children}</body>
		</html>
	);
}
