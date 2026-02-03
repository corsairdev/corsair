import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Corsair Fly.io Demo',
	description: 'A demo app with Inngest, Drizzle, and Corsair',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
