import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Corsair Demo - Next.js + tRPC + Inngest',
	description: 'Integration platform demo with Slack and Linear',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
