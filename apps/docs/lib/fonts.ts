import { Geist, Geist_Mono } from 'next/font/google';

const fontSans = Geist({
	subsets: ['latin'],
	variable: '--font-geist-sans',
	display: 'swap',
});

const fontMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
	display: 'swap',
});

export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;
