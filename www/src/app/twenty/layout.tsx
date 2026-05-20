import { Aleo, Azeret_Mono, Host_Grotesk } from 'next/font/google';
import '@/components/twenty-landing/twenty-theme.css';

const hostGrotesk = Host_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
	variable: '--font-twenty-sans',
	display: 'swap',
});

const aleo = Aleo({
	subsets: ['latin'],
	weight: ['300'],
	variable: '--font-twenty-serif',
	display: 'swap',
});

const azeretMono = Azeret_Mono({
	subsets: ['latin'],
	weight: ['300', '500'],
	variable: '--font-twenty-mono',
	display: 'swap',
});

export const metadata = {
	title: 'Corsair — Add any integration in minutes',
	description:
		'Corsair is the open source integration layer for products and agents.',
};

export default function TwentyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className={`${hostGrotesk.variable} ${aleo.variable} ${azeretMono.variable}`}
		>
			{children}
		</div>
	);
}
