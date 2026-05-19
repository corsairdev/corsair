import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
});

export const metadata: Metadata = {
	title: 'Corsair',
	description: 'The integration layer for AI agents.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn('dark scroll-smooth font-mono', jetbrainsMono.variable)}
		>
			<body className="min-h-screen bg-background antialiased text-foreground">
				{children}
			</body>
		</html>
	);
}
